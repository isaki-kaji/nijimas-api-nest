import { Uid } from 'modules/common/domain/value-objects/uid';
import { FollowRequest } from './models/follow-request';
import { Uuid } from 'modules/common/domain/value-objects/uuid';
import { FollowRequestRow } from '../infrastructure/rows/follow-request.row';
import { EntityManager } from 'typeorm';

export interface IFollowRequestsRepository {
  save(request: FollowRequest, manager?: EntityManager): Promise<void>;
  delete(request: FollowRequest): Promise<void>;
  findOne(requestId: Uuid): Promise<FollowRequest | null>;
  findPendingRequestByUid(
    uid: Uid,
    requestedUid: Uid,
  ): Promise<FollowRequest | null>;
  findByUidWithUserInfo(uid: Uid): Promise<FollowRequestRow[]>;
}
