import { Uid } from 'modules/common/domain/value-objects/uid';
import { Uuid } from 'modules/common/domain/value-objects/uuid';
import { FollowRequestStatus } from '../value-objects/follow-request-status';

export class FollowRequest {
  constructor(
    private readonly requestId: Uuid,
    private readonly uid: Uid,
    private readonly requestedUid: Uid,
    private status: FollowRequestStatus,
    private readonly version: number,
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

  getStatus(): FollowRequestStatus {
    return this.status;
  }

  accept(): void {
    this.status = FollowRequestStatus.Accepted;
  }

  reject(): void {
    this.status = FollowRequestStatus.Rejected;
  }

  isForUser(uid: Uid): boolean {
    return this.requestedUid.equals(uid);
  }

  isPending(): boolean {
    return this.status == FollowRequestStatus.Pending;
  }
}
