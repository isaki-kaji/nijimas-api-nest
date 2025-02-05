import {
  Inject,
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UsersService } from '../domain/users.service';
import { IUsersRepository } from 'users/domain/i.users.repository';
import { UsersFactory } from './factory/users.factory';
import { UpdateUserDto } from './dto/request/update-user.dto';

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
    if (await this.service.exists(user.getUid())) {
      throw new ConflictException('User already exists');
    }

    await this.repository.create(user);
  }

  async update(dto: UpdateUserDto) {
    const user = this.factory.create(dto);
    if (!(await this.service.exists(user.getUid()))) {
      throw new NotFoundException('User not found');
    }

    await this.repository.update(user);
  }
}
