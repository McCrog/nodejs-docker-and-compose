import { IsUrl, IsArray, Length, MaxLength, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { CreateWishlistDto } from './create-wishlist.dto';

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {
  @Length(1, 250)
  @IsOptional()
  name?: string;

  @MaxLength(1500)
  @IsOptional()
  description: string;

  @IsUrl()
  @IsOptional()
  image?: string;

  @IsArray()
  @IsOptional()
  itemsId?: Array<number>;
}
