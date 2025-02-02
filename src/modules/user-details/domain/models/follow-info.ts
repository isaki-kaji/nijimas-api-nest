import { Count } from '../../../common/domain/value-objects/count';
import { FollowingStatus } from '../value-objects/following-status';

export class FollowInfo {
  constructor(
    private readonly followingCount: Count,
    private readonly followersCount: Count,
    private readonly followingStatus: FollowingStatus,
  ) {}
}
