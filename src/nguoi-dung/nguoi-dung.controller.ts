import { Controller, Get, Post, Body, Put, Delete, Query, Res, UseGuards, Req, } from '@nestjs/common';
import { NguoiDungService } from './nguoi-dung.service';
import { CreateNguoiDungDto } from './dto/create-nguoi-dung.dto';
import { UpdateNguoiDungDto } from './dto/update-nguoi-dung.dto';
import { LoginNguoiDungDto } from './dto/login-nguoi-dung.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SignUpNguoiDungDto } from './dto/signUp-nguoi-dung.dto';



@ApiTags("QuanLyNguoiDung")
@Controller('QuanLyNguoiDung')
export class NguoiDungController {
  constructor(private readonly nguoiDungService: NguoiDungService) { }



  @Get("LayDanhSachLoaiNguoiDung")
  getListTypeUser(@Res() res: Response) {
    return this.nguoiDungService.getListTypeUser(res)

  }



  @Post('/DangNhap')
  login(@Body() body: LoginNguoiDungDto, @Res() res: Response) {

    return this.nguoiDungService.login(body, res);

  }



  @Post('/DangKy')
  signUp(@Body() body: SignUpNguoiDungDto, @Res() res: any) {

    return this.nguoiDungService.signUp(body, res)


  }



  @Get('LayDanhSachNguoiDung')
  @ApiQuery({ name: 'maNhom', required: false, example: 'GP01' })
  getListUser(@Query('maNhom') maNhom: string, @Res() res: any) {
    return this.nguoiDungService.getListUser(maNhom, res);
  }



  @Get('TimKiemNguoiDung')
  @ApiQuery({ name: 'maNhom', required: false, example: 'GP01' })
  @ApiQuery({ name: 'tuKhoa', required: false })
  findUser(@Query('tuKhoa') tuKhoa: string, @Query('maNhom') maNhom: string, @Res() res: Response) {
    return this.nguoiDungService.findUser(tuKhoa, maNhom, res);
  }


  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Post('ThongTinTaiKhoan')
  getInfoOwner(@Req() req: Request, @Res() res: Response) {
    const authorization = req.headers;
    return this.nguoiDungService.getInfoOwner(authorization, res);
  }


  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @ApiQuery({ name: 'taiKhoan', required: false })
  @Post('LayThongTinNguoiDung')
  getInfoUser(@Query("taiKhoan") query: string, @Req() req: Request, @Res() res: Response) {
    const authorization = req.headers;
    return this.nguoiDungService.getInfoUser(query, authorization, res);
  }


  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Post('ThemNguoiDung')
  addUser(@Body() body: CreateNguoiDungDto, @Req() req: Request, @Res() res: Response) {
    const authorization = req.headers;
    return this.nguoiDungService.addUser(body, authorization, res);
  }



  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Put('CapNhatThongTinNguoiDung')
  updateOwner(@Body() body: UpdateNguoiDungDto, @Req() req: Request, @Res() res: Response) {
    const authorization = req.headers;
    return this.nguoiDungService.updateOwner(body, authorization, res);
  }


  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Post('CapNhatThongTinNguoiDung')
  updateUser(@Body() body: UpdateNguoiDungDto, @Req() req: Request, @Res() res: Response) {
    const authorization = req.headers;
    return this.nguoiDungService.updateUser(body, authorization, res);
  }



  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @ApiQuery({ name: 'TaiKhoan', required: false })
  @Delete('XoaNguoiDung')
  remove(@Query('TaiKhoan') TaiKhoan: string, @Req() req: Request, @Res() res: Response) {
    const authorization = req.headers;
    return this.nguoiDungService.remove(TaiKhoan, authorization, res);
  }
}
