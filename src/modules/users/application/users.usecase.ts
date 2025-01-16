import {
  Inject,
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UsersService } from '../domain/users.service';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { IUsersRepository } from 'users/domain/i.users.repository';
import { UsersFactory } from './factory/users.factory';

@Injectable()
export class UsersUsecase {
  constructor(
    private readonly service: UsersService,
    private readonly factory: UsersFactory,
    @Inject('IUsersRepository')
    private readonly repository: IUsersRepository,
  ) {}

  async create(dto: CreateUserDto) {
    const user = this.factory.create(dto);
    if (await this.service.exists(user)) {
      throw new ConflictException('User already exists');
    }

    await this.repository.create(user);
  }

  async findByUid(uidStr: string) {
    const uid = Uid.create(uidStr);
    const user = await this.repository.findByUid(uid);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.factory.createResponse(user);
  }
}
