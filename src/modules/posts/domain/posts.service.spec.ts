import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { IPostsRepository } from './i.posts.repository';
import { Uuid } from 'modules/common/domain/value-objects/uuid';
import { mock } from 'jest-mock-extended';
import { genUUID } from 'testing/utils/common-test-util';

describe('PostsService', () => {
  let service: PostsService;
  const postsRepository = mock<IPostsRepository>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: 'IPostsRepository',
          useValue: postsRepository,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('exists', () => {
    it('should return true if post exists', async () => {
      const postId = Uuid.create(genUUID());
      postsRepository.findById.mockResolvedValueOnce({} as any);

      const result = await service.exists(postId);

      expect(postsRepository.findById).toHaveBeenCalledWith(postId);
      expect(result).toBe(true);
    });

    it('should return false if post does not exist', async () => {
      const postId = Uuid.create(genUUID());
      postsRepository.findById.mockResolvedValueOnce(null);

      const result = await service.exists(postId);

      expect(postsRepository.findById).toHaveBeenCalledWith(postId);
      expect(result).toBe(false);
    });
  });
});
