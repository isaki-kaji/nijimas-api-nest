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
import { Uid } from 'modules/common/domain/value-objects/uid';

@Injectable()
export class UsersUsecase {
  constructor(
    private readonly service: UsersService,
    private readonly factory: UsersFactory,
    @Inject('IUsersRepository')
    private readonly repository: IUsersRepository,
  ) {}

  async create(dto: CreateUserDto) {
    const user = this.factory.createModelFromCreateDto(dto);
    if (await this.service.exists(user.getUid())) {
      throw new ConflictException('User already exists');
    }

    await this.repository.save(user);
  }

  async update(dto: UpdateUserDto) {
    const user = this.factory.createModelFromUpdateDto(dto);
    if (!(await this.service.exists(user.getUid()))) {
      throw new NotFoundException('User not found');
    }

    await this.repository.save(user);
  }

  async getOwnUser(uid: string) {
    const user = await this.repository.findByUid(Uid.create(uid));
    console.log('user', user);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.factory.createResponse(user);
  }
}
