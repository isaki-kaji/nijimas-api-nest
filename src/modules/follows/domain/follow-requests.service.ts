import { Inject, Injectable } from '@nestjs/common';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { IFollowRequestsRepository } from './i.follow-requests.repository';
import { FollowRequestStatus } from './value-objects/follow-request-status';
import { FollowRequestStatusEnum } from './enums/follow-request-status.enum';

@Injectable()
export class FollowRequestsService {
  constructor(
    @Inject('IFollowRequestsRepository')
    private readonly repository: IFollowRequestsRepository,
  ) {}

  async hasPendingRequest(uid: Uid, requestedUid: Uid): Promise<boolean> {
    const foundFollowRequest = await this.repository.findPendingRequestByUid(
      uid,
      requestedUid,
    );

    return !!foundFollowRequest;
  }
}
