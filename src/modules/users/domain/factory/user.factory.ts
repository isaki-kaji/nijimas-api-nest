import { CreateUserDto } from 'modules/users/application/dto/request/create-user.dto';
import { User } from '../models/user';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { Injectable } from '@nestjs/common';
import { UserResponseDto } from 'users/application/dto/response/user.response.dto';

@Injectable()
export class UserFactory {
  create(dto: CreateUserDto): User {
    const uid = new Uid(dto.uid);
    const username = dto.username;
    return new User(uid, username);
  }

  createResponse(user: User): UserResponseDto {
    return new UserResponseDto(user);
  }
}
