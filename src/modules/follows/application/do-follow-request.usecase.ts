import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { FollowRequestsService } from 'follows/domain/follow-requests.service';
import { FollowsService } from 'follows/domain/follows.service';
import { FollowRequestsFactory } from './factory/follow-requests.factory';
import { IFollowRequestsRepository } from 'follows/domain/i.follow-requests.repository';
import { FollowDto } from './dto/request/follow-request.dto';

@Injectable()
export class DoFollowRequestUsecase {
  constructor(
    private readonly followsService: FollowsService,
    private readonly service: FollowRequestsService,
    private readonly factory: FollowRequestsFactory,
    @Inject('IFollowRequestsRepository')
    private readonly repository: IFollowRequestsRepository,
  ) {}

  async execute(dto: FollowDto): Promise<void> {
    const request = this.factory.createModel(dto);

    const existsFollow = await this.followsService.exists(
      request.getUid(),
      request.getRequestedUid(),
    );

    if (existsFollow) {
      throw new ConflictException('You already follow this user');
    }

    const existsPendingRequest = await this.service.hasPendingRequest(
      request.getUid(),
      request.getRequestedUid(),
    );

    if (existsPendingRequest) {
      throw new ConflictException('You already have a pending request');
    }

    await this.repository.save(request);
  }
}
