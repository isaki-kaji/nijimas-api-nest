import { Uid } from 'modules/common/domain/value-objects/uid';

export class Follow {
  constructor(
    private readonly uid: Uid,
    private readonly followingUid: Uid,
  ) {}

  getUid(): Uid {
    return this.uid;
  }

  getFollowingUid(): Uid {
    return this.followingUid;
  }
}
