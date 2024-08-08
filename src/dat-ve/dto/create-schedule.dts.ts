import { ApiProperty } from "@nestjs/swagger";



export class CreateScheduleDto {

    @ApiProperty()
    maPhim: number

    @ApiProperty()
    ngayChieuGioChieu: string

    @ApiProperty()
    maRap: number

    @ApiProperty()
    giaVe: number
}