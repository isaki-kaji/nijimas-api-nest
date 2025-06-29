import { Inject, Injectable } from '@nestjs/common';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { UserBlocksFactory } from './factory/user-blocks.factory';
import { IUserBlocksRepository } from '../domain/i.user-blocks.repository';
import { BlockedUserResponseDto } from './dto/response/blocked-user.response.dto';

@Injectable()
export class GetBlockedUsersUsecase {
  constructor(
    private readonly factory: UserBlocksFactory,
    @Inject('IUserBlocksRepository')
    private readonly repository: IUserBlocksRepository,
  ) {}

  async execute(uidStr: string): Promise<BlockedUserResponseDto[]> {
    const uid = Uid.create(uidStr);
    const blockedUsers = await this.repository.findBlockedUsersWithInfo(uid);

    return blockedUsers.map((user) => this.factory.createResponse(user));
  }
}
