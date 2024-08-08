import { ApiProperty } from "@nestjs/swagger";

export class BaseNguoiDungDto {
    @ApiProperty()
    taiKhoan: string;

    @ApiProperty()
    matKhau: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    soDt: string;

    @ApiProperty()
    maNhom: string;

    @ApiProperty()
    hoTen: string;

    @ApiProperty()
    maLoaiNguoiDung: string;
}
