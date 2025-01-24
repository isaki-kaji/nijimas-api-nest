import { Controller, Get } from '@nestjs/common';
import { FollowRequestsUsecase } from './follow-requests.usecase';
import { OwnUid } from 'common/decorator/own-uid.decorator';

@Controller()
export class FollowRequestsController {
  constructor(private readonly usecase: FollowRequestsUsecase) {}

  @Get('/me/follow-requests')
  async getFollowRequests(@OwnUid() uid: string) {
    return await this.usecase.getFollowRequests(uid);
  }
}
