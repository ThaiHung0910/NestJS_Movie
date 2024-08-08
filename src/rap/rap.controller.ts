import { Controller, Get, Res, Query } from '@nestjs/common';
import { RapService } from './rap.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';




@ApiTags("QuanLyRap")
@Controller('QuanLyRap')
export class RapController {
  constructor(private readonly rapService: RapService) { }


  @ApiQuery({ name: "maHeThongRap", required: false })
  @Get('LayThongTinHeThongRap')
  getTheatersSystem(@Query('maHeThongRap') query: string, @Res() res: any) {
    return this.rapService.getTheaterSystem(query, res);
  }

  @ApiQuery({ name: 'maHeThongRap', required: false })
  @Get("LayThongTinCumRapTheoHeThong")
  getTheaterComplex(@Query("maHeThongRap") query: string, @Res() res: any) {
    return this.rapService.getTheaterComplex(query, res)
  }

  @ApiQuery({ name: 'maHeThongRap', required: false })
  @Get("LayThongTinLichChieuHeThongRap")
  getInfoShowtimesSystem(@Query("maHeThongRap") query: string, @Res() res: any) {
    return this.rapService.getInfoShowtimesSystem(query, res)
  }

  @ApiQuery({ name: 'MaPhim', required: false })
  @Get("LayThongTinLichChieuPhim")
  getInfoMovie(@Query("MaPhim") query: string, @Res() res: any) {
    return this.rapService.getInfoMovie(query, res)
  }
}





