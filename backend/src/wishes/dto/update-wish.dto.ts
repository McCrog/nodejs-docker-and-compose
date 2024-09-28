import { IsUrl, Length, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { CreateWishDto } from './create-wish.dto';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  @Length(1, 250)
  @IsOptional()
  name?: string;

  @IsUrl()
  @IsOptional()
  link?: string;

  @IsUrl()
  @IsOptional()
  image?: string;

  @IsOptional()
  price?: number;

  @Length(1, 1024)
  @IsOptional()
  description?: string;

  @IsOptional()
  raised?: number;
}
