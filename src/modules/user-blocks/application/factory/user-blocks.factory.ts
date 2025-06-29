import { Injectable } from '@nestjs/common';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { BlockUserDto } from '../dto/request/block-user.dto';
import { UserBlock } from '../../domain/models/user-block';
import { BlockedUserWithInfo } from '../../domain/models/blocked-user-with-info';
import { BlockedUserResponseDto } from '../dto/response/blocked-user.response.dto';

@Injectable()
export class UserBlocksFactory {
  createModel(blockerUid: string, dto: BlockUserDto): UserBlock {
    const blockerUidObj = Uid.create(blockerUid);
    const blockedUidObj = Uid.create(dto.blockedUid);
    return new UserBlock(blockerUidObj, blockedUidObj);
  }

  createResponse(blockedUser: BlockedUserWithInfo): BlockedUserResponseDto {
    return {
      blockedUid: blockedUser.blockedUid.value,
      username: blockedUser.username,
      profileImageUrl: blockedUser.profileImageUrl?.value,
    };
  }
}
