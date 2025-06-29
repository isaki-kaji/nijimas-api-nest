import { UserBlocksFactory } from './user-blocks.factory';
import { BlockUserDto } from '../dto/request/block-user.dto';
import { UserBlock } from '../../domain/models/user-block';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { BlockedUserWithInfo } from '../../domain/models/blocked-user-with-info';
import { ImageUrl } from 'modules/common/domain/value-objects/image-url';
import { genUid } from 'testing/utils/common-test-util';

describe('UserBlocksFactory', () => {
  let factory: UserBlocksFactory;

  beforeEach(() => {
    factory = new UserBlocksFactory();
  });

  describe('createModel', () => {
    it('should create a UserBlock model', () => {
      // Arrange
      const blockerUid = genUid();
      const blockedUid = genUid();
      const dto: BlockUserDto = { blockedUid };

      // Act
      const result = factory.createModel(blockerUid, dto);

      // Assert
      expect(result).toBeInstanceOf(UserBlock);
      expect(result.blockerUid.value).toBe(blockerUid);
      expect(result.blockedUid.value).toBe(blockedUid);
    });
  });

  describe('createResponse', () => {
    it('should create a BlockedUserResponseDto with profile image', () => {
      // Arrange
      const blockerUid = genUid();
      const blockedUid = genUid();
      const blockerUidObj = Uid.create(blockerUid);
      const blockedUidObj = Uid.create(blockedUid);
      const username = 'Test User';
      const profileImageUrl = ImageUrl.create('https://example.com/image.jpg');
      const blockedUser = new BlockedUserWithInfo(
        blockerUidObj,
        blockedUidObj,
        username,
        profileImageUrl,
      );

      // Act
      const result = factory.createResponse(blockedUser);

      // Assert
      expect(result).toEqual({
        blockedUid: blockedUidObj.value,
        username,
        profileImageUrl: profileImageUrl.value,
      });
    });

    it('should create a BlockedUserResponseDto without profile image', () => {
      // Arrange
      const blockerUid = genUid();
      const blockedUid = genUid();
      const blockerUidObj = Uid.create(blockerUid);
      const blockedUidObj = Uid.create(blockedUid);
      const username = 'Test User';
      const blockedUser = new BlockedUserWithInfo(
        blockerUidObj,
        blockedUidObj,
        username,
      );

      // Act
      const result = factory.createResponse(blockedUser);

      // Assert
      expect(result).toEqual({
        blockedUid: blockedUidObj.value,
        username,
        profileImageUrl: undefined,
      });
    });
  });
});
