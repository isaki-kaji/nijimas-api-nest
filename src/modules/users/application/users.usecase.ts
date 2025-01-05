import {
  Inject,
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UsersDomainService } from '../domain/users.service';
import { UserFactory } from '../domain/factory/user.factory';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { IUsersRepository } from 'users/domain/i.users.repository';

@Injectable()
export class UsersUsecase {
  constructor(
    private readonly domainService: UsersDomainService,
    private readonly factory: UserFactory,
    @Inject('IUsersRepository')
    private readonly repository: IUsersRepository,
  ) {}

  async create(dto: CreateUserDto) {
    const user = this.factory.create(dto);
    if (await this.domainService.exists(user)) {
      // TODO: なぜかFilterにキャッチされない
      throw new ConflictException('User already exists');
    }

    await this.repository.create(user);
  }

  async findByUid(uidStr: string) {
    const uid = new Uid(uidStr);
    const user = await this.repository.findByUid(uid);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.factory.createResponse(user);
  }
}
