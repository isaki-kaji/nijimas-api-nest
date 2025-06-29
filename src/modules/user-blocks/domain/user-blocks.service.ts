import { Inject, Injectable } from '@nestjs/common';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { IUserBlocksRepository } from './i.user-blocks.repository';

@Injectable()
export class UserBlocksService {
  constructor(
    @Inject('IUserBlocksRepository')
    private readonly repository: IUserBlocksRepository,
  ) {}

  async exists(blockerUid: Uid, blockedUid: Uid): Promise<boolean> {
    return await this.repository.exists(blockerUid, blockedUid);
  }
}
