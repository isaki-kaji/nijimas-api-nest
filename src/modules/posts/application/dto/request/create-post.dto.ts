import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsIn,
  IsNumberString,
  IsArray,
} from 'class-validator';

export class CreatePostDto {
  @IsOptional()
  readonly uid?: string;

  @IsNotEmpty({ message: 'Post ID is required' })
  readonly postId: string;

  @IsString()
  @IsNotEmpty({ message: 'Main category is required' })
  @MaxLength(255, { message: 'Main category must not exceed 255 characters' })
  readonly mainCategory: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  readonly subCategories: string[] = [];

  @IsOptional()
  @IsString()
  @MaxLength(400, { message: 'Post text must not exceed 2000 characters' })
  readonly postText?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Photo URL must not exceed 2000 characters' })
  readonly photoUrl?: string;

  @IsString()
  @IsNotEmpty({ message: 'Expense is required' })
  @IsNumberString({}, { message: 'Expense must be a valid number' })
  readonly expense: string;

  @IsOptional()
  @IsString()
  readonly location?: string;

  @IsString()
  @IsNotEmpty({ message: 'Public type is required' })
  @IsIn(['0', '1', '2'], { message: 'Public type must be one of: 0, 1, 2' })
  readonly publicTypeNo: string;
}
