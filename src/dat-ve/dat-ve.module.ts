import { Module } from '@nestjs/common';
import { DatVeService } from './dat-ve.service';
import { DatVeController } from './dat-ve.controller';
import { UtilsService } from 'src/utils';
import { AuthService } from 'src/utils/jwt';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [DatVeController],
  providers: [DatVeService, UtilsService, AuthService],
})
export class DatVeModule { }
