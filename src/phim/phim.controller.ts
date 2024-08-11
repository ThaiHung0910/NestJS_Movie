import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query, UseGuards, Req, } from '@nestjs/common';
import { PhimService } from './phim.service';
import { CreatePhimDto } from './dto/create-phim.dto';
import { ApiQuery, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';


@ApiTags("QuanLyPhim")
@Controller('QuanLyPhim')
export class PhimController {
  constructor(private readonly phimService: PhimService) { }



  @Get('LayDanhSachBanner')
  getListBanner(@Res() res: any) {
    return this.phimService.getBanner(res)
  }


  @Get('LayDanhSachPhim')
  @ApiQuery({ name: 'maNhom', required: false })
  @ApiQuery({ name: 'tenPhim', required: false })
  getListMovie(@Query('maNhom') groupCode: string, @Query('tenPhim') query: string, @Res() res: any) {
    return this.phimService.getListMovie(query, groupCode, res)
  }



  @Get('LayDanhSachPhimPhanTrang')
  @ApiQuery({ name: 'maNhom', required: false, example: "GP01" })
  @ApiQuery({ name: 'tenPhim', required: false })
  @ApiQuery({ name: 'soTrang', required: false, example: '1' })
  @ApiQuery({ name: 'soPhanTuTrenTrang', required: false, example: '10' })
  getListMoviePage(@Query('maNhom') maNhom: string, @Query('tenPhim') tenPhim: string, @Query('soTrang') soTrang: number, @Query('soPhanTuTrenTrang') soPhanTuTrenTrang: number, @Res() res: any) {
    return this.phimService.getListMoviePage(maNhom, tenPhim, soTrang, soPhanTuTrenTrang, res)
  }


  @ApiQuery({ name: 'MaPhim', required: false })
  @Get('LayThongTinPhim')
  getInfoMovie(@Query("MaPhim") query: string, @Res() res: any) {
    return this.phimService.getInfoMovie(query, res)
  }




  @Post('ThemPhim')
  addMovie(@Body() createPhimDto: CreatePhimDto, @Res() res: any) {
    return this.phimService.addMovie(createPhimDto, res);
  }



  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @ApiQuery({ name: 'maPhim', required: false })
  @Delete('XoaPhim')
  removeMovie(@Query('maPhim') query: string, @Req() req: Request, @Res() res: any) {
    const authorization = req.headers;
    return this.phimService.removeMovie(query, authorization, res);
  }
}
