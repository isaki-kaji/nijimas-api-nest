import { Uid } from 'modules/common/domain/value-objects/uid';
import { FollowRequestStatus } from '../value-objects/follow-request-status';
import { Uuid } from 'modules/common/domain/value-objects/uuid';
import { FollowRequestStatusEnum } from '../enums/follow-request-status.enum';

export class FollowRequest {
  status: FollowRequestStatus;
  constructor(
    private readonly requestId: Uuid,
    private readonly uid: Uid,
    private readonly requestedUid: Uid,
    status: FollowRequestStatus,
  ) {
    this.status = status;
  }

  getRequestId(): Uuid {
    return this.requestId;
  }

  getUid(): Uid {
    return this.uid;
  }

  getRequestedUid(): Uid {
    return this.requestedUid;
  }

  accept(): void {
    this.status = FollowRequestStatus.create(FollowRequestStatusEnum.ACCEPTED);
  }

  reject(): void {
    this.status = FollowRequestStatus.create(FollowRequestStatusEnum.REJECTED);
  }

  isForUser(uid: Uid): boolean {
    return this.requestedUid.equals(uid);
  }

  isPending(): boolean {
    return this.status.getValue() === FollowRequestStatusEnum.PENDING;
  }
}
