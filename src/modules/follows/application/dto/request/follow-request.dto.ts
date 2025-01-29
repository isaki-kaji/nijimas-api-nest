import { IsNotEmpty, IsOptional } from 'class-validator';

export class FollowDto {
  @IsOptional()
  readonly uid?: string;

  @IsNotEmpty({ message: 'Target UID is required' })
  readonly targetUid: string;
}
