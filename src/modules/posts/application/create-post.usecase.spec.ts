import { Test, TestingModule } from '@nestjs/testing';
import { CreatePostUsecase } from './create-post.usecase';
import { DataSource, QueryRunner, EntityManager } from 'typeorm';

import { mock } from 'jest-mock-extended';
import { PostsFactory } from './factory/posts.factory';
import { PostSubCategoryHelper } from './helper/post-subcategory.helper';
import { IPostsRepository } from 'posts/domain/i.posts.repository';
import { CreatePostDto } from './dto/request/create-post.dto';
import { Post } from 'posts/domain/models/post';
import {
  assertTransactionFailure,
  assertTransactionSuccess,
} from 'testing/utils/common-test-util';

describe('CreatePostUsecase', () => {
  let usecase: CreatePostUsecase;
  const dataSource = mock<DataSource>();
  const postsFactory = mock<PostsFactory>();
  const helper = mock<PostSubCategoryHelper>();
  const postsRepository = mock<IPostsRepository>();
  const queryRunner = mock<QueryRunner>();
  const manager = mock<EntityManager>();

  beforeEach(async () => {
    dataSource.createQueryRunner.mockReturnValue(queryRunner);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePostUsecase,
        { provide: DataSource, useValue: dataSource },
        { provide: PostsFactory, useValue: postsFactory },
        { provide: PostSubCategoryHelper, useValue: helper },
        { provide: 'IPostsRepository', useValue: postsRepository },
      ],
    }).compile();

    usecase = module.get<CreatePostUsecase>(CreatePostUsecase);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a post and commit transaction', async () => {
      const dto = mock<CreatePostDto>();
      const post = mock<Post>();

      postsFactory.createModelFromCreateDto.mockReturnValue(post);
      postsRepository.save.mockResolvedValueOnce();
      helper.handleSubCategories.mockResolvedValueOnce();

      await usecase.execute(dto);

      expect(postsFactory.createModelFromCreateDto).toHaveBeenCalledWith(dto);
      expect(postsRepository.save).toHaveBeenCalledWith(
        post,
        queryRunner.manager,
      );
      expect(helper.handleSubCategories).toHaveBeenCalledWith(
        dto.subCategories,
        post.getPostId(),
        queryRunner.manager,
      );
      assertTransactionSuccess(queryRunner);
    });

    it('should rollback transaction and throw error if an error occurs', async () => {
      const dto = mock<CreatePostDto>();
      const post = mock<Post>();
      const error = new Error('Test error');

      postsFactory.createModelFromCreateDto.mockReturnValue(post);
      postsRepository.save.mockResolvedValueOnce();
      helper.handleSubCategories.mockRejectedValueOnce(error);

      await expect(usecase.execute(dto)).rejects.toThrow(error);

      expect(postsFactory.createModelFromCreateDto).toHaveBeenCalledWith(dto);
      expect(postsRepository.save).toHaveBeenCalledWith(
        post,
        queryRunner.manager,
      );
      assertTransactionFailure(queryRunner);
    });
  });
});
