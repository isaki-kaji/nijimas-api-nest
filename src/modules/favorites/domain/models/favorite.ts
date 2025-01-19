import { Uid } from 'modules/common/domain/value-objects/uid';
import { UUID } from 'modules/common/domain/value-objects/uuid';

export class Favorite {
  constructor(
    readonly uid: Uid,
    readonly postId: UUID,
  ) {}
}
