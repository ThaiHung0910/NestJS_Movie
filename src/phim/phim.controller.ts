import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query, UseGuards, Req, HttpCode, } from '@nestjs/common';
import { PhimService } from './phim.service';
import { CreatePhimDto } from './dto/create-phim.dto';
import { ApiQuery, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UpdatePhimDto } from './dto/update-phim.dto';
import { Authenticated } from 'src/utils/decorator';



@ApiTags("QuanLyPhim")
@Controller('QuanLyPhim')
export class PhimController {
  constructor(private readonly phimService: PhimService) { }



  @Get('LayDanhSachBanner')
  getListBanner(@Res() res: any) {
    return this.phimService.getBanner(res)
  }


  @Get('LayDanhSachPhim')
  @ApiQuery({ name: 'maNhom', required: false, example: "GP01" })
  @ApiQuery({ name: 'tenPhim', required: false })
  getListMovie(@Query('maNhom') groupCode: string, @Query('tenPhim') query: string, @Res() res: any) {
    return this.phimService.getListMovie(query, groupCode, res)
  }



  @Get('LayDanhSachPhimPhanTrang')
  @ApiQuery({ name: 'maNhom', required: false, example: "GP01" })
  @ApiQuery({ name: 'tenPhim', required: false })
  @ApiQuery({ name: 'soTrang', required: false, example: '1' })
  @ApiQuery({ name: 'soPhanTuTrenTrang', required: false, example: '10' })
  getPaginationMovieList(@Query('maNhom') maNhom: string, @Query('tenPhim') tenPhim: string, @Query('soTrang') soTrang: number, @Query('soPhanTuTrenTrang') soPhanTuTrenTrang: number, @Res() res: any) {
    return this.phimService.getPaginationMovieList(maNhom, tenPhim, soTrang, soPhanTuTrenTrang, res)
  }

  @Get('LayDanhSachPhimTheoNgay')
  @ApiQuery({ name: 'maNhom', required: false, example: "GP01" })
  @ApiQuery({ name: 'tenPhim', required: false })
  @ApiQuery({ name: 'soTrang', required: false, example: '1' })
  @ApiQuery({ name: 'soPhanTuTrenTrang', required: false, example: '10' })
  @ApiQuery({ name: 'tuNgay', required: false })
  @ApiQuery({ name: 'denNgay', required: false })
  getListMovieByDate(@Query('maNhom') maNhom: string, @Query('tenPhim') tenPhim: string, @Query('soTrang') soTrang: number, @Query('soPhanTuTrenTrang') soPhanTuTrenTrang: number, @Query("tuNgay") tuNgay: string, @Query("denNgay") denNgay: string, @Res() res: any) {
    return this.phimService.getMovieListByDate(maNhom, tenPhim, soTrang, soPhanTuTrenTrang, tuNgay, denNgay, res)
  }





  @HttpCode(200)
  @Post('ThemPhimUploadHinh')
  addMovieUploadPicture(@Body() createPhimDto: CreatePhimDto, @Res() res: any) {
    return this.phimService.addMovie(createPhimDto, res);
  }


  @HttpCode(200)
  @Post('CapNhatPhimUpload')
  updateMovie(@Body() updatePhimDto: UpdatePhimDto, @Res() res: any) {
    return this.phimService.updateMovie(updatePhimDto, res);
  }


  @HttpCode(200)
  @Post('')
  addMovie(@Body() createPhimDto: CreatePhimDto, @Res() res: any) {
    return this.phimService.addMovie(createPhimDto, res);
  }



  @Authenticated()
  @ApiQuery({ name: 'MaPhim', required: false })
  @Delete('XP')
  deleteMovie(@Query('MaPhim') query: string, @Req() req: Request, @Res() res: any) {
    const authorization = req.headers;
    return this.phimService.removeMovie(query, authorization, res);
  }

  @Authenticated()
  @ApiQuery({ name: 'MaPhim', required: false })
  @Delete('XoaPhim')
  removeMovie(@Query('MaPhim') query: string, @Req() req: Request, @Res() res: any) {
    const authorization = req.headers;
    return this.phimService.removeMovie(query, authorization, res);
  }

  @ApiQuery({ name: 'MaPhim', required: false })
  @Get('LayThongTinPhim')
  getInfoMovie(@Query("MaPhim") query: string, @Res() res: any) {
    return this.phimService.getInfoMovie(query, res)
  }
}
