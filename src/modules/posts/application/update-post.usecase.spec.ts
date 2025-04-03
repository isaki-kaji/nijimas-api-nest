import { Test, TestingModule } from '@nestjs/testing';
import { UpdatePostUsecase } from './update-post.usecase';
import { DataSource, QueryRunner } from 'typeorm';
import { PostsFactory } from './factory/posts.factory';
import { PostSubCategoryHelper } from './helper/post-subcategory.helper';
import { IPostsRepository } from 'posts/domain/i.posts.repository';
import { UpdatePostDto } from './dto/request/update-post.dto';
import { Post } from 'posts/domain/models/post';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { mock } from 'jest-mock-extended';
import { IPostSubCategoriesRepository } from 'posts/domain/i.post-sub-category.repository';
import {
  assertTransactionRollback,
  assertTransactionSuccess,
  genUUID,
} from 'testing/utils/common-test-util';

describe('UpdatePostUsecase', () => {
  let usecase: UpdatePostUsecase;
  const dataSource = mock<DataSource>();
  const postsFactory = mock<PostsFactory>();
  const helper = mock<PostSubCategoryHelper>();
  const postsRepository = mock<IPostsRepository>();
  const postSubCategoriesRepository = mock<IPostSubCategoriesRepository>();
  const queryRunner = mock<QueryRunner>();

  beforeEach(async () => {
    dataSource.createQueryRunner.mockReturnValue(queryRunner);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdatePostUsecase,
        { provide: DataSource, useValue: dataSource },
        { provide: PostsFactory, useValue: postsFactory },
        { provide: PostSubCategoryHelper, useValue: helper },
        { provide: 'IPostsRepository', useValue: postsRepository },
        {
          provide: 'IPostSubCategoriesRepository',
          useValue: postSubCategoriesRepository,
        },
      ],
    }).compile();

    usecase = module.get<UpdatePostUsecase>(UpdatePostUsecase);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  describe('execute', () => {
    const postId = genUUID();
    const dto = mock<UpdatePostDto>();
    const post = mock<Post>();
    const foundPost = mock<Post>();

    beforeEach(() => {
      postsFactory.createModelFromUpdateDto.mockReturnValue(post);
      postsRepository.findById.mockResolvedValue(foundPost);
      post.isOwnedBy.mockReturnValue(true);
    });

    it('should update a post and commit transaction', async () => {
      await usecase.execute(dto, postId);

      expect(postsFactory.createModelFromUpdateDto).toHaveBeenCalledWith(
        dto,
        postId,
      );
      expect(postsRepository.findById).toHaveBeenCalledWith(post.postId);
      expect(post.isOwnedBy).toHaveBeenCalledWith(foundPost.uid);
      expect(postsRepository.save).toHaveBeenCalledWith(
        post,
        queryRunner.manager,
      );
      expect(postSubCategoriesRepository.deleteByPostId).toHaveBeenCalledWith(
        post.postId,
        queryRunner.manager,
      );
      expect(helper.handleSubCategories).toHaveBeenCalledWith(
        dto.subCategories,
        post.postId,
        queryRunner.manager,
      );
      assertTransactionSuccess(queryRunner);
    });

    it('should throw NotFoundException if post does not exist', async () => {
      postsRepository.findById.mockResolvedValueOnce(undefined);

      await expect(usecase.execute(dto, postId)).rejects.toThrow(
        NotFoundException,
      );

      expect(postsRepository.findById).toHaveBeenCalledWith(post.postId);
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).not.toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('should throw BadRequestException if user is not the owner', async () => {
      post.isOwnedBy.mockReturnValueOnce(false);

      await expect(usecase.execute(dto, postId)).rejects.toThrow(
        BadRequestException,
      );

      expect(post.isOwnedBy).toHaveBeenCalledWith(foundPost.uid);
      assertTransactionRollback(queryRunner);
    });

    it('should rollback transaction and throw error if an error occurs', async () => {
      const error = new Error('Test error');
      postsRepository.save.mockRejectedValueOnce(error);

      await expect(usecase.execute(dto, postId)).rejects.toThrow(error);

      assertTransactionRollback(queryRunner);
    });
  });
});
