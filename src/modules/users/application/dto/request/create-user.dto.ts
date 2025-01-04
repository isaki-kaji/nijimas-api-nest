import {
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RegexUtils } from 'common/util/regex-utils';

export class CreateUserDto {
  @IsOptional()
  uid?: string;

  @IsString()
  @Matches(RegexUtils.NO_SPECIAL_CHARACTERS_SINGLE_LINE, {
    message: 'Username must not contain special characters',
  })
  @MinLength(2, { message: 'Username must be at least 2 characters long' })
  @MaxLength(14, { message: 'Username must be at most 14 characters long' })
  username: string;

  @IsOptional()
  @IsString()
  @Matches(RegexUtils.NO_SPECIAL_CHARACTERS, {
    message: 'Self intro must not contain special characters',
  })
  @MaxLength(200, {
    message: 'Self introduction must be at most 200 characters long',
  })
  selfIntro?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Profile image URL must be a valid URL' })
  @MaxLength(2000, {
    message: 'Profile image URL must be at most 2000 characters long',
  })
  profileImageUrl?: string;

  @IsOptional()
  @IsString()
  @Length(2, 2, { message: 'Country code must be exactly 2 characters long' })
  countryCode?: string;
}
