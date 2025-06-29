import { Uid } from 'modules/common/domain/value-objects/uid';

export class UserBlock {
  constructor(
    private readonly _blockerUid: Uid,
    private readonly _blockedUid: Uid,
  ) {}

  get blockerUid(): Uid {
    return this._blockerUid;
  }

  get blockedUid(): Uid {
    return this._blockedUid;
  }
}
