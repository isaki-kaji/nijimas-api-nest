import { Inject, Injectable } from '@nestjs/common';
import { IUsersRepository } from './i.users.repository';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { User } from './user';

@Injectable()
export class UsersDomainService {
  constructor(
    @Inject('IUsersRepository')
    private readonly repository: IUsersRepository,
  ) {}

  async exists(user: User): Promise<boolean> {
    const foundUser = await this.repository.findByUid(user.uid);
    return !!foundUser;
  }
}
