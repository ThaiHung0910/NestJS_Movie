import { ApiProperty } from "@nestjs/swagger";


export class CreatePhimDto {
    @ApiProperty()
    tenPhim: string

    @ApiProperty()
    hinhAnh: string

    @ApiProperty()
    trailer: string

    @ApiProperty()
    moTa: string

    @ApiProperty()
    maNhom: string

    @ApiProperty()
    ngayKhoiChieu: Date

    @ApiProperty()
    danhGia: Number;

    @ApiProperty()
    hot: boolean;

    @ApiProperty()
    dangChieu: boolean;

    @ApiProperty()
    sapChieu: boolean;
}
