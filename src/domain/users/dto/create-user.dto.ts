import {
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  uid?: string;

  @IsString()
  @MinLength(2, { message: 'Username must be at least 2 characters long' })
  @MaxLength(14, { message: 'Username must be at most 14 characters long' })
  username: string;

  @IsOptional()
  @IsString()
  @Length(2, 2, { message: 'Country code must be exactly 2 characters long' })
  countryCode?: string;
}
