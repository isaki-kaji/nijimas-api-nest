import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { UserFavoriteSubCategoryDto } from '../user-favorite-subcategory.dto';
import { Type } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserFavoriteSubCategoryDto)
  favoriteSubCategories: UserFavoriteSubCategoryDto[];
}
