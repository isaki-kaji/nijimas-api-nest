import { UsersFactory } from './users.factory';
import { CreateUserDto } from '../dto/request/create-user.dto';
import { UpdateUserDto } from '../dto/request/update-user.dto';
import { User } from 'users/domain/models/user';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { ImageUrl } from 'modules/common/domain/value-objects/image-url';
import { mock } from 'jest-mock-extended';
import { faker } from '@faker-js/faker/.';

describe('UsersFactory', () => {
  let factory: UsersFactory;

  beforeEach(() => {
    factory = new UsersFactory();
  });

  describe('createModelFromCreateDto', () => {
    it('should create a User model from CreateUserDto', () => {
      const dto = genCreateDto();
      const user = factory.createModelFromCreateDto(dto);

      expect(user).toBeInstanceOf(User);
      expect(user.getUid()).toEqual(Uid.create(dto.uid));
      expect(user.getUsername()).toBe(dto.username);
      expect(user.getVersion()).toBe(1);
      expect(user.getSelfIntro()).toBe(dto.selfIntro);
      expect(user.getProfileImageUrl()?.getValue()).toBe(dto.profileImageUrl);
    });

    it('should create a User model with null profileImageUrl if not provided', () => {
      const dto = genCreateDto();
      const user = factory.createModelFromCreateDto(dto);

      expect(user.getProfileImageUrl()).toBeNull();
    });
  });

  describe('createModelFromUpdateDto', () => {
    it('should create a User model from UpdateUserDto', () => {
      const dto = genUpdateDto();
      const user = factory.createModelFromUpdateDto(dto);

      expect(user).toBeInstanceOf(User);
      expect(user.getUid()).toEqual(Uid.create(dto.uid));
      expect(user.getUsername()).toBe(dto.username);
      expect(user.getVersion()).toBe(dto.version);
      expect(user.getSelfIntro()).toBe(dto.selfIntro);
      expect(user.getProfileImageUrl()?.getValue()).toBe(dto.profileImageUrl);
    });

    it('should create a User model with null profileImageUrl if not provided', () => {
      const dto = genUpdateDto();
      const user = factory.createModelFromUpdateDto(dto);

      expect(user.getProfileImageUrl()).toBeNull();
    });
  });

  describe('createResponse', () => {
    it('should create a response object from a User model', () => {
      const user = genUser(true);

      const response = factory.createResponse(user);

      expect(response).toEqual({
        uid: user.getUid().getValue(),
        username: user.getUsername(),
        version: user.getVersion(),
        selfIntro: user.getSelfIntro(),
        profileImageUrl: user.getProfileImageUrl()?.getValue(),
        countryCode: null,
      });
    });

    it('should create a response object with null values if properties are null', () => {
      const user = genUser(false);

      const response = factory.createResponse(user);

      expect(response).toEqual({
        uid: user.getUid().getValue(),
        username: user.getUsername(),
        version: user.getVersion(),
        selfIntro: user.getSelfIntro(),
        profileImageUrl: null,
        countryCode: null,
      });
    });
  });
});

const genCreateDto = (): CreateUserDto => ({
    uid: faker.string.alphanumeric(28),
    username: faker.person.firstName(),
});

const genUpdateDto = (): UpdateUserDto => ({
    uid: faker.string.alphanumeric(28),
    username: faker.person.firstName(),
    selfIntro: faker.lorem.sentence(),
    version: 3,
});

const genUser = (hasProfileImage: boolean): User =>{
    return new User(
      Uid.create(faker.string.alphanumeric(28)),
      faker.person.firstName(),
      3,
      faker.lorem.sentence(),
      hasProfileImage ? ImageUrl.create(faker.internet.url()) : null,
      null,
    )
}
