import { Count } from '../../../common/domain/value-objects/count';
import { FollowingStatus } from '../value-objects/following-status';

export class FollowInfo {
  constructor(
    private readonly _followingStatus: FollowingStatus,
    private readonly _followersCount: Count,
    private readonly _followingCount: Count,
  ) {}

  get followingCount(): Count {
    return this._followingCount;
  }

  get followersCount(): Count {
    return this._followersCount;
  }

  get followingStatus(): FollowingStatus {
    return this._followingStatus;
  }
}
