import { Test, TestingModule } from '@nestjs/testing';
import { DeleteUserUseCase } from './delete-user.usecase';
import { DataSource, EntityManager } from 'typeorm';
import { UserEntity } from '../../../entities/user.entity';
import { PostEntity } from '../../../entities/post.entity';
import { FollowEntity } from '../../../entities/follow.entity';
import { FollowRequestEntity } from '../../../entities/follow-request.entity';
import { UserBlockEntity } from '../../../entities/user-block.entity';
import { FavoriteEntity } from '../../../entities/favorite.entity';
import { NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker/.';

describe('DeleteUserUseCase', () => {
  let usecase: DeleteUserUseCase;
  let dataSource: jest.Mocked<DataSource>;
  let entityManager: jest.Mocked<EntityManager>;

  beforeEach(async () => {
    entityManager = {
      findOne: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    } as any;

    dataSource = {
      transaction: jest.fn().mockImplementation(async (fn: any) => {
        return await fn(entityManager);
      }),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserUseCase,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    usecase = module.get<DeleteUserUseCase>(DeleteUserUseCase);
  });

  describe('execute', () => {
    const userId = faker.string.alphanumeric(28);

    describe('when user exists', () => {
      beforeEach(() => {
        const user = {} as UserEntity;
        entityManager.findOne.mockResolvedValue(user);
      });

      it('should delete user and related data', async () => {
        await usecase.execute(userId);

        // ユーザーの存在確認
        expect(entityManager.findOne).toHaveBeenCalledWith(UserEntity, {
          where: { uid: userId },
        });

        // 物理削除の確認
        expect(entityManager.delete).toHaveBeenCalledWith(FollowEntity, [
          { uid: userId },
          { followingUid: userId },
        ]);
        expect(entityManager.delete).toHaveBeenCalledWith(FollowRequestEntity, [
          { uid: userId },
          { followingUid: userId },
        ]);
        expect(entityManager.delete).toHaveBeenCalledWith(UserBlockEntity, [
          { blockerUid: userId },
          { blockedUid: userId },
        ]);
        expect(entityManager.delete).toHaveBeenCalledWith(FavoriteEntity, {
          uid: userId,
        });

        // 投稿の論理削除の確認
        expect(entityManager.update).toHaveBeenCalledWith(
          PostEntity,
          { uid: userId, deletedAt: expect.anything() },
          { deletedAt: expect.any(Date) },
        );

        // ユーザーの物理削除の確認
        expect(entityManager.delete).toHaveBeenCalledWith(UserEntity, {
          uid: userId,
        });
      });
    });

    describe('when user does not exist', () => {
      beforeEach(() => {
        entityManager.findOne.mockResolvedValue(null);
      });

      it('should throw NotFoundException', async () => {
        await expect(usecase.execute(userId)).rejects.toThrow(
          NotFoundException,
        );
        await expect(usecase.execute(userId)).rejects.toThrow(
          'User not found or already deleted',
        );
      });
    });
  });
});
