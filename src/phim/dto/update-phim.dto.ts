import { PartialType } from '@nestjs/swagger';
import { CreatePhimDto } from './create-phim.dto';

export class UpdatePhimDto extends PartialType(CreatePhimDto) {}
