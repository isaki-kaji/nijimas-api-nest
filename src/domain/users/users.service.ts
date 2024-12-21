import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async create(dto: CreateUserDto) {
    const user = CreateUserDto.toEntity(dto);
    return this.repository.create(user);
  }

  async findByUid(uid: string) {
    const user = this.repository.findByUid(uid);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
