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



  async getBanner(res: any) {
    try {
      let banners = await this.prisma.banner.findMany()

      let result = banners.map(banner => {
        let { ma_banner, ma_phim, hinh_anh } = banner
        return {
          maBanner: ma_banner,
          maPhim: ma_phim,
          hinhAnh: hinh_anh
        }
      })

      this.utilsService.responseSend(res, "Xử lý thành công!", result, 200)
    } catch (err) {
      this.utilsService.responseSend(res, err.message, "", 500);
    }
  }


  async getListMovie(tenPhim: string, maNhom: string, res: any) {
    try {
      let listMovies
      tenPhim = tenPhim ? tenPhim.trim() : tenPhim, maNhom = maNhom ? maNhom.trim() : maNhom
      if (maNhom) {
        listMovies = await this.prisma.phim.findMany({
          where: {
            AND: [
              tenPhim ? { ten_phim: { contains: tenPhim } } : {},
              { ma_nhom: maNhom }
            ]
          }
        })
      } else if (tenPhim) {
        listMovies = await this.prisma.phim.findMany({
          where: {
            ma_nhom: "GP01",
            ten_phim: { contains: tenPhim }
          }
        })
      } else {
        listMovies = await this.prisma.phim.findMany(
          {
            where: {
              ma_nhom: "GP01"
            }
          }
        )
      }

      if (listMovies.length) {
        listMovies = listMovies.map((movie: any) => {
          let { ma_phim, ten_phim, trailer, hinh_anh, mo_ta, ma_nhom, ngay_khoi_chieu, danh_gia, hot, dang_chieu, sap_chieu } = movie
          return {
            maPhim: ma_phim,
            tenPhim: ten_phim,
            trailer: trailer,
            hinhAnh: hinh_anh,
            moTa: mo_ta,
            maNhom: ma_nhom,
            ngayKhoiChieu: ngay_khoi_chieu,
            danhGia: danh_gia,
            hot,
            dangChieu: dang_chieu,
            sapChieu: sap_chieu
          }
        })
      }

      this.utilsService.responseSend(res, "Xử lý thành công!", listMovies, 200)
    } catch (err) {
      this.utilsService.responseSend(res, err.message, "", 500);
    }
  }

  async getPaginationMovieList(maNhom: string, tenPhim: string, soTrang: number, soPhanTuTrenTrang: number, res: any) {
    try {
      let numberItemPerPage = Number(soPhanTuTrenTrang), page = Number(soTrang)
      let dataMessageError = (message: string) => {
        return this.utilsService.responseSend(res, "Dữ liệu không hợp lệ!", message, 400);
      }


      if (soPhanTuTrenTrang && !Number.isInteger(numberItemPerPage)) {
        dataMessageError("Số phần tử trên trang không hợp lệ")
      }
      if (soTrang && !Number.isInteger(page)) {
        dataMessageError("Số trang không hợp lệ")
      }

      let movies: any, result = {
        currentPage: 0,
        count: 0,
        totalPages: 0,
        totalCount: 0,
        items: []
      }


      if (maNhom) {
        if (!checkGroupCode(maNhom)) {
          dataMessageError("Mã nhóm không hợp lệ")
        }
        movies = await this.prisma.phim.findMany({
          where: {
            AND: [
              { ma_nhom: maNhom },
              tenPhim ? { ten_phim: { contains: tenPhim } } : {}
            ]
          }
        });
      } else {
        if (tenPhim) {
          movies = await this.prisma.phim.findMany({
            where: {
              AND: [
                { ma_nhom: "GP01" },
                { ten_phim: { contains: tenPhim } },
              ]
            }
          })
        } else {
          movies = await this.prisma.phim.findMany({
            where: {
              ma_nhom: "GP01"
            }
          })
        }
      }

      let moviesLength = movies.length

      result.currentPage = page ? page : 1
      if (moviesLength) {
        result.totalCount = moviesLength
        result.totalPages = numberItemPerPage ? Math.ceil(moviesLength / numberItemPerPage) : 1

        let countItem = 0
        movies.forEach((movie: any, index: any) => {
          let { ma_phim, ten_phim, trailer, hinh_anh, mo_ta, ma_nhom, ngay_khoi_chieu, danh_gia, hot, dang_chieu, sap_chieu } = movie
          let calculate = () => {
            result.items.push(({
              maPhim: ma_phim,
              tenPhim: ten_phim,
              trailer: trailer,
              hinhAnh: hinh_anh,
              moTa: mo_ta,
              maNhom: ma_nhom,
              ngayKhoiChieu: ngay_khoi_chieu,
              danhGia: danh_gia,
              hot,
              dangChieu: dang_chieu,
              sapChieu: sap_chieu
            }))
            countItem++
          }
          if (numberItemPerPage) {
            if (page == 1) {
              if (countItem < numberItemPerPage) {
                calculate()
              }
            } else {
              if (index >= (page - 1) * numberItemPerPage && countItem < numberItemPerPage) {
                calculate()
              }
            }
          } else {
            if (result.currentPage < 2) {
              calculate()
            }
          }
        });
        result.count = countItem
      }


      this.utilsService.responseSend(res, "Xử lý thành công!", result, 200);
    } catch (err) {
      this.utilsService.responseSend(res, err.message, "", 500);
    }

  }

  async getMovieListByDate(maNhom: string, tenPhim: string, soTrang: number, soPhanTuTrenTrang: number, tuNgay: string, denNgay: string, res: any) {
    try {
      let numberItemPerPage = Number(soPhanTuTrenTrang);
      let page = Number(soTrang);

      const dataMessageError = (message: string) => {
        return this.utilsService.responseSend(res, "Dữ liệu không hợp lệ!", message, 400);
      }

      if (numberItemPerPage && !Number.isInteger(numberItemPerPage)) {
        return dataMessageError("Số phần tử trên trang không hợp lệ");
      }
      if (page && !Number.isInteger(page)) {
        return dataMessageError("Số trang không hợp lệ");
      }

      let formatDate = (date: string): Date | undefined => {
        if (date) {
          const [day, month, year] = date.split(/[\/\-]/).map(Number)
          return new Date(year, month, day);
        }
        return undefined
      }

      const formattedTuNgay = formatDate(tuNgay);
      const formattedDenNgay = formatDate(denNgay);


      let movies: any;

      if (!formattedTuNgay && !formattedDenNgay || !formattedTuNgay) {
        movies = []
      } else {
        movies = await this.prisma.phim.findMany({
          where: {
            ma_nhom: maNhom || "GP01",
            AND: [
              tenPhim ? { ten_phim: { contains: tenPhim } } : {},
              {
                ngay_khoi_chieu: {
                  gte: formattedTuNgay ? formattedTuNgay : undefined,
                  lte: formattedDenNgay ? formattedDenNgay : undefined,
                }
              }
            ]
          }
        });

      }


      let result = [];
      if (movies.length) {
        let countItem = 0;
        movies.forEach((movie: any, index: number) => {
          let { ma_phim, ten_phim, trailer, hinh_anh, mo_ta, ma_nhom, ngay_khoi_chieu, danh_gia, hot, dang_chieu, sap_chieu } = movie
          let calculate = () => {
            result.push({
              maPhim: ma_phim,
              tenPhim: ten_phim,
              trailer: trailer,
              hinhAnh: hinh_anh,
              moTa: mo_ta,
              maNhom: ma_nhom,
              ngayKhoiChieu: ngay_khoi_chieu,
              danhGia: danh_gia,
              hot,
              dangChieu: dang_chieu,
              sapChieu: sap_chieu
            });
            countItem++;
          }
          if (numberItemPerPage) {
            if (page == 1) {
              if (countItem < numberItemPerPage) {
                calculate()
              }
            } else {
              if (index >= (page - 1) * numberItemPerPage && countItem < numberItemPerPage) {
                calculate()
              }
            }
          }
        });
      }




      this.utilsService.responseSend(res, "Xử lý thành công!", result, 200);
    } catch (err) {
      this.utilsService.responseSend(res, err.message, "", 500);
    }
  }


  async getInfoMovie(maPhim: string, res: any) {
    try {
      let dataMessageError = () => this.utilsService.responseSend(res, "Không tìm thấy tài nguyên!", "Mã phim không hợp lệ", 400);
      if (!maPhim) {
        dataMessageError()
      }


      let movie = await this.prisma.phim.findUnique({
        where: {
          ma_phim: Number(maPhim)
        }
      })

      if (!movie) {
        dataMessageError()

      }

      let { ten_phim, trailer, hinh_anh, mo_ta, ngay_khoi_chieu, danh_gia, hot, dang_chieu, sap_chieu } = movie

      let result = {
        maPhim,
        tenPhim: ten_phim,
        trailer,
        hinhAnh: hinh_anh,
        moTa: mo_ta,
        hot,
        dangChieu: dang_chieu,
        sapChieu: sap_chieu,
        ngayKhoiChieu: ngay_khoi_chieu,
        danhGia: danh_gia
      }

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
        return this.utilsService.responseSend(res, "Dữ liệu không hợp lệ!", validationMessage, 403);
      }

      let movie = await this.prisma.phim.findFirst({
        where: {
          ten_phim: tenPhim
        }
      })

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
      if (!movie) {
        return this.utilsService.responseSend(res, "Dữ liệu không hợp lệ!", "Không tìm thấy phim!", 403);
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
        return this.utilsService.responseSend(res, "Dữ liệu không hợp lệ!", validationMessage, 403);
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
        return this.utilsService.responseSend(res, "Dữ liệu không hợp lệ", 'Mã phim không hợp lệ', 403)
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
