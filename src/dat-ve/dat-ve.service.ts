import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AuthService } from 'src/utils/jwt';
import { UtilsService } from 'src/utils';

@Injectable()
export class DatVeService {
    private prisma = new PrismaClient()

    constructor(private readonly utilsService: UtilsService, private readonly authService: AuthService) { }


    checkValueNumber(value: any, res: any, message: string, content: string) {
        if (isNaN(Number(value))) {
            return this.utilsService.responseSend(res, message, content, 500)
        }
        return Number(value)
    }


    isValidDateTime(input: string): boolean {

        const regex = /^([0-2][0-9]|(3)[0-1])\/(0[1-2]|[3-9]|1[0-2])\/(\d{4}) ([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
        return regex.test(input);
    }

    convertDateTime(input: string): Date {
        const [datePart, timePart] = input.split(' ');
        const [day, month, year] = datePart.split('/').map(Number);
        const [hours, minutes, seconds] = timePart.split(':').map(Number);
        return new Date(year, month - 1, day, hours, minutes, seconds);
    }

    handleError(res: any, message: string, content: string, statusCode = 500) {
        return this.utilsService.responseSend(res, message, content, statusCode);
    }


    async checkUserPermission(nguoiDungId: number, res: any) {
        const user = await this.prisma.nguoi_dung.findUnique({
            where: { ma_nguoi_dung: nguoiDungId },
        });

        if (!user || user.loai_nguoi_dung === 'KhachHang') {
            return this.handleError(res, 'Unauthorized', 'Bạn không đủ quyền tạo', 403);
        }
        return user;
    }

    async bookTicket(body: any, req: any, res: any) {
        try {

            let nguoiDungId = this.utilsService.getUserIdFromAuthorization(this.authService, req)

            await this.checkUserPermission(nguoiDungId, res);

            let { maLichChieu, danhSachVe } = body


            maLichChieu = this.checkValueNumber(maLichChieu, res, "Không tìm thấy tài nguyên!", 'Mã lịch chiếu không hợp lệ!')


            let lichChieuPhim = await this.prisma.lich_chieu.findUnique({
                where: { ma_lich_chieu: maLichChieu }
            })

            if (!lichChieuPhim) {
                return this.handleError(res, 'Không tìm thấy tài nguyên!', 'Mã lịch chiếu không tồn tại!', 400);
            }



            const maGheArray = danhSachVe.map(item => this.checkValueNumber(item.maGhe, res, 'Giá trị không hợp lệ!', 'Mã ghế phải là một số!'));
            if (maGheArray.length) {
                const ghe = await this.prisma.ghe.findMany({
                    where: {
                        ma_ghe: { in: maGheArray },
                    },
                });

                if (ghe.length < maGheArray.length) {
                    return this.handleError(res, 'Không tìm thấy tài nguyên!', 'Mã ghế không tồn tại!', 404);
                }
            }


            let userBookTicketInfo = danhSachVe.map(info => ({
                ma_nguoi_dung: nguoiDungId,
                ma_lich_chieu: Number(maLichChieu),
                ma_ghe: Number(info.maGhe)
            }))

            await this.prisma.dat_ve.createMany({
                data: userBookTicketInfo
            })


            this.utilsService.responseSend(res, "Xử lý thành công!", 'Đặt vé thành công!', 200)
        } catch (err) {
            this.utilsService.responseSend(res, '', err.message, 500)
        }
    }


    async getListTicketRoom(maLichChieu: string, res: any) {
        try {
            if (!maLichChieu || isNaN(Number(maLichChieu))) {
                return this.handleError(res, 'Dữ liệu không hợp lệ!', 'Mã lịch chiếu không hợp lệ!', 400);
            }


            let lichChieuPhim = await this.prisma.lich_chieu.findUnique({
                where: { ma_lich_chieu: Number(maLichChieu) },
                include: {
                    phim: true,
                    rap_phim: {
                        include: {
                            ghe: true,
                            cum_rap: true
                        }
                    }
                }
            })

            if (!lichChieuPhim) {
                return this.handleError(res, 'Không tìm thấy tài nguyên!', 'Mã lịch chiếu không tồn tại!', 400);
            }

            let { ngay_gio_chieu, gia_ve, ma_rap } = lichChieuPhim
            let { ten_rap } = lichChieuPhim.rap_phim
            let { ten_phim, hinh_anh } = lichChieuPhim.phim
            let { ten_cum_rap, dia_chi } = lichChieuPhim.rap_phim.cum_rap

            const formattedDateTime = this.utilsService.formatDateTime(ngay_gio_chieu);
            let { ngayChieu, gioChieu } = formattedDateTime

            let thongTinPhim = {
                maLichChieu,
                tenCumRap: ten_cum_rap,
                tenRap: ten_rap,
                diaChi: dia_chi,
                tenPhim: ten_phim,
                hinhAnh: hinh_anh,
                ngayChieu: ngayChieu,
                gioChieu: gioChieu
            }

            let danhSachGhe = lichChieuPhim.rap_phim.ghe.map((chair, index) => {
                let { ma_ghe, ten_ghe, loai_ghe } = chair


                return {
                    maGhe: ma_ghe,
                    tenGhe: ten_ghe,
                    maRap: ma_rap,
                    loaiGhe: loai_ghe,
                    stt: index + 1,
                    giaVe: gia_ve,
                    daDat: false,
                    taiKhoanNguoiDat: null
                }
            })


            let danhSachPhongVe = {
                thongTinPhim,
                danhSachGhe
            }


            this.utilsService.responseSend(res, "Xử lý thành công!", danhSachPhongVe, 200)

        } catch (err) {
            this.utilsService.responseSend(res, '', err.message, 500)
        }
    }

    async createSchedule(body: any, req: any, res: any) {
        try {
            let { maPhim, ngayChieuGioChieu, maRap, giaVe } = body
            const nguoiDungId = this.utilsService.getUserIdFromAuthorization(this.authService, req);

            await this.checkUserPermission(nguoiDungId, res);


            maPhim = this.checkValueNumber(maPhim, res, "Dữ liệu không hợp lệ!", "MaPhim không hợp lệ")
            maRap = this.checkValueNumber(maRap, res, "Không tìm thấy tài nguyên!", "Chọn sai cụm rạp!",)
            giaVe = this.checkValueNumber(giaVe, res, "Không tìm thấy tài nguyên!", "Giá từ 75.000 - 200.000")

            let movie = await this.prisma.phim.findUnique({
                where: { ma_phim: maPhim }
            })

            if (!movie) {
                return this.handleError(res, 'Dữ liệu không hợp lệ!', 'MaPhim không hợp lệ');
            }

            if (!this.isValidDateTime(ngayChieuGioChieu)) {
                return this.handleError(res, 'Dữ liệu không hợp lệ!', 'Ngày chiếu không hợp lệ, phải có định dạng: dd/mm/yyyy hh:mm:ss');
            }

            let cumRap = await this.prisma.cum_rap.findUnique({
                where: { ma_cum_rap: maRap },
                include: {
                    rap_phim: true
                }
            })

            if (!cumRap) {
                return this.handleError(res, "Không tìm thấy tài nguyên!", "Chọn sai cụm rạp!")
            }

            if (giaVe < 75000 || giaVe > 200000) {
                return this.handleError(res, "Không tìm thấy tài nguyên!", "Giá từ 75.000 - 200.000")
            }

            let maRapFromCumRap = cumRap.rap_phim[0].ma_rap

            let timeSchedule = this.convertDateTime(ngayChieuGioChieu)


            let newSchedule = {
                ma_rap: maRapFromCumRap,
                ma_phim: maPhim,
                ngay_gio_chieu: timeSchedule,
                gia_ve: giaVe
            }

            const existingSchedule = await this.prisma.lich_chieu.findFirst({
                where: newSchedule,
            });

            if (existingSchedule) {
                return this.handleError(res, "Không tìm thấy tài nguyên!", "Lịch chiếu đã bị trùng",)
            }


            await this.prisma.lich_chieu.create({
                data: newSchedule
            })

            this.utilsService.responseSend(res, "Xử lý thành công!", "Thêm lịch chiếu thành công!", 200)
        } catch (err) {
            this.utilsService.responseSend(res, '', err.message, 500)
        }
    }
}
