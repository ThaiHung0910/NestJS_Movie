import { OmitType } from '@nestjs/swagger';
import { BaseNguoiDungDto } from './base-nguoi-dung.dto';



export class SignUpNguoiDungDto extends OmitType(BaseNguoiDungDto, ['maLoaiNguoiDung'] as const) { }