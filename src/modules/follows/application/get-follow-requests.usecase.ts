import { Inject, Injectable } from '@nestjs/common';
import { FollowRequestsFactory } from './factory/follow-requests.factory';
import { IFollowRequestsRepository } from 'follows/domain/i.follow-requests.repository';
import { FollowRequestResponseDto } from './dto/response/follow-request.response.dto';
import { Uid } from 'modules/common/domain/value-objects/uid';

@Injectable()
export class GetFollowRequestsUsecase {
  constructor(
    private readonly factory: FollowRequestsFactory,
    @Inject('IFollowRequestsRepository')
    private readonly repository: IFollowRequestsRepository,
  ) {}

  async execute(uidStr: string): Promise<FollowRequestResponseDto[]> {
    const uid = Uid.create(uidStr);
    const requests = await this.repository.findByUidWithUserInfo(uid);

    return requests.map((request) => this.factory.createResponse(request));
  }
}
