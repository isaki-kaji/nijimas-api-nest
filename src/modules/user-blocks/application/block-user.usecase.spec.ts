import { Test, TestingModule } from '@nestjs/testing';
import { BlockUserUseCase } from './block-user.usecase';
import { UserBlocksService } from '../domain/user-blocks.service';
import { UserBlocksFactory } from './factory/user-blocks.factory';
import { IUserBlocksRepository } from '../domain/i.user-blocks.repository';
import { mock, MockProxy } from 'jest-mock-extended';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BlockUserDto } from './dto/request/block-user.dto';
import { UserBlock } from '../domain/models/user-block';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { genUid } from 'testing/utils/common-test-util';
import { FollowsUsecase } from '../../follows/application/follows.usecase';

describe('BlockUserUseCase', () => {
  let usecase: BlockUserUseCase;
  let userBlocksService: MockProxy<UserBlocksService>;
  let userBlocksFactory: MockProxy<UserBlocksFactory>;
  let userBlocksRepository: MockProxy<IUserBlocksRepository>;
  let followsUsecase: MockProxy<FollowsUsecase>;

  beforeEach(async () => {
    userBlocksService = mock<UserBlocksService>();
    userBlocksFactory = mock<UserBlocksFactory>();
    userBlocksRepository = mock<IUserBlocksRepository>();
    followsUsecase = mock<FollowsUsecase>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlockUserUseCase,
        {
          provide: UserBlocksService,
          useValue: userBlocksService,
        },
        {
          provide: UserBlocksFactory,
          useValue: userBlocksFactory,
        },
        {
          provide: 'IUserBlocksRepository',
          useValue: userBlocksRepository,
        },
        {
          provide: FollowsUsecase,
          useValue: followsUsecase,
        },
      ],
    }).compile();

    usecase = module.get<BlockUserUseCase>(BlockUserUseCase);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  describe('execute', () => {
    it('should throw BadRequestException when trying to block yourself', async () => {
      // Arrange
      const blockerUid = 'user123456789012345678901234';
      const dto: BlockUserDto = { blockedUid: blockerUid };

      // Act & Assert
      await expect(usecase.execute(blockerUid, dto)).rejects.toThrow(
        BadRequestException,
      );
      expect(userBlocksFactory.createModel).not.toHaveBeenCalled();
      expect(userBlocksService.exists).not.toHaveBeenCalled();
      expect(userBlocksRepository.create).not.toHaveBeenCalled();
    });

    it('should create a block if it does not exist', async () => {
      // Arrange
      const blockerUid = genUid();
      const blockedUid = genUid();
      const dto: BlockUserDto = { blockedUid };
      const blockerUidObj = Uid.create(blockerUid);
      const blockedUidObj = Uid.create(blockedUid);
      const userBlock = new UserBlock(blockerUidObj, blockedUidObj);

      userBlocksFactory.createModel.mockReturnValueOnce(userBlock);
      userBlocksService.exists.mockResolvedValueOnce(false);

      // Act
      await usecase.execute(blockerUid, dto);

      // Assert
      expect(userBlocksFactory.createModel).toHaveBeenCalledWith(
        blockerUid,
        dto,
      );
      expect(userBlocksService.exists).toHaveBeenCalledWith(
        blockerUidObj,
        blockedUidObj,
      );
      expect(userBlocksRepository.create).toHaveBeenCalledWith(userBlock);
    });

    it('should not create a block if it already exists', async () => {
      // Arrange
      const blockerUid = genUid();
      const blockedUid = genUid();
      const dto: BlockUserDto = { blockedUid };
      const blockerUidObj = Uid.create(blockerUid);
      const blockedUidObj = Uid.create(blockedUid);
      const userBlock = new UserBlock(blockerUidObj, blockedUidObj);

      userBlocksFactory.createModel.mockReturnValueOnce(userBlock);
      userBlocksService.exists.mockResolvedValueOnce(true);

      // Act
      await usecase.execute(blockerUid, dto);

      // Assert
      expect(userBlocksFactory.createModel).toHaveBeenCalledWith(
        blockerUid,
        dto,
      );
      expect(userBlocksService.exists).toHaveBeenCalledWith(
        blockerUidObj,
        blockedUidObj,
      );
      expect(userBlocksRepository.create).not.toHaveBeenCalled();
    });

    it('should cancel follow relationships when blocking a user', async () => {
      // Arrange
      const blockerUid = genUid();
      const blockedUid = genUid();
      const dto: BlockUserDto = { blockedUid };
      const blockerUidObj = Uid.create(blockerUid);
      const blockedUidObj = Uid.create(blockedUid);
      const userBlock = new UserBlock(blockerUidObj, blockedUidObj);

      userBlocksFactory.createModel.mockReturnValueOnce(userBlock);
      userBlocksService.exists.mockResolvedValueOnce(false);

      // Act
      await usecase.execute(blockerUid, dto);

      // Assert
      // ユーザーブロックが作成されたことを確認
      expect(userBlocksRepository.create).toHaveBeenCalledWith(userBlock);

      // 両方向のフォロー解除が試みられたことを確認
      expect(followsUsecase.cancelFollow).toHaveBeenCalledTimes(2);
    });

    it('should continue if follow cancellation throws NotFoundException', async () => {
      // Arrange
      const blockerUid = genUid();
      const blockedUid = genUid();
      const dto: BlockUserDto = { blockedUid };
      const blockerUidObj = Uid.create(blockerUid);
      const blockedUidObj = Uid.create(blockedUid);
      const userBlock = new UserBlock(blockerUidObj, blockedUidObj);

      userBlocksFactory.createModel.mockReturnValueOnce(userBlock);
      userBlocksService.exists.mockResolvedValueOnce(false);

      // フォロー関係がなく、NotFoundExceptionがスローされる場合
      followsUsecase.cancelFollow
        .mockRejectedValueOnce(new NotFoundException('Follow not found'))
        .mockRejectedValueOnce(new NotFoundException('Follow not found'));

      // Act & Assert
      // ブロック処理は成功するべき（フォローが存在しないエラーは無視される）
      await expect(usecase.execute(blockerUid, dto)).resolves.not.toThrow();

      // ユーザーブロックが作成されたことを確認
      expect(userBlocksRepository.create).toHaveBeenCalledWith(userBlock);
    });
  });
});
