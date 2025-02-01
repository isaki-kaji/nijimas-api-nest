import { Uid } from 'modules/common/domain/value-objects/uid';

export class Follow {
  constructor(
    private readonly uid: Uid,
    private readonly followingUid: Uid,
  ) {}
}
