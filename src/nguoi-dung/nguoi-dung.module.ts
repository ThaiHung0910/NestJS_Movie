import { Module } from '@nestjs/common';
import { NguoiDungService } from './nguoi-dung.service';
import { NguoiDungController } from './nguoi-dung.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/utils/jwt';
import { UtilsService } from 'src/utils';

@Module({
  imports: [JwtModule.register({})],
  controllers: [NguoiDungController],
  providers: [NguoiDungService, AuthService, UtilsService],
})
export class NguoiDungModule { }
