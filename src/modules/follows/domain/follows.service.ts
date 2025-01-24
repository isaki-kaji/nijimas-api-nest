import { Inject, Injectable } from '@nestjs/common';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { IFollowsRepository } from './i.follows.repository';

@Injectable()
export class FollowsService {
  constructor(
    @Inject('IFollowsRepository')
    private readonly repository: IFollowsRepository,
  ) {}

  async exists(uid: Uid, followingUid: Uid): Promise<boolean> {
    const foundFollow = await this.repository.findOne(uid, followingUid);
    return !!foundFollow;
  }
}
