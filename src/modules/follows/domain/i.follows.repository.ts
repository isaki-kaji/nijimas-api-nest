import { Uid } from 'modules/common/domain/value-objects/uid';
import { Follow } from './models/follow';

export interface IFollowsRepository {
  save(request: Follow): Promise<void>;
  findOne(uid: Uid, followingUid: Uid): Promise<Follow | null>;
}
