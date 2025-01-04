import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UsersRepository } from '../infrastructure/users.repository';
import { UsersDomainService } from '../domain/users.domain.service';
import { UserFactory } from '../domain/factory/user.factory';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { IUsersRepository } from 'users/domain/i.users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly domainService: UsersDomainService,
    private readonly factory: UserFactory,
    @Inject('IUsersRepository')
    private readonly repository: IUsersRepository,
  ) {}

  async create(dto: CreateUserDto) {
    const user = this.factory.create(dto);
    if (this.domainService.exists(user)) {
      throw new ConflictException('User already exists');
    }

    await this.repository.create(user);
  }

  async findByUid(uidStr: string) {
    const uid = new Uid(uidStr);
    const user = await this.repository.findByUid(uid);
    if (!this.domainService.exists(user)) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
