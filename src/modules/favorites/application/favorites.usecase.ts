import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IFavoritesRepository } from '../domain/i.favorites.repository';
import { ToggleFavoriteDto } from './dto/request/toggle-favorite.dto';
import { FavoritesService } from '../domain/favorites.service';
import { FavoritesFactory } from './factory/favorites.factory';
import { PostsService } from 'modules/posts/domain/posts.service';

@Injectable()
export class FavoritesUsecase {
  constructor(
    private readonly service: FavoritesService,
    private readonly postService: PostsService,
    private readonly factory: FavoritesFactory,
    @Inject('IFavoritesRepository')
    private readonly repository: IFavoritesRepository,
  ) {}

  async toggleFavorite(dto: ToggleFavoriteDto) {
    const favorite = this.factory.createModel(dto);
    console.log(dto);

    if (!(await this.postService.exists(favorite.postId))) {
      throw new NotFoundException('Post not found');
    }

    const favoriteCreated = await this.service.exists(
      favorite.uid,
      favorite.postId,
    );

    if (favorite.isFavorite && !favoriteCreated) {
      console.log('Creating favorite');
      return await this.repository.create(favorite);
    }
    if (!favorite.isFavorite && favoriteCreated) {
      console.log('Deleting favorite');
      return await this.repository.delete(favorite);
    }
  }
}
