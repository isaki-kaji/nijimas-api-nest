import { CreateUserDto } from 'modules/users/application/dto/request/create-user.dto';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { Injectable } from '@nestjs/common';
import { UserResponseDto } from 'users/application/dto/response/user.response.dto';
import { User } from 'users/domain/models/user';

@Injectable()
export class UsersFactory {
  create(dto: CreateUserDto): User {
    const uid = Uid.create(dto.uid);
    const username = dto.username;
    return new User(uid, username);
  }

  createResponse(user: User): UserResponseDto {
    return new UserResponseDto(user);
  }
}
