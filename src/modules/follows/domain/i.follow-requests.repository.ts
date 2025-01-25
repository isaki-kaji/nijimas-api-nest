import { Uid } from 'modules/common/domain/value-objects/uid';
import { FollowRequest } from './models/follow-request';
import { FollowRequestRow } from '../infrastructure/follow-request.row';
import { Uuid } from 'modules/common/domain/value-objects/uuid';
import { FollowRequestStatus } from './value-objects/follow-request-status';

export interface IFollowRequestsRepository {
  save(request: FollowRequest): Promise<void>;
  delete(request: FollowRequest): Promise<void>;
  findOne(requestId: Uuid): Promise<FollowRequest | null>;
  findPendingRequestByUid(
    uid: Uid,
    requestedUid: Uid,
    status: FollowRequestStatus,
  ): Promise<FollowRequest | null>;
  findByUidWithUserInfo(uid: Uid): Promise<FollowRequestRow[]>;
}
