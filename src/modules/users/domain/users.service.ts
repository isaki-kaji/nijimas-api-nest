import { Inject, Injectable } from '@nestjs/common';
import { IUsersRepository } from './i.users.repository';
import { User } from './models/user';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUsersRepository')
    private readonly repository: IUsersRepository,
  ) {}

  async exists(user: User): Promise<boolean> {
    const foundUser = await this.repository.findByUid(user.uid);
    return !!foundUser;
  }
}
