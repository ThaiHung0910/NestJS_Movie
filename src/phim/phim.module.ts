import { Module } from '@nestjs/common';
import { PhimService } from './phim.service';
import { PhimController } from './phim.controller';
import { UtilsService } from 'src/utils';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/utils/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [PhimController],
  providers: [PhimService, UtilsService, AuthService],
})
export class PhimModule { }
