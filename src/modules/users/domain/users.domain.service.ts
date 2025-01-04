import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';

@Injectable()
export class UsersDomainService {
  constructor(private readonly repository: UsersRepository) {}

  async exists(uid: string): Promise<boolean> {
    const user = await this.repository.findByUid(uid);
    return !!user;
  }
}
