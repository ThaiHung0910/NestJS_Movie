import { Controller, Get, Post, Body, Put, Delete, Query, Res, Req, HttpCode, } from '@nestjs/common';
import { NguoiDungService } from './nguoi-dung.service';
import { CreateNguoiDungDto } from './dto/create-nguoi-dung.dto';
import { UpdateNguoiDungDto } from './dto/update-nguoi-dung.dto';
import { LoginNguoiDungDto } from './dto/login-nguoi-dung.dto';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SignUpNguoiDungDto } from './dto/signUp-nguoi-dung.dto';
import { Authenticated, QueryUser, QueryPage } from 'src/utils/decorator';




@ApiTags("QuanLyNguoiDung")
@Controller('QuanLyNguoiDung')
export class NguoiDungController {
  constructor(private readonly nguoiDungService: NguoiDungService) { }




  @Get("LayDanhSachLoaiNguoiDung")
  getListTypeUser(@Res() res: Response) {
    return this.nguoiDungService.getListTypeUser(res)

  }

  @HttpCode(200)
  @ApiBody({
    description: 'ndDN',
    type: LoginNguoiDungDto,
    required: false
  })
  @Post('DangNhap')
  login(@Body() body: LoginNguoiDungDto, @Res() res: Response) {

    return this.nguoiDungService.login(body, res);

  }

  @HttpCode(200)
  @ApiBody({
    description: 'nd',
    type: SignUpNguoiDungDto,
    required: false
  })
  @Post('DangKy')
  signUp(@Body() body: SignUpNguoiDungDto, @Res() res: any) {
    return this.nguoiDungService.signUp(body, res)
  }



  @Get('LayDanhSachNguoiDung')
  @QueryUser()
  getListUser(@Query('MaNhom') MaNhom: string, @Query('tuKhoa') tuKhoa: string, @Res() res: any) {
    return this.nguoiDungService.getUserListSearch(tuKhoa, MaNhom, res);
  }

  @Get('LayDanhSachNguoiDungPhanTrang')
  @QueryUser()
  @QueryPage("20")
  getPaginationUserList(@Query('MaNhom') MaNhom: string, @Query('tuKhoa') tuKhoa: string, @Query('soTrang') soTrang: string, @Query('soPhanTuTrenTrang') soPhanTuTrenTrang: string, @Res() res: any) {
    return this.nguoiDungService.getPaginationUserList(MaNhom, tuKhoa, soTrang, soPhanTuTrenTrang, res);
  }


  @Get('TimKiemNguoiDung')
  @QueryUser()
  findListUser(@Query('MaNhom') MaNhom: string, @Query('tuKhoa') tuKhoa: string, @Res() res: Response) {
    return this.nguoiDungService.getUserListSearch(tuKhoa, MaNhom, res);
  }


  @Get('TimKiemNguoiDungPhanTrang')
  @QueryUser()
  @QueryPage("1")
  findPaginationUserList(@Query('MaNhom') MaNhom: string, @Query('tuKhoa') tuKhoa: string, @Query('soTrang') soTrang: string, @Query('soPhanTuTrenTrang') soPhanTuTrenTrang: string, @Res() res: any) {
    return this.nguoiDungService.getPaginationUserList(MaNhom, tuKhoa, soTrang, soPhanTuTrenTrang, res);
  }

  @Authenticated()
  @Post('ThongTinTaiKhoan')
  getInfoOwner(@Req() req: Request, @Res() res: Response) {
    const authorization = req.headers;
    return this.nguoiDungService.getInfoOwner(authorization, res);
  }

  @Authenticated()
  @ApiQuery({ name: 'taiKhoan', required: false })
  @Post('LayThongTinNguoiDung')
  getInfoUser(@Query("taiKhoan") query: string, @Req() req: Request, @Res() res: Response) {
    const authorization = req.headers;
    return this.nguoiDungService.getInfoUser(query, authorization, res);
  }



  @Authenticated()
  @ApiBody({
    description: 'nd',
    type: CreateNguoiDungDto,
    required: false
  })
  @Post('ThemNguoiDung')
  addUser(@Body() body: CreateNguoiDungDto, @Req() req: Request, @Res() res: Response) {
    const authorization = req.headers;
    return this.nguoiDungService.addUser(body, authorization, res);
  }



  @Authenticated()
  @ApiBody({
    description: 'nd',
    type: UpdateNguoiDungDto,
    required: false
  })
  @Put('CapNhatThongTinNguoiDung')
  updateOwner(@Body() body: UpdateNguoiDungDto, @Req() req: Request, @Res() res: Response) {
    const authorization = req.headers;
    return this.nguoiDungService.updateOwner(body, authorization, res);
  }

  @Authenticated()
  @ApiBody({
    description: 'nd',
    type: UpdateNguoiDungDto,
    required: false
  })
  @Post('CapNhatThongTinNguoiDung')
  updateUser(@Body() body: UpdateNguoiDungDto, @Req() req: Request, @Res() res: Response) {
    const authorization = req.headers;
    return this.nguoiDungService.updateUser(body, authorization, res);
  }



  @Authenticated()
  @ApiQuery({ name: 'TaiKhoan', required: false })
  @Delete('XoaNguoiDung')
  remove(@Query('TaiKhoan') TaiKhoan: string, @Req() req: Request, @Res() res: Response) {
    const authorization = req.headers;
    return this.nguoiDungService.remove(TaiKhoan, authorization, res);
  }
}
