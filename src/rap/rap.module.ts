import { Module } from '@nestjs/common';
import { RapService } from './rap.service';
import { RapController } from './rap.controller';
import { UtilsService } from 'src/utils';

@Module({
  controllers: [RapController],
  providers: [RapService, UtilsService],
})
export class RapModule { }
