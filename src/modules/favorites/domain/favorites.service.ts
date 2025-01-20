import { Inject, Injectable } from '@nestjs/common';
import { IFavoritesRepository } from './i.favorites.repository';
import { UUID } from 'modules/common/domain/value-objects/uuid';
import { Uid } from 'modules/common/domain/value-objects/uid';

@Injectable()
export class FavoritesService {
  constructor(
    @Inject('IFavoritesRepository')
    private readonly repository: IFavoritesRepository,
  ) {}

  async exists(uid: Uid, postId: UUID): Promise<boolean> {
    const foundFavorite = await this.repository.findOne(uid, postId);
    return !!foundFavorite;
  }
}
