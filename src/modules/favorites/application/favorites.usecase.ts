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

  async toggleFavorite(dto: ToggleFavoriteDto): Promise<boolean> {
    const favorite = this.factory.createModel(dto);
    if (!(await this.postService.exists(favorite.uid, favorite.postId))) {
      throw new NotFoundException('Post not found');
    }

    if (await this.service.exists(favorite.uid, favorite.postId)) {
      await this.repository.delete(favorite);
      return false;
    } else {
      await this.repository.create(favorite);
      return true;
    }
  }
}
