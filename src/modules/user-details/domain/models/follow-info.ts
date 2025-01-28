import { Count } from '../value-objects/count';
import { FollowingStatus } from '../value-objects/following-status';

export class FollowInfo {
  constructor(
    readonly followingCount: Count,
    readonly followersCount: Count,
    readonly followingStatus: FollowingStatus,
  ) {}
}
