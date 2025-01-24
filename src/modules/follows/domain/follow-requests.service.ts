import { Inject, Injectable } from '@nestjs/common';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { IFollowRequestsRepository } from './i.follow-requests.repository';

@Injectable()
export class FollowRequestsService {
  constructor(
    @Inject('IFollowRequestsRepository')
    private readonly repository: IFollowRequestsRepository,
  ) {}

  async hasPendingRequest(uid: Uid, requestedUid: Uid): Promise<boolean> {
    const foundFollowRequest = await this.repository.findOne(uid, requestedUid);
    if (!foundFollowRequest) {
      return false;
    }

    return foundFollowRequest.isPending();
  }
}
