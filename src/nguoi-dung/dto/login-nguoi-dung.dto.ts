import { PickType } from '@nestjs/swagger';
import { BaseNguoiDungDto } from './base-nguoi-dung.dto';


export class LoginNguoiDungDto extends PickType(BaseNguoiDungDto, ['taiKhoan', 'matKhau'] as const) { }