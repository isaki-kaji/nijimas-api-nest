import { Test, TestingModule } from '@nestjs/testing';
import { UnblockUserUseCase } from './unblock-user.usecase';
import { IUserBlocksRepository } from '../domain/i.user-blocks.repository';
import { mock, MockProxy } from 'jest-mock-extended';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { UserBlocksService } from '../domain/user-blocks.service';
import { NotFoundException } from '@nestjs/common';
import { genUid } from 'testing/utils/common-test-util';

describe('UnblockUserUseCase', () => {
  let useCase: UnblockUserUseCase;
  let userBlocksRepository: MockProxy<IUserBlocksRepository>;
  let userBlocksService: MockProxy<UserBlocksService>;

  beforeEach(async () => {
    userBlocksRepository = mock<IUserBlocksRepository>();
    userBlocksService = mock<UserBlocksService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnblockUserUseCase,
        {
          provide: 'IUserBlocksRepository',
          useValue: userBlocksRepository,
        },
        {
          provide: UserBlocksService,
          useValue: userBlocksService,
        },
      ],
    }).compile();

    useCase = module.get<UnblockUserUseCase>(UnblockUserUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should delete a block when it exists', async () => {
      // Arrange
      const blockerUid = genUid();
      const blockedUid = genUid();
      const blockerUidObj = Uid.create(blockerUid);
      const blockedUidObj = Uid.create(blockedUid);

      userBlocksService.exists.mockResolvedValueOnce(true);

      // Act
      await useCase.execute(blockerUid, blockedUid);

      // Assert
      expect(userBlocksService.exists).toHaveBeenCalledWith(
        blockerUidObj,
        blockedUidObj,
      );
      expect(userBlocksRepository.delete).toHaveBeenCalledWith(
        blockerUidObj,
        blockedUidObj,
      );
    });

    it('should throw NotFoundException when block does not exist', async () => {
      // Arrange
      const blockerUid = genUid();
      const blockedUid = genUid();
      const blockerUidObj = Uid.create(blockerUid);
      const blockedUidObj = Uid.create(blockedUid);

      userBlocksService.exists.mockResolvedValueOnce(false);

      // Act & Assert
      await expect(useCase.execute(blockerUid, blockedUid)).rejects.toThrow(
        NotFoundException,
      );
      expect(userBlocksService.exists).toHaveBeenCalledWith(
        blockerUidObj,
        blockedUidObj,
      );
      expect(userBlocksRepository.delete).not.toHaveBeenCalled();
    });
  });
});
