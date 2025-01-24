import { IsNotEmpty, IsOptional } from 'class-validator';

export class ToggleFavoriteDto {
  @IsOptional()
  readonly uid?: string;

  @IsNotEmpty({ message: 'Post ID is required' })
  readonly postId: string;
}
