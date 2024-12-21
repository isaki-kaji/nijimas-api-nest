import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  create(user: User): void {
    this.userRepository.save(user);
  }

  findByUid(uid: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { uid } });
  }
}
