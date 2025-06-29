import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class BlockUserDto {
  @IsString()
  @IsNotEmpty()
  blockedUid: string;

  @IsString()
  @IsOptional()
  uid?: string;
}
