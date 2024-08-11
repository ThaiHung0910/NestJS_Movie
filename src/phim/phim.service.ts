import { AuthService } from 'src/utils/jwt';
import { Injectable } from '@nestjs/common';
import { CreatePhimDto } from './dto/create-phim.dto';
import { PrismaClient } from '@prisma/client';
import { UtilsService } from 'src/utils';
import { validationMovie } from 'src/utils/validation';


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
      tenPhim = tenPhim.trim(), maNhom = maNhom.trim()
      if (tenPhim && maNhom) {
        listMovies = await this.prisma.phim.findMany({
          where: {
            ten_phim: { contains: tenPhim },
            ma_nhom: maNhom
          }
        })
      } else if (maNhom) {
        listMovies = await this.prisma.phim.findMany({
          where: {
            ma_nhom: maNhom
          }
        })
      } else if (tenPhim) {
        listMovies = await this.prisma.phim.findMany({
          where: {
            ten_phim: { contains: tenPhim }
          }
        })
      } else {
        listMovies = await this.prisma.phim.findMany()
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

  async getListMoviePage(maNhom: string, tenPhim: string, soTrang: number, soPhanTuTrenTrang: number, res: any) {

    try {
      let result = {
        maNhom,
        tenPhim,
        soTrang,
        soPhanTuTrenTrang
      }
      this.utilsService.responseSend(res, "Xử lý thành công", result, 200)
    } catch (err) {

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
        ma_nhom: maNhom,
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
