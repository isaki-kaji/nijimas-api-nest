import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesUsecase } from './favorites.usecase';
import { FavoritesService } from '../domain/favorites.service';
import { FavoritesFactory } from './factory/favorites.factory';
import { IFavoritesRepository } from '../domain/i.favorites.repository';
import { mock } from 'jest-mock-extended';
import { NotFoundException } from '@nestjs/common';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { Uuid } from 'modules/common/domain/value-objects/uuid';
import { PostsService } from 'posts/domain/posts.service';
import { genUid, genUUID } from 'testing/utils/common-test-util';
import { ToggleFavoriteDto } from './dto/request/toggle-favorite.dto';
import { Favorite } from '../domain/models/favorite';

describe('FavoritesUsecase', () => {
  let usecase: FavoritesUsecase;
  const favoritesService = mock<FavoritesService>();
  const postService = mock<PostsService>();
  const factory = mock<FavoritesFactory>();
  const repository = mock<IFavoritesRepository>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesUsecase,
        {
          provide: FavoritesService,
          useValue: favoritesService,
        },
        {
          provide: PostsService,
          useValue: postService,
        },
        {
          provide: FavoritesFactory,
          useValue: factory,
        },
        {
          provide: 'IFavoritesRepository',
          useValue: repository,
        },
      ],
    }).compile();

    usecase = module.get<FavoritesUsecase>(FavoritesUsecase);
  });

  describe('toggleFavorite', () => {
    const dto: ToggleFavoriteDto = {
      uid: genUid(),
      postId: genUUID(),
    };
    const uid = Uid.create(dto.uid);
    const postId = Uuid.create(dto.postId);
    const favorite = new Favorite(uid, postId);

    it('should throw NotFoundException if post does not exist', async () => {
      postService.exists.mockResolvedValueOnce(false);
      factory.createModel.mockReturnValueOnce(favorite);

      await expect(usecase.toggleFavorite(dto)).rejects.toThrow(
        NotFoundException,
      );
      expect(postService.exists).toHaveBeenCalledWith(postId);
    });

    it('should delete favorite if it already exists', async () => {
      postService.exists.mockResolvedValueOnce(true);
      favoritesService.exists.mockResolvedValueOnce(true);
      factory.createModel.mockReturnValueOnce(favorite);

      const result = await usecase.toggleFavorite(dto);

      expect(favoritesService.exists).toHaveBeenCalledWith(uid, postId);
      expect(repository.delete).toHaveBeenCalledWith(favorite);
      expect(result).toBe(false);
    });

    it('should create favorite if it does not exist', async () => {
      postService.exists.mockResolvedValueOnce(true);
      favoritesService.exists.mockResolvedValueOnce(false);
      factory.createModel.mockReturnValueOnce(favorite);

      const result = await usecase.toggleFavorite(dto);

      expect(favoritesService.exists).toHaveBeenCalledWith(uid, postId);
      expect(repository.create).toHaveBeenCalledWith(favorite);
      expect(result).toBe(true);
    });
  });
});
