import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(user: UserEntity) {
    await this.userRepository.save(user);
  }

  async findByUid(uid: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { uid } });
  }
}
