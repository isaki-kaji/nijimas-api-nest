import { faker } from '@faker-js/faker/.';
import { ImageUrl } from 'modules/common/domain/value-objects/image-url';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { CreateUserDto } from 'users/application/dto/request/create-user.dto';
import { UpdateUserDto } from 'users/application/dto/request/update-user.dto';
import { User } from 'users/domain/models/user';
import { genUid } from './common-test-util';

export const genCreateDto = (uid: string = genUid()): CreateUserDto => ({
  uid,
  username: faker.person.firstName(),
});

export const genUpdateDto = (uid: string = genUid()): UpdateUserDto => ({
  uid,
  username: faker.person.firstName(),
  selfIntro: faker.lorem.sentence(),
  version: faker.number.int(),
});

export const genCreatedUser = (dto: UpdateUserDto): User => {
  return new User(
    Uid.create(dto.uid),
    dto.username,
    dto.version,
    dto.selfIntro,
  );
};

export const genExistsUser = (hasProfileImage: boolean): User => {
  return new User(
    Uid.create(faker.string.alphanumeric(28)),
    faker.person.firstName(),
    3,
    faker.lorem.sentence(),
    hasProfileImage ? ImageUrl.create(faker.internet.url()) : null,
    null,
  );
};
