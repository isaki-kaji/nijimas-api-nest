import { Uid } from 'modules/common/domain/value-objects/uid';

export class Follow {
  constructor(
    private readonly _uid: Uid,
    private readonly _followingUid: Uid,
  ) {}

  get uid(): Uid {
    return this._uid;
  }

  get followingUid(): Uid {
    return this._followingUid;
  }
}
