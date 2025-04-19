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
    it('should create a favorite if it does not exists', async () => {
      const dto: ToggleFavoriteDto = {
        uid: genUid(),
        postId: genUUID(),
        isFavorite: true,
      };
      const favorite = new Favorite(
        Uid.create(dto.uid),
        Uuid.create(dto.postId),
        dto.isFavorite,
      );

      factory.createModel.mockReturnValue(favorite);
      postService.exists.mockResolvedValue(true);
      favoritesService.exists.mockResolvedValue(false);
      repository.create.mockResolvedValue();

      await usecase.toggleFavorite(dto);

      expect(postService.exists).toHaveBeenCalledWith(favorite.postId);
      expect(favoritesService.exists).toHaveBeenCalledWith(
        favorite.uid,
        favorite.postId,
      );
      expect(repository.create).toHaveBeenCalledWith(favorite);
    });

    it('should create a favorite if it exists', async () => {
      const dto: ToggleFavoriteDto = {
        uid: genUid(),
        postId: genUUID(),
        isFavorite: true,
      };
      const favorite = new Favorite(
        Uid.create(dto.uid),
        Uuid.create(dto.postId),
        dto.isFavorite,
      );

      factory.createModel.mockReturnValue(favorite);
      postService.exists.mockResolvedValue(true);
      favoritesService.exists.mockResolvedValue(true);
      repository.create.mockResolvedValue();

      await usecase.toggleFavorite(dto);

      expect(postService.exists).toHaveBeenCalledWith(favorite.postId);
      expect(favoritesService.exists).toHaveBeenCalledWith(
        favorite.uid,
        favorite.postId,
      );
      expect(repository.create).not.toHaveBeenCalledWith(favorite);
    });

    it('should delete a favorite if it exists', async () => {
      const dto: ToggleFavoriteDto = {
        uid: genUid(),
        postId: genUUID(),
        isFavorite: false,
      };
      const favorite = new Favorite(
        Uid.create(dto.uid),
        Uuid.create(dto.postId),
        dto.isFavorite,
      );

      factory.createModel.mockReturnValue(favorite);
      postService.exists.mockResolvedValue(true);
      favoritesService.exists.mockResolvedValue(true);

      await usecase.toggleFavorite(dto);

      expect(postService.exists).toHaveBeenCalledWith(favorite.postId);
      expect(favoritesService.exists).toHaveBeenCalledWith(
        favorite.uid,
        favorite.postId,
      );
      expect(repository.delete).toHaveBeenCalledWith(favorite);
    });

    it('should delete a favorite if it does not exists', async () => {
      const dto: ToggleFavoriteDto = {
        uid: genUid(),
        postId: genUUID(),
        isFavorite: false,
      };
      const favorite = new Favorite(
        Uid.create(dto.uid),
        Uuid.create(dto.postId),
        dto.isFavorite,
      );

      factory.createModel.mockReturnValue(favorite);
      postService.exists.mockResolvedValue(true);
      favoritesService.exists.mockResolvedValue(false);

      await usecase.toggleFavorite(dto);

      expect(postService.exists).toHaveBeenCalledWith(favorite.postId);
      expect(favoritesService.exists).toHaveBeenCalledWith(
        favorite.uid,
        favorite.postId,
      );
      expect(repository.delete).not.toHaveBeenCalledWith(favorite);
    });

    it('should throw NotFoundException if the post does not exist', async () => {
      const dto: ToggleFavoriteDto = {
        uid: genUid(),
        postId: genUUID(),
        isFavorite: true,
      };

      const favorite = new Favorite(
        Uid.create(dto.uid),
        Uuid.create(dto.postId),
        dto.isFavorite,
      );

      factory.createModel.mockReturnValue(favorite);
      postService.exists.mockResolvedValue(false);
      favoritesService.exists.mockResolvedValue(false);

      await expect(usecase.toggleFavorite(dto)).rejects.toThrow(
        NotFoundException,
      );

      expect(postService.exists).toHaveBeenCalledWith(Uuid.create(dto.postId));
    });
  });
});
