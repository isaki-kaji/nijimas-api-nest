import { IsNotEmpty, IsOptional } from 'class-validator';

export class FollowRequestDto {
  @IsOptional()
  readonly uid?: string;

  @IsNotEmpty({ message: 'Requested UID is required' })
  readonly requestedUid: string;
}
