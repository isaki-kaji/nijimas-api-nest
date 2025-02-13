import { UsersFactory } from './users.factory';
import { User } from 'users/domain/models/user';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { genCreateDto, genExistsUser, genUpdateDto } from 'testing/utils/users-test-utils';

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
      const user = genExistsUser(true);

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
      const user = genExistsUser(false);

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

