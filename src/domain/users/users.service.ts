import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UsersRepository } from './users.repository';
import { mapCreateDtoToEntity, mapEntityToResponseDto } from './utils/mapper';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async create(dto: CreateUserDto) {
    const user = await this.repository.findByUid(dto.uid);
    if (user) {
      throw new ConflictException('User already exists');
    }

    const newUser = mapCreateDtoToEntity(dto);
    return this.repository.create(newUser);
  }

  async findByUid(uid: string) {
    const user = await this.repository.findByUid(uid);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return mapEntityToResponseDto(user);
  }
}
