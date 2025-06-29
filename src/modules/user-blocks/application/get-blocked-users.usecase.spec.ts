import { Test, TestingModule } from '@nestjs/testing';
import { GetBlockedUsersUsecase } from './get-blocked-users.usecase';
import { UserBlocksFactory } from './factory/user-blocks.factory';
import { IUserBlocksRepository } from '../domain/i.user-blocks.repository';
import { mock, MockProxy } from 'jest-mock-extended';
import { BlockedUserWithInfo } from '../domain/models/blocked-user-with-info';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { BlockedUserResponseDto } from './dto/response/blocked-user.response.dto';
import { genUid } from 'testing/utils/common-test-util';

describe('GetBlockedUsersUsecase', () => {
  let useCase: GetBlockedUsersUsecase;
  let userBlocksFactory: MockProxy<UserBlocksFactory>;
  let userBlocksRepository: MockProxy<IUserBlocksRepository>;

  beforeEach(async () => {
    userBlocksFactory = mock<UserBlocksFactory>();
    userBlocksRepository = mock<IUserBlocksRepository>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetBlockedUsersUsecase,
        {
          provide: UserBlocksFactory,
          useValue: userBlocksFactory,
        },
        {
          provide: 'IUserBlocksRepository',
          useValue: userBlocksRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetBlockedUsersUsecase>(GetBlockedUsersUsecase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return list of blocked users with info', async () => {
      // Arrange
      const uidStr = genUid();
      const uid = Uid.create(uidStr);

      const blockedUser1 = mock<BlockedUserWithInfo>();
      const blockedUser2 = mock<BlockedUserWithInfo>();
      const blockedUsers = [blockedUser1, blockedUser2];

      const blockedUserResponse1: BlockedUserResponseDto = {
        blockedUid: 'blocked1',
        username: 'User 1',
      };
      const blockedUserResponse2: BlockedUserResponseDto = {
        blockedUid: 'blocked2',
        username: 'User 2',
      };

      userBlocksRepository.findBlockedUsersWithInfo.mockResolvedValueOnce(
        blockedUsers,
      );
      userBlocksFactory.createResponse.mockReturnValueOnce(
        blockedUserResponse1,
      );
      userBlocksFactory.createResponse.mockReturnValueOnce(
        blockedUserResponse2,
      );

      // Act
      const result = await useCase.execute(uidStr);

      // Assert
      expect(
        userBlocksRepository.findBlockedUsersWithInfo,
      ).toHaveBeenCalledWith(uid);
      expect(userBlocksFactory.createResponse).toHaveBeenCalledTimes(2);
      expect(userBlocksFactory.createResponse).toHaveBeenCalledWith(
        blockedUser1,
      );
      expect(userBlocksFactory.createResponse).toHaveBeenCalledWith(
        blockedUser2,
      );
      expect(result).toEqual([blockedUserResponse1, blockedUserResponse2]);
    });

    it('should return empty array when no blocked users', async () => {
      // Arrange
      const uidStr = genUid();
      const uid = Uid.create(uidStr);

      userBlocksRepository.findBlockedUsersWithInfo.mockResolvedValueOnce([]);

      // Act
      const result = await useCase.execute(uidStr);

      // Assert
      expect(
        userBlocksRepository.findBlockedUsersWithInfo,
      ).toHaveBeenCalledWith(uid);
      expect(userBlocksFactory.createResponse).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});
