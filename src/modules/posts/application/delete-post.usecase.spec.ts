import { Test, TestingModule } from '@nestjs/testing';
import { DeletePostUsecase } from './delete-post.usecase';
import { DataSource, QueryRunner } from 'typeorm';
import { IPostsRepository } from 'posts/domain/i.posts.repository';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { Uuid } from 'modules/common/domain/value-objects/uuid';
import { Post } from 'posts/domain/models/post';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { mock } from 'jest-mock-extended';
import { IPostSubCategoriesRepository } from 'posts/domain/i.post-sub-category.repository';
import {
  assertTransactionRollback,
  assertTransactionSuccess,
  genUid,
  genUUID,
} from 'testing/utils/common-test-util';

describe('DeletePostUsecase', () => {
  let usecase: DeletePostUsecase;
  const dataSource = mock<DataSource>();
  const postsRepository = mock<IPostsRepository>();
  const postSubCategoriesRepository = mock<IPostSubCategoriesRepository>();
  const queryRunner = mock<QueryRunner>();

  beforeEach(async () => {
    dataSource.createQueryRunner.mockReturnValue(queryRunner);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeletePostUsecase,
        { provide: DataSource, useValue: dataSource },
        { provide: 'IPostsRepository', useValue: postsRepository },
        {
          provide: 'IPostSubCategoriesRepository',
          useValue: postSubCategoriesRepository,
        },
      ],
    }).compile();

    usecase = module.get<DeletePostUsecase>(DeletePostUsecase);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  describe('execute', () => {
    const uidStr = genUid();
    const postIdStr = genUUID();
    const uid = Uid.create(uidStr);
    const postId = Uuid.create(postIdStr);
    const foundPost = mock<Post>();

    beforeEach(() => {
      postsRepository.findById.mockResolvedValue(foundPost);
      foundPost.isOwnedBy.mockReturnValue(true);
    });

    it('should delete a post and commit transaction', async () => {
      await usecase.execute(uidStr, postIdStr);

      expect(postsRepository.findById).toHaveBeenCalledWith(postId);
      expect(foundPost.isOwnedBy).toHaveBeenCalledWith(uid);
      expect(postSubCategoriesRepository.deleteByPostId).toHaveBeenCalledWith(
        postId,
        queryRunner.manager,
      );
      expect(postsRepository.delete).toHaveBeenCalledWith(
        postId,
        queryRunner.manager,
      );
      assertTransactionSuccess(queryRunner);
    });

    it('should throw NotFoundException if post does not exist', async () => {
      postsRepository.findById.mockResolvedValueOnce(undefined);

      await expect(usecase.execute(uidStr, postIdStr)).rejects.toThrow(
        NotFoundException,
      );

      expect(postsRepository.findById).toHaveBeenCalledWith(postId);
      assertTransactionRollback(queryRunner);
    });

    it('should throw BadRequestException if user is not the owner', async () => {
      foundPost.isOwnedBy.mockReturnValueOnce(false);

      await expect(usecase.execute(uidStr, postIdStr)).rejects.toThrow(
        BadRequestException,
      );

      expect(foundPost.isOwnedBy).toHaveBeenCalledWith(uid);
      assertTransactionRollback(queryRunner);
    });

    it('should rollback transaction and throw error if an error occurs', async () => {
      const error = new Error('Test error');
      postsRepository.delete.mockRejectedValueOnce(error);

      await expect(usecase.execute(uidStr, postIdStr)).rejects.toThrow(error);

      assertTransactionRollback(queryRunner);
    });
  });
});
