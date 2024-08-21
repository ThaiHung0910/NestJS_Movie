import { AuthService } from 'src/utils/jwt';
import { Injectable } from '@nestjs/common';
import { CreatePhimDto } from './dto/create-phim.dto';
import { PrismaClient } from '@prisma/client';
import { UtilsService } from 'src/utils';
import { checkGroupCode, validationMovie } from 'src/utils/validation';
import { UpdatePhimDto } from './dto/update-phim.dto';


@Injectable()
export class PhimService {
  private prisma = new PrismaClient();
  constructor(
    private readonly utilsService: UtilsService,
    private readonly authService: AuthService
  ) { }

  private handleError(res: any, message: string, details: string, statusCode: number = 500) {
    this.utilsService.responseSend(res, message, details, statusCode);
  }

  private formatMovie(movie: any) {
    const { ma_phim, ten_phim, trailer, hinh_anh, mo_ta, ma_nhom, ngay_khoi_chieu, danh_gia, hot, dang_chieu, sap_chieu } = movie;
    return {
      maPhim: ma_phim,
      tenPhim: ten_phim,
      trailer,
      hinhAnh: hinh_anh,
      moTa: mo_ta,
      maNhom: ma_nhom,
      ngayKhoiChieu: ngay_khoi_chieu,
      danhGia: danh_gia,
      hot,
      dangChieu: dang_chieu,
      sapChieu: sap_chieu,
    };
  }

  private paginateMovies(movies: any[], page: number, numberItemPerPage: number) {
    const totalCount = movies.length;
    const totalPages = numberItemPerPage ? Math.ceil(totalCount / numberItemPerPage) : 1;
    const currentPage = page || 1;
    const startIndex = (currentPage - 1) * numberItemPerPage;
    const endIndex = startIndex + numberItemPerPage;

    const items = numberItemPerPage ? movies.slice(startIndex, endIndex).map(this.formatMovie) : movies.map(this.formatMovie);

    return {
      currentPage,
      count: items.length,
      totalPages,
      totalCount,
      items,
    };
  }

  private formatDate(date: string): Date | undefined {
    if (date) {
      const [day, month, year] = date.split(/[\/\-]/).map(Number);
      return new Date(year, month - 1, day);
    }
    return undefined;
  }


  async getBanner(res: any) {
    try {
      let banners = await this.prisma.banner.findMany()

      let result = banners.map(({ ma_banner, ma_phim, hinh_anh }) => ({
        maBanner: ma_banner,
        maPhim: ma_phim,
        hinhAnh: hinh_anh,
      }))

      this.utilsService.responseSend(res, "Xử lý thành công!", result, 200)
    } catch (err) {
      this.utilsService.responseSend(res, err.message, "", 500);
    }
  }


  async getListMovie(tenPhim: string, maNhom: string, res: any) {
    try {
      const where = {
        AND: [
          tenPhim ? { ten_phim: { contains: tenPhim.trim() } } : {},
          { ma_nhom: maNhom?.trim() || "GP01" }
        ]
      };

      const listMovies = await this.prisma.phim.findMany({ where });
      const formattedMovies = listMovies.map(this.formatMovie);

      this.utilsService.responseSend(res, "Xử lý thành công!", formattedMovies, 200);
    } catch (err) {
      this.utilsService.responseSend(res, err.message, "", 500);
    }
  }

  async getPaginationMovieList(maNhom: string, tenPhim: string, soTrang: number, soPhanTuTrenTrang: number, res: any) {
    try {
      let numberItemPerPage = Number(soPhanTuTrenTrang), page = Number(soTrang)


      if (soPhanTuTrenTrang && !Number.isInteger(numberItemPerPage)) {
        return this.handleError(res, "Dữ liệu không hợp lệ!", "Số phần tử trên trang không hợp lệ", 400);
      }
      if (soTrang && !Number.isInteger(page)) {
        return this.handleError(res, "Dữ liệu không hợp lệ!", "Số trang không hợp lệ", 400);
      }

      if (maNhom && !checkGroupCode(maNhom)) {
        return this.handleError(res, "Dữ liệu không hợp lệ!", "Mã nhóm không hợp lệ", 400);
      }

      const where = {
        AND: [
          { ma_nhom: maNhom || "GP01" },
          tenPhim ? { ten_phim: { contains: tenPhim } } : {}
        ]
      };

      const movies = await this.prisma.phim.findMany({ where });
      const result = this.paginateMovies(movies, page, numberItemPerPage);

      this.utilsService.responseSend(res, "Xử lý thành công!", result, 200);
    } catch (err) {
      this.utilsService.responseSend(res, err.message, "", 500);
    }

  }

  async getMovieListByDate(maNhom: string, tenPhim: string, soTrang: number, soPhanTuTrenTrang: number, tuNgay: string, denNgay: string, res: any) {
    try {
      let numberItemPerPage = Number(soPhanTuTrenTrang);
      let page = Number(soTrang);

      if (soPhanTuTrenTrang && !Number.isInteger(numberItemPerPage)) {
        return this.handleError(res, "Dữ liệu không hợp lệ!", "Số phần tử trên trang không hợp lệ", 400);
      }
      if (soTrang && !Number.isInteger(page)) {
        return this.handleError(res, "Dữ liệu không hợp lệ!", "Số trang không hợp lệ", 400);
      }

      if (maNhom && !checkGroupCode(maNhom)) {
        return this.handleError(res, "Yêu cầu không hợp lệ!", "Nhóm người dùng không hợp lệ", 400);
      }

      const formattedTuNgay = this.formatDate(tuNgay);
      const formattedDenNgay = this.formatDate(denNgay);


      let movies: any;


      if (!formattedTuNgay && !formattedDenNgay || !formattedTuNgay) {
        movies = []
      } else {
        const where = {
          ma_nhom: maNhom || "GP01",
          AND: [
            tenPhim ? { ten_phim: { contains: tenPhim } } : {},
            { ngay_khoi_chieu: { gte: formattedTuNgay, lte: formattedDenNgay } }
          ]
        };
        movies = await this.prisma.phim.findMany({
          where
        });

      }

      const result = this.paginateMovies(movies, page, numberItemPerPage);

      this.utilsService.responseSend(res, "Xử lý thành công!", result.items, 200);
    } catch (err) {
      this.utilsService.responseSend(res, err.message, "", 500);
    }
  }


  async getInfoMovie(maPhim: string, res: any) {
    try {
      if (!maPhim) {
        return this.handleError(res, "Không tìm thấy tài nguyên!", "Mã phim không hợp lệ", 400);
      }


      let movie = await this.prisma.phim.findUnique({
        where: {
          ma_phim: Number(maPhim)
        }
      })

      if (!movie) {
        return this.handleError(res, "Không tìm thấy tài nguyên!", "Mã phim không hợp lệ", 400);
      }

      const result = this.formatMovie(movie);
      this.utilsService.responseSend(res, "Xử lý thành công!", result, 200);

    } catch (err) {
      this.utilsService.responseSend(res, err.message, "", 500);
    }
  }

  async updateMovie(body: UpdatePhimDto, res: any) {
    try {
      let { tenPhim, hinhAnh, trailer, moTa, maNhom, ngayKhoiChieu, danhGia, hot, dangChieu, sapChieu } = body

      let validationMessage = validationMovie(body)
      if (validationMessage) {
        return this.handleError(res, "Dữ liệu không hợp lệ!", validationMessage, 403);
      }

      let movie = await this.prisma.phim.findFirst({
        where: {
          ten_phim: tenPhim
        }
      })

      if (!movie) {
        return this.handleError(res, "Dữ liệu không hợp lệ!", "Không tìm thấy phim!", 403);
      }

      let newMovie = {
        ten_phim: tenPhim,
        hinh_anh: hinhAnh,
        trailer: trailer,
        mo_ta: moTa,
        ma_nhom: maNhom.toUpperCase(),
        ngay_khoi_chieu: ngayKhoiChieu,
        danh_gia: Number(danhGia),
        hot: Boolean(hot),
        dang_chieu: Boolean(dangChieu),
        sap_chieu: Boolean(sapChieu),
      }


      await this.prisma.phim.update({
        where: {
          ma_phim: movie.ma_phim
        },
        data: newMovie
      })

      this.utilsService.responseSend(res, "Xử lý thành công!", movie, 200);
    } catch (err) {
      this.utilsService.responseSend(res, err.message, "", 500);
    }
  }


  async addMovie(body: CreatePhimDto, res: any) {
    try {
      let { tenPhim, hinhAnh, trailer, moTa, maNhom, ngayKhoiChieu, danhGia, hot, dangChieu, sapChieu } = body

      let validationMessage = validationMovie(body)
      if (validationMessage) {
        return this.handleError(res, "Dữ liệu không hợp lệ!", validationMessage, 403);
      }


      let newMovie = {
        ten_phim: tenPhim,
        hinh_anh: hinhAnh,
        trailer: trailer,
        mo_ta: moTa,
        ma_nhom: maNhom.toUpperCase(),
        ngay_khoi_chieu: ngayKhoiChieu,
        danh_gia: Number(danhGia),
        hot: Boolean(hot),
        dang_chieu: Boolean(dangChieu),
        sap_chieu: Boolean(sapChieu),
      }

      await this.prisma.phim.create({
        data: newMovie
      })


      this.utilsService.responseSend(res, "Xử lý thành công!", body, 200);
    } catch (err) {
      this.utilsService.responseSend(res, err.message, "", 500);
    }


  }



  async removeMovie(maPhim: string, req: any, res: any) {
    try {
      let ma_phim = Number(maPhim)

      let nguoiDungId = this.utilsService.getUserIdFromAuthorization(this.authService, req)

      let user = await this.prisma.nguoi_dung.findUnique({
        where: { ma_nguoi_dung: nguoiDungId },
      })

      if (user.loai_nguoi_dung == "KhachHang") {
        return this.utilsService.responseSend(res, "Dữ liệu không hợp lệ", "Bạn không có quyền xóa phim", 403);
      }

      if (!ma_phim) {
        return this.utilsService.responseSend(res, "Dữ liệu không hợp lệ", 'Mã phim không được để trống', 403)
      }

      let movie = await this.prisma.phim.findUnique({
        where: { ma_phim }
      })

      if (!movie) {
        return this.handleError(res, "Không tìm thấy tài nguyên!", "Mã phim không hợp lệ", 400);
      }

      await this.prisma.phim.delete({
        where: {
          ma_phim
        }
      })


      this.utilsService.responseSend(res, "Xử lý thành công!", "Xóa thành công", 200)
    } catch (err) {
      this.utilsService.responseSend(res, err.message, '', 500)
    }
  }
}
