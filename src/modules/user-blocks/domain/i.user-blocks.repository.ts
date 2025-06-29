import { Uid } from 'modules/common/domain/value-objects/uid';
import { BlockedUserWithInfo } from './models/blocked-user-with-info';
import { UserBlock } from './models/user-block';

export interface IUserBlocksRepository {
  create(userBlock: UserBlock): Promise<void>;
  delete(blockerUid: Uid, blockedUid: Uid): Promise<void>;
  findBlockedUsers(uid: Uid): Promise<UserBlock[]>;
  findBlockedUsersWithInfo(uid: Uid): Promise<BlockedUserWithInfo[]>;
  exists(blockerUid: Uid, blockedUid: Uid): Promise<boolean>;
}
