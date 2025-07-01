import {
  IsNotEmpty,
  IsString,
  IsOptional,
  MaxLength,
  IsIn,
} from 'class-validator';
import { ReasonType } from '../../../domain/value-objects/reason-type';

export class ReportPostDto {
  @IsString()
  @IsNotEmpty()
  postId: string;

  @IsString()
  @IsOptional()
  uid?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(ReasonType))
  reasonType: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  comment?: string;
}
