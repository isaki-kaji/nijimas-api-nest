import { CreateUserDto } from 'modules/users/application/dto/request/create-user.dto';
import { User } from '../user';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserFactory {
  create(dto: CreateUserDto): User {
    const uid = new Uid(dto.uid);
    const username = dto.username;
    return new User(uid, username);
  }
}
