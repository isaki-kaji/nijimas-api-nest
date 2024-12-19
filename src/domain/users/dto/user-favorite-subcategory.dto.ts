import { IsString, IsUUID, MaxLength } from 'class-validator';

export class UserFavoriteSubCategoryDto {
  @IsString()
  @MaxLength(1)
  categoryNo: string;

  @IsUUID()
  categoryId: string;
}
