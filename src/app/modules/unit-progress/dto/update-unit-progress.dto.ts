import { PartialType } from '@nestjs/swagger';
import { CreateUnitProgressDto } from './create-unit-progress.dto';

export class UpdateUnitProgressDto extends PartialType(CreateUnitProgressDto) {}
