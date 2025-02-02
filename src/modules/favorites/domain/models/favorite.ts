import { Uid } from 'modules/common/domain/value-objects/uid';
import { Uuid } from 'modules/common/domain/value-objects/uuid';

export class Favorite {
  constructor(
    private readonly uid: Uid,
    private readonly postId: Uuid,
  ) {}

  getUid(): Uid {
    return this.uid;
  }

  getPostId(): Uuid {
    return this.postId;
  }
}
