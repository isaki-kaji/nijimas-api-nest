import { Uid } from 'modules/common/domain/value-objects/uid';
import { Uuid } from 'modules/common/domain/value-objects/uuid';

export class Favorite {
  constructor(
    readonly uid: Uid,
    readonly postId: Uuid,
  ) {}
}
