import { CreateUserDto } from 'modules/users/application/dto/request/create-user.dto';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { Injectable } from '@nestjs/common';
import { User } from 'users/domain/models/user';
import { UpdateUserDto } from '../dto/request/update-user.dto';
import { ImageUrl } from 'modules/common/domain/value-objects/image-url';

@Injectable()
export class UsersFactory {
  createModelFromCreateDto(dto: CreateUserDto): User {
    const uid = Uid.create(dto.uid);
    const username = dto.username;
    const profileImageUrl = dto.profileImageUrl
      ? ImageUrl.create(dto.profileImageUrl)
      : undefined;
    return new User(uid, username, 1, dto.selfIntro, profileImageUrl);
  }

  createModelFromUpdateDto(dto: UpdateUserDto): User {
    const uid = Uid.create(dto.uid);
    const username = dto.username;
    const profileImageUrl = dto.profileImageUrl
      ? ImageUrl.create(dto.profileImageUrl)
      : undefined;
    return new User(
      uid,
      username!,
      dto.version,
      dto.selfIntro,
      profileImageUrl,
    );
  }

  createResponse(user: User) {
    return {
      uid: user.getUid().value,
      username: user.getUsername(),
      version: user.getVersion(),
      selfIntro: user.getSelfIntro(),
      profileImageUrl: user.getProfileImageUrl()?.value ?? undefined,
      countryCode: user.getCountryCode()?.getValue() ?? undefined,
    };
  }
}
