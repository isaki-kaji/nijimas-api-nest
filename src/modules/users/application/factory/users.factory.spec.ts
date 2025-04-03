import { UsersFactory } from './users.factory';
import { User } from 'users/domain/models/user';
import { Uid } from 'modules/common/domain/value-objects/uid';
import {
  genCreateDto,
  genExistsUser,
  genUpdateDto,
} from 'testing/utils/users-test-utils';

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
      expect(user.uid).toEqual(Uid.create(dto.uid));
      expect(user.username).toBe(dto.username);
      expect(user.version).toBe(1);
      expect(user.selfIntro).toBe(dto.selfIntro);
      expect(user.profileImageUrl?.value).toBe(dto.profileImageUrl);
    });

    it('should create a User model with null profileImageUrl if not provided', () => {
      const dto = genCreateDto();
      const user = factory.createModelFromCreateDto(dto);

      expect(user.profileImageUrl).toBeUndefined();
    });
  });

  describe('createModelFromUpdateDto', () => {
    it('should create a User model from UpdateUserDto', () => {
      const dto = genUpdateDto();
      const user = factory.createModelFromUpdateDto(dto);

      expect(user).toBeInstanceOf(User);
      expect(user.uid).toEqual(Uid.create(dto.uid));
      expect(user.username).toBe(dto.username);
      expect(user.version).toBe(dto.version);
      expect(user.selfIntro).toBe(dto.selfIntro);
      expect(user.profileImageUrl?.value).toBe(dto.profileImageUrl);
    });

    it('should create a User model with null profileImageUrl if not provided', () => {
      const dto = genUpdateDto();
      const user = factory.createModelFromUpdateDto(dto);

      expect(user.profileImageUrl).toBeUndefined();
    });
  });

  describe('createResponse', () => {
    it('should create a response object from a User model', () => {
      const user = genExistsUser(true);

      const response = factory.createResponse(user);

      expect(response).toEqual({
        uid: user.uid.value,
        username: user.username,
        version: user.version,
        selfIntro: user.selfIntro,
        profileImageUrl: user.profileImageUrl?.value,
        countryCode: undefined,
      });
    });

    it('should create a response object with null values if properties are null', () => {
      const user = genExistsUser(false);

      const response = factory.createResponse(user);

      expect(response).toEqual({
        uid: user.uid.value,
        username: user.username,
        version: user.version,
        selfIntro: user.selfIntro,
        profileImageUrl: undefined,
        countryCode: undefined,
      });
    });
  });
});
