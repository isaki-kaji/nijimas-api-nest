import { UUID } from 'modules/common/domain/value-objects/uuid';
import { Favorite } from './models/favorite';
import { Uid } from 'modules/common/domain/value-objects/uid';

export interface IFavoritesRepository {
  create(favorite: Favorite): Promise<void>;
  delete(favorite: Favorite): Promise<void>;
  findOne(uid: Uid, postId: UUID): Promise<Favorite | null>;
}
