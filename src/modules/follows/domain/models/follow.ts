import { Uid } from 'modules/common/domain/value-objects/uid';

export class Follow {
  constructor(
    readonly uid: Uid,
    readonly followingUid: Uid,
  ) {}
}
