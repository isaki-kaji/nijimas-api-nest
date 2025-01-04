import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UsersRepository } from '../infrastructure/users.repository';
import { UsersDomainService } from '../domain/users.domain.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly domainService: UsersDomainService,
    private readonly repository: UsersRepository,
  ) {}

  async create(dto: CreateUserDto) {
    if (this.domainService.exists(dto.uid)) {
      throw new ConflictException('User already exists');
    }

    const newUser = mapCreateDtoToEntity(dto);
    await this.repository.create(newUser);
  }

  async findByUid(uid: string) {
    if (!this.domainService.exists(uid)) {
      throw new NotFoundException('User not found');
    }
    return mapEntityToResponseDto(user);
  }
}
