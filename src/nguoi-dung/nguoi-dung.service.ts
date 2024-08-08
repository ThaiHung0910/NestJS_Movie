import { Injectable, Res } from '@nestjs/common';
import { CreateNguoiDungDto } from './dto/create-nguoi-dung.dto';
import { UpdateNguoiDungDto } from './dto/update-nguoi-dung.dto';
import { AuthService } from 'src/utils/jwt';
import { UtilsService } from 'src/utils';
import { PrismaClient } from '@prisma/client';
import { LoginNguoiDungDto } from './dto/login-nguoi-dung.dto';
import { SignUpNguoiDungDto } from './dto/signUp-nguoi-dung.dto';
import { checkGroupCode, isNotEmpty, validationUser } from 'src/utils/validation';




@Injectable()
export class NguoiDungService {
  private prisma = new PrismaClient();
  constructor(
    private readonly authService: AuthService,
    private readonly utilsService: UtilsService,
  ) { }


  async checkDuplicateUser(taiKhoan: string, email: string, res: any) {
    const existingUser = await this.prisma.nguoi_dung.findFirst({
      where: {
        OR: [
          { email },
          { tai_khoan: taiKhoan }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return this.utilsService.responseSend(res, "Không tìm thấy tài nguyên!", "Email đã tồn tại", 404)
      }
      if (existingUser.tai_khoan === taiKhoan) {
        return this.utilsService.responseSend(res, "Không tìm thấy tài nguyên!", "Tài khoản đã tồn tại", 404);
      }
    }

  }

  async handleUpdateUser(body: UpdateNguoiDungDto, res: any) {
    const { taiKhoan, matKhau, email, soDt, hoTen, maNhom, maLoaiNguoiDung } = body;

    let dataMessageError = (message: string) => {
      return this.utilsService.responseSend(res, "Dữ liệu không hợp lệ!", message, 403);
    }

    let users = await this.prisma.nguoi_dung.findMany({
      where: {
        tai_khoan: {
          not: taiKhoan,
        },
      },
    });

    for (let user of users) {
      if (user.email === email) {
        dataMessageError("Email đã tồn tại")
      }
    }

    let checkData = validationUser(body);

    if (checkData) {
      dataMessageError(checkData)
    }

    if (!checkGroupCode(maNhom)) {

      dataMessageError("Mã nhóm không hợp lệ")
    }

    let loaiNguoiDung = this.handleTypeUser(res, maLoaiNguoiDung)

    let newUser = {
      tai_khoan: taiKhoan,
      email,
      mat_khau: matKhau,
      so_dt: soDt,
      ho_ten: hoTen,
      ma_nhom: maNhom.toUpperCase(),
      loai_nguoi_dung: loaiNguoiDung,
    };

    await this.prisma.nguoi_dung.update({
      where: {
        tai_khoan: taiKhoan,
      },
      data: newUser,
    });

    this.utilsService.responseSend(res, "Xử lý thành công!", body, 200);
  }

  async getListTypeUser(res: any) {
    try {
      let users = await this.prisma.nguoi_dung.findMany({
        distinct: ['loai_nguoi_dung'],
        select: {
          loai_nguoi_dung: true,
        },
      })


      const userTypeList = users.map((user) => ({
        maLoaiNguoiDung: user.loai_nguoi_dung,
        tenLoai: user.loai_nguoi_dung === 'KhachHang' ? 'Khách hàng' : 'Quản trị',
      }));


      this.utilsService.responseSend(res, "Xử lý thành công!", userTypeList, 200);
    } catch (err) {
      this.utilsService.responseSend(res, err.message, "", 500);
    }
  }

  handleTypeUser(res: any, value: string) {
    if (value.toLowerCase() != "khachhang" && value.toLowerCase() != "quantri") {
      return this.utilsService.responseSend(res, "Mã người dùng không hợp lệ", "", 403);
    }

    let loaiNguoiDung

    switch (value.toLowerCase()) {
      case "khachhang":
        loaiNguoiDung = "KhachHang"
        break;
      default:
        loaiNguoiDung = "QuanTri"
    }
    return loaiNguoiDung
  }





  async login(body: LoginNguoiDungDto, res: any): Promise<void> {

    try {

      let dataMessageError = (contentMessage: string) => {
        return this.utilsService.responseSend(res, "Không tìm thấy tài nguyên", contentMessage, 404)
      }

      const { taiKhoan, matKhau } = body;


      if (!isNotEmpty(taiKhoan) || !isNotEmpty(matKhau)) {
        dataMessageError("Dữ liệu không được để trống")
      }

      const isEmail = taiKhoan.includes('@');
      let user;

      if (isEmail) {
        user = await this.prisma.nguoi_dung.findUnique({
          where: { email: taiKhoan },
        });
        if (!user) {
          dataMessageError("Sai email")
        }
      } else {
        user = await this.prisma.nguoi_dung.findUnique({
          where: { tai_khoan: taiKhoan },
        });
        if (!user) {
          dataMessageError("Tài khoản không tồn tại")
        }
      }


      const { ma_nguoi_dung, tai_khoan, mat_khau, email, ho_ten, so_dt, loai_nguoi_dung, ma_nhom } = user;

      if (matKhau === mat_khau) {

        const key = this.utilsService.generateRandomString(6);
        const valueToken = { nguoiDungId: ma_nguoi_dung, key };
        const token = this.authService.createToken(valueToken);
        const tokenRef = this.authService.createTokenRef(valueToken);

        await this.prisma.nguoi_dung.update({
          where: { tai_khoan },
          data: { refresh_token: tokenRef },
        });

        let result = {
          taiKhoan: tai_khoan,
          hoTen: ho_ten,
          email,
          soDt: so_dt,
          maNhom: ma_nhom,
          maLoaiNguoiDung: loai_nguoi_dung,
          accessToken: token
        }

        this.utilsService.responseSend(res, "Xử lý thành công!", result, 200);
      } else {
        this.utilsService.responseSend(res, "Không tìm thấy tài nguyên", "Sai mật khẩu", 404);
      }
    } catch (err) {
      this.utilsService.responseSend(res, err.message, "", 500);
    }
  }


  async signUp(body: SignUpNguoiDungDto, res: any) {

    try {
      const { taiKhoan, matKhau, email, soDt, hoTen, maNhom } = body;

      await this.checkDuplicateUser(taiKhoan, email, res)

      let checkData = validationUser(body)

      if (checkData) {
        return this.utilsService.responseSend(res, checkData, "", 403);
      }
      let groupCode = checkGroupCode(maNhom) ? maNhom : 'GP00';


      let newUser = {
        tai_khoan: taiKhoan,
        email,
        mat_khau: matKhau,
        so_dt: soDt,
        ho_ten: hoTen,
        loai_nguoi_dung: "KhachHang",
        ma_nhom: groupCode
      }

      await this.prisma.nguoi_dung.create({ data: newUser })


      this.utilsService.responseSend(res, "Xử lý thành công!", { ...body, maNhom: groupCode }, 200);

    } catch (err) {
      this.utilsService.responseSend(res, err.message, "", 500);
    }
  }

  async getListUser(maNhom: string, res: any) {
    try {

      if (maNhom && !checkGroupCode(maNhom)) {
        return this.utilsService.responseSend(res, "Mã nhóm không hợp lệ", "", 400);
      }
      let users;

      if (maNhom) {
        users = await this.prisma.nguoi_dung.findMany({
          where: {
            ma_nhom: maNhom
          }
        });
      } else {

        users = await this.prisma.nguoi_dung.findMany()
      }



      const userList = users.map((user) => {
        let { tai_khoan, email, ho_ten, so_dt, mat_khau, loai_nguoi_dung } = user

        return ({
          taiKhoan: tai_khoan,
          email: email,
          hoTen: ho_ten,
          soDT: so_dt,
          matKhau: mat_khau,
          maLoaiNguoiDung: loai_nguoi_dung
        })
      });


      this.utilsService.responseSend(res, userList, "Xử lý thành công!", 200);
    } catch (err) {
      this.utilsService.responseSend(res, err.message, "", 500);
    }
  }

  async findUser(tuKhoa: string, maNhom: string, res: any) {
    try {
      if (maNhom && !checkGroupCode(maNhom)) {
        return this.utilsService.responseSend(res, "Không tìm thấy tài nguyên!", "Mã nhóm không hợp lệ", 400);
      }

      let result = [];
      if (tuKhoa && maNhom) {
        result = await this.prisma.nguoi_dung.findMany({
          where: {
            AND: [
              {
                OR: [
                  { ho_ten: { contains: tuKhoa } },
                  { tai_khoan: { contains: tuKhoa } },
                  { so_dt: { contains: tuKhoa } },
                ]
              },
              maNhom ? { ma_nhom: maNhom } : {}
            ]
          }
        });
      } else if (tuKhoa) {
        result = await this.prisma.nguoi_dung.findMany({
          where: {
            OR: [
              { ho_ten: { contains: tuKhoa } },
              { tai_khoan: { contains: tuKhoa } },
              { so_dt: { contains: tuKhoa } },
            ]
          }
        });
      } else if (maNhom) {
        result = await this.prisma.nguoi_dung.findMany({
          where: {
            ma_nhom: maNhom
          }
        });
      } else {
        result = await this.prisma.nguoi_dung.findMany();
      }

      const userList = result.map((user) => {
        let { tai_khoan, email, ho_ten, so_dt, mat_khau, loai_nguoi_dung } = user

        return ({
          taiKhoan: tai_khoan,
          email: email,
          hoTen: ho_ten,
          soDT: so_dt,
          matKhau: mat_khau,
          maLoaiNguoiDung: loai_nguoi_dung
        });
      });

      this.utilsService.responseSend(res, "Xử lý thành công!", userList, 200);
    } catch (err) {
      this.utilsService.responseSend(res, err.message, "", 500);
    }
  }

  async getInfoOwner(req: any, res: any) {
    try {
      const nguoiDungId = this.utilsService.getUserIdFromAuthorization(this.authService, req)

      const user = await this.prisma.nguoi_dung.findUnique({
        where: { ma_nguoi_dung: nguoiDungId },
        include: {
          dat_ve: {
            include: {
              lich_chieu: {
                include: {
                  phim: true,
                  rap_phim: {
                    include: {
                      cum_rap: {
                        include: {
                          he_thong_rap: true,
                        },
                      },
                    },
                  },
                },
              },
              ghe: {
                include: {
                  rap_phim: {
                    include: {
                      cum_rap: {
                        include: {
                          he_thong_rap: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (user) {
        const { tai_khoan, mat_khau, ho_ten, so_dt, email, ma_nhom, loai_nguoi_dung } = user

        const thongTinDatVe = user.dat_ve.map(ve => {
          let danhSachGhe = []
          let { ma_he_thong_rap, ten_he_thong_rap } = ve.lich_chieu.rap_phim.cum_rap.he_thong_rap
          let { ma_cum_rap, ten_cum_rap } = ve.lich_chieu.rap_phim.cum_rap
          let { ma_rap, gia_ve } = ve.lich_chieu
          let { ten_rap } = ve.lich_chieu.rap_phim
          let { ma_ghe, ten_ghe } = ve.ghe
          let { ma_ve, createdAt } = ve
          let { ten_phim, hinh_anh } = ve.lich_chieu.phim


          danhSachGhe.push({
            maHeThongRap: ma_he_thong_rap,
            tenHeThongRap: ten_he_thong_rap,
            maCumRap: ma_cum_rap,
            tenCumRap: ten_cum_rap,
            maRap: ma_rap,
            tenRap: ten_rap,
            maGhe: ma_ghe,
            tenGhe: ten_ghe
          })

          return {
            danhSachGhe,
            maVe: ma_ve,
            ngayDat: createdAt,
            tenPhim: ten_phim,
            hinhAnh: hinh_anh,
            giaVe: gia_ve,
            thoiLuongPhim: 170
          }
        })



        const result = {
          taiKhoan: tai_khoan,
          matKhau: mat_khau,
          hoTen: ho_ten,
          soDt: so_dt,
          email,
          maNhom: ma_nhom,
          maLoaiNguoiDung: loai_nguoi_dung,
          loaiNguoiDung: {
            maLoaiNguoiDung: loai_nguoi_dung,
            tenLoai: loai_nguoi_dung == "QuanTri" ? "Quản trị" : "Khách hàng"
          },
          thongTinDatVe
        }


        this.utilsService.responseSend(res, "Xử lý thành công!", result, 200);



      } else {
        this.utilsService.responseSend(res, "Không tìm thấy người dùng", "", 404);
      }
    } catch (err) {
      this.utilsService.responseSend(res, err.message, "", 500);
    }
  }


  async getInfoUser(taiKhoan: string, req: any, res: any) {
    try {
      const nguoiDungId = this.utilsService.getUserIdFromAuthorization(this.authService, req)

      let checkUserAllow = await this.prisma.nguoi_dung.findUnique({
        where: { ma_nguoi_dung: nguoiDungId }
      })
      if (checkUserAllow.loai_nguoi_dung == "KhachHang") {
        return this.utilsService.responseSend(res, "Unauthorized", "", 403)
      }

      const user = await this.prisma.nguoi_dung.findFirst({
        where: {
          tai_khoan: taiKhoan
        },
        include: {
          dat_ve: {
            include: {
              lich_chieu: {
                include: {
                  phim: true,
                  rap_phim: {
                    include: {
                      cum_rap: {
                        include: {
                          he_thong_rap: true,
                        },
                      },
                    },
                  },
                },
              },
              ghe: {
                include: {
                  rap_phim: {
                    include: {
                      cum_rap: {
                        include: {
                          he_thong_rap: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });


      if (!user) {
        return this.utilsService.responseSend(res, "Không tìm thấy tài nguyên!", "Tài khoản không hợp lệ!", 404);
      }

      const { tai_khoan, mat_khau, ho_ten, so_dt, email, ma_nhom, loai_nguoi_dung } = user

      const thongTinDatVe = user.dat_ve.map(ve => {
        let danhSachGhe = []
        let { ma_he_thong_rap, ten_he_thong_rap } = ve.lich_chieu.rap_phim.cum_rap.he_thong_rap
        let { ma_cum_rap, ten_cum_rap } = ve.lich_chieu.rap_phim.cum_rap
        let { ma_rap, gia_ve } = ve.lich_chieu
        let { ten_rap } = ve.lich_chieu.rap_phim
        let { ma_ghe, ten_ghe } = ve.ghe
        let { ma_ve, createdAt } = ve
        let { ten_phim, hinh_anh } = ve.lich_chieu.phim


        danhSachGhe.push({
          maHeThongRap: ma_he_thong_rap,
          tenHeThongRap: ten_he_thong_rap,
          maCumRap: ma_cum_rap,
          tenCumRap: ten_cum_rap,
          maRap: ma_rap,
          tenRap: ten_rap,
          maGhe: ma_ghe,
          tenGhe: ten_ghe
        })

        return {
          danhSachGhe,
          maVe: ma_ve,
          ngayDat: createdAt,
          tenPhim: ten_phim,
          hinhAnh: hinh_anh,
          giaVe: gia_ve,
          thoiLuongPhim: 170
        }
      })



      const result = {
        taiKhoan: tai_khoan,
        matKhau: mat_khau,
        hoTen: ho_ten,
        soDt: so_dt,
        email,
        maNhom: ma_nhom,
        maLoaiNguoiDung: loai_nguoi_dung,
        loaiNguoiDung: {
          maLoaiNguoiDung: loai_nguoi_dung,
          tenLoai: loai_nguoi_dung == "QuanTri" ? "Quản trị" : "Khách hàng"
        },
        thongTinDatVe
      }


      this.utilsService.responseSend(res, "Xử lý thành công!", result, 200);
    } catch (err) {
      this.utilsService.responseSend(res, err.message, "", 500);
    }
  }



  async addUser(body: CreateNguoiDungDto, req: any, res: any) {
    try {
      const { taiKhoan, matKhau, email, soDt, hoTen, maNhom, maLoaiNguoiDung } = body;

      const nguoiDungId = this.utilsService.getUserIdFromAuthorization(this.authService, req)

      let user = await this.prisma.nguoi_dung.findUnique({
        where: { ma_nguoi_dung: nguoiDungId },
      })

      if (user.loai_nguoi_dung == "KhachHang") {
        return this.utilsService.responseSend(res, "Unauthorized", "", 403);
      }


      await this.checkDuplicateUser(taiKhoan, email, res)

      let checkData = validationUser(body)

      if (checkData) {
        return this.utilsService.responseSend(res, "Dữ liệu không hợp lệ!", checkData, 403);
      }
      if (!checkGroupCode(maNhom)) {
        return this.utilsService.responseSend(res, "Dữ liệu không hợp lệ!", "Mã nhóm không hợp lệ", 403);
      }

      let loaiNguoiDung = this.handleTypeUser(res, maLoaiNguoiDung)



      let newUser = {
        tai_khoan: taiKhoan,
        email,
        mat_khau: matKhau,
        so_dt: soDt,
        ho_ten: hoTen,
        ma_nhom: maNhom.toUpperCase(),
        loai_nguoi_dung: loaiNguoiDung
      }

      await this.prisma.nguoi_dung.create({ data: newUser })


      this.utilsService.responseSend(res, "Xử lý thành công!", body, 200);

    } catch (err) {
      this.utilsService.responseSend(res, err.message, "", 500);
    }


  }


  async updateOwner(body: UpdateNguoiDungDto, req: any, res: any) {
    try {

      const nguoiDungId = this.utilsService.getUserIdFromAuthorization(this.authService, req)

      let user = await this.prisma.nguoi_dung.findUnique({
        where: { ma_nguoi_dung: nguoiDungId },
      })

      if (user.tai_khoan != body.taiKhoan) {
        return this.utilsService.responseSend(res, "Dữ liệu không hợp lệ!", "Bạn không có quyền thay đổi tài khoản người khác !", 403);
      }

      await this.handleUpdateUser(body, res);

    } catch (err) {
      this.utilsService.responseSend(res, err.message, "", 500);
    }
  }

  async updateUser(body: UpdateNguoiDungDto, req: any, res: any) {
    try {
      const nguoiDungId = this.utilsService.getUserIdFromAuthorization(this.authService, req)

      let user = await this.prisma.nguoi_dung.findUnique({
        where: { ma_nguoi_dung: nguoiDungId },
      })

      if (user.loai_nguoi_dung == "KhachHang") {
        return this.utilsService.responseSend(res, "Unauthorized", "Bạn không đủ quyền chỉnh sửa", 403);
      }


      let users = await this.prisma.nguoi_dung.findMany()

      let checkUser = false

      users.forEach(user => {
        if (user.tai_khoan == body.taiKhoan) {
          checkUser = true
        }
      })

      if (!checkUser) {
        return this.utilsService.responseSend(res, "Dữ liệu không hợp lệ!", "Tài khoản không tồn tại", 403);
      }


      await this.handleUpdateUser(body, res);

    } catch (err) {
      this.utilsService.responseSend(res, err.message, "", 500);
    }
  }

  async remove(taiKhoan: string, req: any, res: any) {
    try {
      const nguoiDungId = this.utilsService.getUserIdFromAuthorization(this.authService, req)

      let user = await this.prisma.nguoi_dung.findUnique({
        where: { ma_nguoi_dung: nguoiDungId },
      })

      if (user.loai_nguoi_dung == "KhachHang") {
        return this.utilsService.responseSend(res, "Unauthorized", "Bạn không đủ quyền xóa", 403);
      }

      let users = await this.prisma.nguoi_dung.findMany()
      let nguoiDungDeleteId


      let checkUser = false

      users.forEach(user => {
        if (user.tai_khoan == taiKhoan) {
          checkUser = true
          nguoiDungDeleteId = user.ma_nguoi_dung
        }
      })

      if (!checkUser) {
        return this.utilsService.responseSend(res, "Dữ liệu không hợp lệ!", "Tài khoản không tồn tại", 500);
      }

      let userBooking = await this.prisma.dat_ve.findFirst({
        where: {
          ma_nguoi_dung: nguoiDungDeleteId
        }
      })

      if (userBooking) {
        return this.utilsService.responseSend(res, "Dữ liệu không hợp lệ!", "Người dùng này đã đặt vé xem phim không thể xóa!", 500);
      }

      await this.prisma.nguoi_dung.delete({
        where: {
          tai_khoan: taiKhoan
        }
      })

      this.utilsService.responseSend(res, "Xử lý thành công!", "Xóa thành công!", 200);

    } catch (err) {
      this.utilsService.responseSend(res, err.message, "", 500);
    }

  }
}
