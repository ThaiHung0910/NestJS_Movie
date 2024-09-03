import { Controller, Get, Res, Query } from '@nestjs/common';
import { RapService } from './rap.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { QueryCodeMovie, QueryCodeTheater } from 'src/utils/decorator';



@ApiTags("QuanLyRap")
@Controller('QuanLyRap')
export class RapController {
  constructor(private readonly rapService: RapService) { }


  @QueryCodeTheater()
  @Get('LayThongTinHeThongRap')
  getTheatersSystem(@Query('maHeThongRap') query: string, @Res() res: any) {
    return this.rapService.getTheaterSystem(query, res);
  }

  @QueryCodeTheater()
  @Get("LayThongTinCumRapTheoHeThong")
  getTheaterComplex(@Query("maHeThongRap") query: string, @Res() res: any) {
    return this.rapService.getTheaterComplex(query, res)
  }

  @QueryCodeTheater()
  @Get("LayThongTinLichChieuHeThongRap")
  getInfoShowtimesSystem(@Query("maHeThongRap") query: string, @Res() res: any) {
    return this.rapService.getInfoShowtimesSystem(query, res)
  }

  @QueryCodeMovie()
  @Get("LayThongTinLichChieuPhim")
  getInfoMovie(@Query("MaPhim") query: string, @Res() res: any) {
    return this.rapService.getInfoMovie(query, res)
  }
}





