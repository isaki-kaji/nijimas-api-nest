import { Uid } from 'modules/common/domain/value-objects/uid';
import { Uuid } from 'modules/common/domain/value-objects/uuid';
import { FollowRequestStatus } from '../value-objects/follow-request-status';

export class FollowRequest {
  constructor(
    private readonly _requestId: Uuid,
    private readonly _uid: Uid,
    private readonly _requestedUid: Uid,
    private _status: FollowRequestStatus,
    private readonly _version: number,
  ) {}

  get requestId(): Uuid {
    return this._requestId;
  }

  get uid(): Uid {
    return this._uid;
  }

  get requestedUid(): Uid {
    return this._requestedUid;
  }

  get status(): FollowRequestStatus {
    return this._status;
  }

  accept(): void {
    this._status = FollowRequestStatus.Accepted;
  }

  reject(): void {
    this._status = FollowRequestStatus.Rejected;
  }

  isForUser(uid: Uid): boolean {
    return this._requestedUid.equals(uid);
  }

  isPending(): boolean {
    return this.status == FollowRequestStatus.Pending;
  }
}
