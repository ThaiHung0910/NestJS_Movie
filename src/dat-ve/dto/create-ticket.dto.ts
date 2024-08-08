import { ApiProperty } from "@nestjs/swagger";

export class SeatDto {
    @ApiProperty({ example: 0 })
    maGhe: number;

    @ApiProperty({ example: 0 })
    giaVe: number;
}


export class CreateTicketDto {

    @ApiProperty()
    maLichChieu: number


    @ApiProperty({ type: [SeatDto] })
    danhSachVe: SeatDto[];
}
