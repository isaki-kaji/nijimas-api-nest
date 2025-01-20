import { Inject, Injectable } from '@nestjs/common';
import { IUsersRepository } from './i.users.repository';
import { User } from './models/user';
import { Uid } from 'modules/common/domain/value-objects/uid';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUsersRepository')
    private readonly repository: IUsersRepository,
  ) {}

  async exists(uid: Uid): Promise<boolean> {
    const foundUser = await this.repository.findByUid(uid);
    return !!foundUser;
  }
}
