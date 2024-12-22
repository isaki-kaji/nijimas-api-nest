import {
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { User } from 'users/entities/user.entity';

export class CreateUserDto {
  @IsOptional()
  uid?: string;

  @IsString()
  @MinLength(2, { message: 'Username must be at least 2 characters long' })
  @MaxLength(14, { message: 'Username must be at most 14 characters long' })
  username: string;

  @IsOptional()
  @MaxLength(200, {
    message: 'Self introduction must be at most 200 characters long',
  })
  selfIntro?: string;

  @IsOptional()
  @MaxLength(2000, {
    message: 'Profile image URL must be at most 2000 characters long',
  })
  profileImageUrl?: string;

  @IsOptional()
  @IsString()
  @Length(2, 2, { message: 'Country code must be exactly 2 characters long' })
  countryCode?: string;

  static toEntity(dto: CreateUserDto): User {
    const user = new User();
    user.uid = dto.uid;
    user.username = dto.username;
    user.selfIntro = dto.selfIntro;
    user.profileImageUrl = dto.profileImageUrl;
    user.countryCode = dto.countryCode;
    return user;
  }
}
