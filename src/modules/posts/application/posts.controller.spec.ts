import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { CreatePostUsecase } from './create-post.usecase';
import { UpdatePostUsecase } from './update-post.usecase';
import { DeletePostUsecase } from './delete-post.usecase';
import { IPostsQueryService } from './i.posts.query.service';
import { CreatePostDto } from './dto/request/create-post.dto';
import { UpdatePostDto } from './dto/request/update-post.dto';
import { mock } from 'jest-mock-extended';
import { genUid } from 'testing/utils/common-test-util';
import { PostResponseDto } from './dto/response/post.response.dto';
import {
  genPostsResponseForSubCategory,
  genPostsResponseForUid,
} from 'testing/utils/posts-test-util';

describe('PostsController', () => {
  let controller: PostsController;
  const createPostUsecase = mock<CreatePostUsecase>();
  const updatePostUsecase = mock<UpdatePostUsecase>();
  const deletePostUsecase = mock<DeletePostUsecase>();
  const queryService = mock<IPostsQueryService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        { provide: CreatePostUsecase, useValue: createPostUsecase },
        { provide: UpdatePostUsecase, useValue: updatePostUsecase },
        { provide: DeletePostUsecase, useValue: deletePostUsecase },
        { provide: 'IPostsQueryService', useValue: queryService },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
  });

  describe('findPosts', () => {
    const uid = genUid();

    it('should return posts by targetUid', async () => {
      const targetUid = genUid();
      const expectedPosts = genPostsResponseForUid(targetUid);
      queryService.findPostsByUid.mockResolvedValueOnce(expectedPosts);

      const result = await controller.findPosts(uid, targetUid);

      expect(queryService.findPostsByUid).toHaveBeenCalledWith(uid, targetUid);
      expect(result).toEqual(expectedPosts);
    });

    it('should return posts by sub-category', async () => {
      const categoryName = 'test-category';
      const expectedPosts = genPostsResponseForSubCategory(categoryName);
      queryService.findPostsBySubCategory.mockResolvedValueOnce(expectedPosts);

      const result = await controller.findPosts(uid, undefined, categoryName);

      expect(queryService.findPostsBySubCategory).toHaveBeenCalledWith(
        uid,
        categoryName,
      );
      expect(result).toEqual(expectedPosts);
    });

    it('should return undefined if neither targetUid nor categoryName is provided', async () => {
      const result = await controller.findPosts(uid);

      expect(result).toEqual([]);
    });
  });
});
