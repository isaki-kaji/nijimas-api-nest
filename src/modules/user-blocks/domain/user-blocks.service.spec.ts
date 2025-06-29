import { Test, TestingModule } from '@nestjs/testing';
import { UserBlocksService } from './user-blocks.service';
import { mock, MockProxy } from 'jest-mock-extended';
import { IUserBlocksRepository } from './i.user-blocks.repository';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { genUid } from 'testing/utils/common-test-util';

describe('UserBlocksService', () => {
  let service: UserBlocksService;
  let userBlocksRepository: MockProxy<IUserBlocksRepository>;

  beforeEach(async () => {
    userBlocksRepository = mock<IUserBlocksRepository>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserBlocksService,
        {
          provide: 'IUserBlocksRepository',
          useValue: userBlocksRepository,
        },
      ],
    }).compile();

    service = module.get<UserBlocksService>(UserBlocksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('exists', () => {
    it('should return true if a block exists', async () => {
      // Arrange
      const blockerUidValue = genUid();
      const blockedUidValue = genUid();
      console.log(
        `Generated UIDs: ${blockerUidValue} (${blockerUidValue.length}), ${blockedUidValue} (${blockedUidValue.length})`,
      );
      const blockerUid = Uid.create(blockerUidValue);
      const blockedUid = Uid.create(blockedUidValue);
      userBlocksRepository.exists.mockResolvedValueOnce(true);

      // Act
      const result = await service.exists(blockerUid, blockedUid);

      // Assert
      expect(result).toBe(true);
      expect(userBlocksRepository.exists).toHaveBeenCalledWith(
        blockerUid,
        blockedUid,
      );
    });

    it('should return false if a block does not exist', async () => {
      // Arrange
      const blockerUid = Uid.create(genUid());
      const blockedUid = Uid.create(genUid());
      userBlocksRepository.exists.mockResolvedValueOnce(false);

      // Act
      const result = await service.exists(blockerUid, blockedUid);

      // Assert
      expect(result).toBe(false);
      expect(userBlocksRepository.exists).toHaveBeenCalledWith(
        blockerUid,
        blockedUid,
      );
    });
  });
});
