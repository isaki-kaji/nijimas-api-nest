import { Uid } from 'modules/common/domain/value-objects/uid';
import { User } from './user';

export interface IUsersRepository {
  create(user: User): Promise<void>;
  findByUid(uid: Uid): Promise<User | null>;
}
