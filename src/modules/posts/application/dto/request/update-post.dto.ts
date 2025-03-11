import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { IsInt, Min } from 'class-validator';

export class UpdatePostDto extends PartialType(
  OmitType(CreatePostDto, ['postId'] as const),
) {
  @IsInt()
  @Min(0)
  version: number;
}
