import { Uid } from 'modules/common/domain/value-objects/uid';
import { FollowRequest } from './models/follow-request';
import { FollowRequestRow } from '../infrastructure/follow-request.row';

export interface IFollowRequestsRepository {
  save(request: FollowRequest): Promise<void>;
  delete(request: FollowRequest): Promise<void>;
  findOne(uid: Uid, followingUid: Uid): Promise<FollowRequest | null>;
  findByUidWithUserInfo(uid: Uid): Promise<FollowRequestRow[]>;
}
