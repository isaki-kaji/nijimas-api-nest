import { Uid } from 'modules/common/domain/value-objects/uid';
import { User } from './models/user';

export interface IUsersRepository {
  create(user: User): Promise<void>;
  update(user: User): Promise<void>;
  findByUid(uid: Uid): Promise<User | null>;
}
