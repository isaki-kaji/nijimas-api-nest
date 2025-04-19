import { Uid } from 'modules/common/domain/value-objects/uid';
import { Uuid } from 'modules/common/domain/value-objects/uuid';

export class Favorite {
  constructor(
    private readonly _uid: Uid,
    private readonly _postId: Uuid,
    private readonly _isFavorite: boolean,
  ) {}

  get uid(): Uid {
    return this._uid;
  }

  get postId(): Uuid {
    return this._postId;
  }

  get isFavorite(): boolean {
    return this._isFavorite;
  }
}
