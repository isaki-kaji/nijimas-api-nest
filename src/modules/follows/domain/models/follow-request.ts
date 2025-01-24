import { Uid } from 'modules/common/domain/value-objects/uid';
import { FollowRequestStatus } from '../value-objects/follow-request-status';
import { UUID } from 'modules/common/domain/value-objects/uuid';
import { FollowRequestStatusEnum } from '../enums/follow-request-status.enum';

export class FollowRequest {
  status: FollowRequestStatus;
  constructor(
    readonly requestId: UUID,
    readonly uid: Uid,
    readonly requestedUid: Uid,
    status: FollowRequestStatus,
  ) {
    this.status = status;
  }

  accept(): void {
    this.status = FollowRequestStatus.create(FollowRequestStatusEnum.ACCEPTED);
  }

  reject(): void {
    this.status = FollowRequestStatus.create(FollowRequestStatusEnum.REJECTED);
  }

  isPending(): boolean {
    return this.status.getValue() === FollowRequestStatusEnum.PENDING;
  }
}
