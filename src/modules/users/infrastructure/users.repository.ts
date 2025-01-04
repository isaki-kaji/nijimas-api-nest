import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(user: User) {
    await this.userRepository.save(user);
  }

  async findByUid(uid: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { uid } });
  }
}
