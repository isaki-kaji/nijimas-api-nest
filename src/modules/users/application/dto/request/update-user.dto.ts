import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsInt, Min, IsString, Matches } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsInt()
  @Min(0)
  version: number;

  @IsString()
  @Matches(/^[a-zA-Z0-9]{6}$/, {
    message: 'userCode must be exactly 6 alphanumeric characters',
  })
  userCode: string;
}
