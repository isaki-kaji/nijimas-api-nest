import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FollowsService } from '../domain/follows.service';
import { IFollowsRepository } from '../domain/i.follows.repository';
import { FollowDto } from './dto/request/follow-request.dto';
import { FollowsFactory } from './factory/follows.factory';

@Injectable()
export class FollowsUsecase {
  constructor(
    private readonly followsService: FollowsService,
    private readonly followsFactory: FollowsFactory,
    @Inject('IFollowsRepository')
    private readonly repository: IFollowsRepository,
  ) {}

  async cancelFollow(dto: FollowDto): Promise<void> {
    const follow = this.followsFactory.createModel(dto);
    const followExists = await this.followsService.exists(
      follow.uid,
      follow.followingUid,
    );
    if (!followExists) {
      throw new NotFoundException('Follow not found');
    }

    await this.repository.delete(follow);
  }
}
