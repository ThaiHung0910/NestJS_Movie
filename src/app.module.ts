import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { NguoiDungModule } from './nguoi-dung/nguoi-dung.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PhimModule } from './phim/phim.module';
import { RapModule } from './rap/rap.module';
import { DatVeModule } from './dat-ve/dat-ve.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatVeModule, NguoiDungModule, PhimModule, RapModule],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule { }
