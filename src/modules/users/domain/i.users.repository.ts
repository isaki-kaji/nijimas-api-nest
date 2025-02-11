import { Uid } from 'modules/common/domain/value-objects/uid';
import { User } from './models/user';

export interface IUsersRepository {
  save(user: User): Promise<void>;
  findByUid(uid: Uid): Promise<User | null>;
}
