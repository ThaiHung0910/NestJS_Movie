import { Injectable } from '@nestjs/common';
import { UtilsService } from 'src/utils';
import { PrismaClient } from '@prisma/client';
import { isValidNumber } from 'src/utils/validation';

@Injectable()
export class RapService {
    private prisma = new PrismaClient()

    constructor(private readonly utilsService: UtilsService) { }


    formatTheaterSystem(theater: any) {
        let { ma_he_thong_rap, ten_he_thong_rap, logo } = theater;
        return {
            maHeThongRap: ma_he_thong_rap,
            tenHeThongRap: ten_he_thong_rap,
            logo,
        };
    }

    handleTheater(value: any) {
        return value.map((cumRap: any) => {
            let { ma_cum_rap, ten_cum_rap, dia_chi, rap_phim } = cumRap

            let danhSachPhim = rap_phim.map((rapPhim: any) => {
                let { ten_rap } = rapPhim


                let thongTinPhim

                let lstLichChieuTheoPhim = rapPhim.lich_chieu.map(thongTin => {

                    let { ma_lich_chieu, ma_rap, ngay_gio_chieu, gia_ve } = thongTin

                    let { ma_phim, ten_phim, hinh_anh, hot, dang_chieu, sap_chieu } = thongTin.phim

                    thongTinPhim = {

                        maPhim: ma_phim,
                        tenPhim: ten_phim,
                        hinhAnh: hinh_anh,
                        hot,
                        dangChieu: dang_chieu,
                        sapChieu: sap_chieu
                    }

                    return {

                        maLichChieu: ma_lich_chieu,
                        maRap: ma_rap,
                        tenRap: ten_rap,
                        ngayChieuGioChieu: ngay_gio_chieu,
                        giaVe: gia_ve
                    }
                })

                return {
                    lstLichChieuTheoPhim,
                    ...thongTinPhim
                }
            })
            return {
                danhSachPhim,
                maCumRap: ma_cum_rap,
                tenCumRap: ten_cum_rap,
                diaChi: dia_chi
            }
        })
    }

    formatInfoShowTime(maHeThongRap: any, value: any) {
        if (maHeThongRap) {
            let listCumRap = this.handleTheater(value.cum_rap)
            return {
                listCumRap,
                ...this.formatTheaterSystem(value)
            }
        } else {
            return value.map(info => {
                let listCumRap = this.handleTheater(info.cum_rap)

                return {

                    listCumRap,
                    ...this.formatTheaterSystem(info)
                }
            })
        }
    }



    async getTheaterSystem(maHeThongRap: string, res: any) {

        try {
            let dataMessageError = () => this.utilsService.responseSend(res, "Xử lý thành công!", [], 200);

            let listTheaters, result
            if (maHeThongRap) {
                if (!isValidNumber(maHeThongRap)) {
                    return dataMessageError()
                }

                let theater = await this.prisma.he_thong_rap.findUnique({
                    where: {
                        ma_he_thong_rap: Number(maHeThongRap)
                    }
                })
                if (!theater) {
                    return dataMessageError()
                }

                result = this.formatTheaterSystem(theater);

            } else {
                listTheaters = await this.prisma.he_thong_rap.findMany()
                result = listTheaters.map(this.formatTheaterSystem);
            }


            this.utilsService.responseSend(res, 'Xử lý thành công!', result, 200)
        } catch (err) {
            this.utilsService.responseSend(res, err.message, '', 500)
        }

    }

    async getTheaterComplex(maHeThongRap: string, res: any) {
        try {

            if (maHeThongRap) {
                let dataMessageError = () => this.utilsService.responseSend(res, "Không tìm thấy tài nguyên!", 'Mã hệ thống rạp không tồn tại!', 400);

                if (!isValidNumber(maHeThongRap)) {
                    return dataMessageError()
                }

                let listTheaters = await this.prisma.cum_rap.findMany({
                    where: {
                        ma_he_thong_rap: Number(maHeThongRap)
                    },
                    include: {
                        rap_phim: true
                    }
                })

                if (!listTheaters.length) {
                    return dataMessageError()
                }


                let result = listTheaters.map(theater => {
                    let { ma_cum_rap, ten_cum_rap, dia_chi, rap_phim } = theater

                    let danhSachRap = rap_phim.map(rap => {
                        let { ma_rap, ten_rap } = rap
                        return {
                            maRap: ma_rap,
                            tenRap: ten_rap
                        }
                    })

                    return {
                        "maCumRap": ma_cum_rap,
                        tenCumRap: ten_cum_rap,
                        diaChi: dia_chi,
                        danhSachRap
                    }
                })

                this.utilsService.responseSend(res, 'Xử lý thành công!', result, 200)
            } else {
                return this.utilsService.responseSend(res, "Không tìm thấy tài nguyên!", 'Mã hệ thổng rạp không dược để trống!', 404);
            }
        } catch (err) {
            this.utilsService.responseSend(res, err.message, '', 500)
        }


    }

    async getInfoShowtimesSystem(maHeThongRap: string, res: any) {
        try {
            let listCumRap, result = [], object = {
                include: {
                    cum_rap: {
                        include: {
                            rap_phim: {
                                include: {
                                    lich_chieu: {
                                        include: {
                                            phim: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (maHeThongRap) {
                if (!isValidNumber(maHeThongRap)) {
                    this.utilsService.responseSend(res, "Xử lý thành công", [], 200);
                    return;
                }


                listCumRap = await this.prisma.he_thong_rap.findUnique({
                    where: {
                        ma_he_thong_rap: Number(maHeThongRap)
                    },
                    include: object.include
                })

                if (!listCumRap) {
                    return this.utilsService.responseSend(res, "Dữ liệu không hợp lệ!", "Mã hệ thống rạp không hợp lệ!", 400)
                }
                result.push(this.formatInfoShowTime(maHeThongRap, listCumRap))

            } else {
                listCumRap = await this.prisma.he_thong_rap.findMany({
                    include: object.include
                })

                result.push(this.formatInfoShowTime(maHeThongRap, listCumRap))
            }



            this.utilsService.responseSend(res, "Xử lý thành công", result, 200)
        } catch (err) {
            this.utilsService.responseSend(res, err.message, '', 500)
        }
    }

    async getInfoMovie(maPhim: string, res: any) {
        try {
            let dataMessageError = () => this.utilsService.responseSend(res, "Không tìm thấy tài nguyên!", 'Mã phim không tồn tại!', 400)
            if (!maPhim || !isValidNumber(maPhim)) {
                dataMessageError()
            }

            let movie = await this.prisma.phim.findUnique({
                where: {
                    ma_phim: Number(maPhim)
                },
                include: {
                    lich_chieu: {
                        include: {
                            rap_phim: {
                                include: {
                                    cum_rap: {
                                        include: {
                                            he_thong_rap: true
                                        }
                                    }
                                }
                            },

                        }
                    }
                }
            })




            if (!movie) {
                dataMessageError()
            }

            let { ma_phim, ten_phim, trailer, hinh_anh, mo_ta, ma_nhom, hot, dang_chieu, sap_chieu, ngay_khoi_chieu, danh_gia } = movie


            const heThongRapObj = {};

            movie.lich_chieu.forEach(lichChieu => {
                let { ma_he_thong_rap, ten_he_thong_rap, logo } = lichChieu.rap_phim.cum_rap.he_thong_rap
                let { ma_cum_rap, ten_cum_rap, dia_chi } = lichChieu.rap_phim.cum_rap
                let { ma_rap, ten_rap } = lichChieu.rap_phim
                let { ma_lich_chieu, gia_ve, ngay_gio_chieu } = lichChieu

                if (!heThongRapObj[ma_he_thong_rap]) {
                    heThongRapObj[ma_he_thong_rap] = {
                        cumRapChieu: [],
                        maHeThongRap: ma_he_thong_rap,
                        tenHeThongRap: ten_he_thong_rap,
                        logo: logo
                    };
                }

                const cumRapIndex = heThongRapObj[ma_he_thong_rap].cumRapChieu.findIndex(cr => cr.maCumRap === ma_cum_rap);

                if (cumRapIndex === -1) {
                    heThongRapObj[ma_he_thong_rap].cumRapChieu.push({
                        lichChieuPhim: [{
                            maLichChieu: ma_lich_chieu,
                            maRap: ma_rap,
                            tenRap: ten_rap,
                            ngayChieuGioChieu: ngay_gio_chieu,
                            giaVe: gia_ve,
                            thoiLuong: 120
                        }],
                        maCumRap: ma_cum_rap,
                        tenCumRap: ten_cum_rap,
                        diaChi: dia_chi

                    });
                } else {
                    heThongRapObj[ma_he_thong_rap].cumRapChieu[cumRapIndex].lichChieuPhim.push({
                        maLichChieu: ma_lich_chieu,
                        maRap: ma_rap,
                        tenRap: ten_rap,
                        ngayChieuGioChieu: ngay_gio_chieu,
                        giaVe: gia_ve,
                        thoiLuong: 120
                    });
                }
            });

            let heThongRapChieu = {
                heThongRapChieu: Object.values(heThongRapObj),
                maPhim: ma_phim,
                tenPhim: ten_phim,
                trailer: trailer,
                hinhAnh: hinh_anh,
                moTa: mo_ta,
                maNhom: ma_nhom,
                hot,
                dangChieu: dang_chieu,
                sapChieu: sap_chieu,
                ngayKhoiChieu: ngay_khoi_chieu,
                danhGia: danh_gia
            }


            this.utilsService.responseSend(res, "Xử lý thành công!", heThongRapChieu, 200)

        } catch (err) {
            this.utilsService.responseSend(res, err.message, '', 500)
        }
    }

}
