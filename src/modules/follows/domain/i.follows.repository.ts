import { Uid } from 'modules/common/domain/value-objects/uid';
import { Follow } from './models/follow';
import { EntityManager } from 'typeorm';

export interface IFollowsRepository {
  save(follow: Follow, manager?: EntityManager): Promise<void>;
  delete(follow: Follow): Promise<void>;
  findOne(uid: Uid, followingUid: Uid): Promise<Follow | null>;
}
