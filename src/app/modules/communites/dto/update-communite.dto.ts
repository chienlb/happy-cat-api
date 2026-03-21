import { PartialType } from '@nestjs/swagger';
import { CreateCommuniteDto } from './create-communite.dto';

export class UpdateCommuniteDto extends PartialType(CreateCommuniteDto) {}
