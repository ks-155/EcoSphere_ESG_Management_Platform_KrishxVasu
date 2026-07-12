import { PartialType } from '@nestjs/swagger';
import { CreateProductProfileDto } from './create-product-profile.dto';

export class UpdateProductProfileDto extends PartialType(CreateProductProfileDto) {}
