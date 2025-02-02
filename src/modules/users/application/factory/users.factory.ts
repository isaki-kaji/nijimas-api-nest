import { CreateUserDto } from 'modules/users/application/dto/request/create-user.dto';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { Injectable } from '@nestjs/common';
import { User } from 'users/domain/models/user';
import { UpdateUserDto } from '../dto/request/update-user.dto';
import { ImageUrl } from 'modules/common/domain/value-objects/image-url';

@Injectable()
export class UsersFactory {
  create(dto: CreateUserDto | UpdateUserDto): User {
    const uid = Uid.create(dto.uid);
    const username = dto.username;
    const profileImageUrl = dto.profileImageUrl
      ? ImageUrl.create(dto.profileImageUrl)
      : null;
    return new User(uid, username, dto.selfIntro, profileImageUrl);
  }
}
