import { Inject, Injectable } from '@nestjs/common';
import { IFavoritesRepository } from './i.favorites.repository';
import { Uuid } from 'modules/common/domain/value-objects/uuid';
import { Uid } from 'modules/common/domain/value-objects/uid';

@Injectable()
export class FavoritesService {
  constructor(
    @Inject('IFavoritesRepository')
    private readonly repository: IFavoritesRepository,
  ) {}

  async exists(uid: Uid, postId: Uuid): Promise<boolean> {
    const foundFavorite = await this.repository.findOne(uid, postId);
    return !!foundFavorite;
  }
}
