import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { DatVeService } from './dat-ve.service';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateScheduleDto } from './dto/create-schedule.dts';


@ApiTags("QuanLyDatVe")
@Controller('QuanLyDatVe')
export class DatVeController {
  constructor(private readonly datVeService: DatVeService) {
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @ApiBody({
    description: 'DanhSachVe',
    type: CreateTicketDto,
    required: false
  })
  @Post("DatVe")
  bookTicket(@Body() body: CreateTicketDto, @Req() req: any, @Res() res: any) {
    const authorization = req.headers;
    return this.datVeService.bookTicket(body, authorization, res)
  }


  @ApiQuery({ name: 'MaLichChieu', required: false })
  @Get("LayDanhSachPhongVe")
  getListTicketRoom(@Query("MaLichChieu") query: string, @Res() res: any) {
    return this.datVeService.getListTicketRoom(query, res)
  }



  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @ApiBody({
    description: 'lich',
    type: CreateScheduleDto,
    required: false
  })
  @Post("TaoLichChieu")
  createSchedule(@Body() body: CreateScheduleDto, @Req() req: any, @Res() res: any) {
    const authorization = req.headers;
    return this.datVeService.createSchedule(body, authorization, res)
  }
}
