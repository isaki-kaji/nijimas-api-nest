import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { IUserBlocksRepository } from '../domain/i.user-blocks.repository';
import { UserBlocksService } from '../domain/user-blocks.service';

@Injectable()
export class UnblockUserUseCase {
  constructor(
    @Inject('IUserBlocksRepository')
    private readonly repository: IUserBlocksRepository,
    private readonly userBlocksService: UserBlocksService,
  ) {}

  async execute(blockerUid: string, blockedUid: string): Promise<void> {
    const blockerUidObj = Uid.create(blockerUid);
    const blockedUidObj = Uid.create(blockedUid);

    // ブロックが存在するかチェック
    const exists = await this.userBlocksService.exists(
      blockerUidObj,
      blockedUidObj,
    );

    if (!exists) {
      throw new NotFoundException('Block relationship does not exist');
    }

    await this.repository.delete(blockerUidObj, blockedUidObj);
  }
}
