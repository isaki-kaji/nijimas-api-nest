import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { IFavoritesRepository } from '../domain/i.favorites.repository';
import { FavoriteEntity } from 'entities/favorite.entity';
import { Favorite } from '../domain/models/favorite';
import { UUID } from 'modules/common/domain/value-objects/uuid';

@Injectable()
export class FavoritesRepository implements IFavoritesRepository {
  constructor(
    @InjectRepository(FavoriteEntity)
    private readonly userRepository: Repository<FavoriteEntity>,
  ) {}

  async create(favorite: Favorite) {
    const entity = this.toEntity(favorite);
    await this.userRepository.save(entity);
  }

  async delete(favorite: Favorite) {
    const entity = this.toEntity(favorite);
    await this.userRepository.delete(entity);
  }

  private toEntity(user: Favorite): FavoriteEntity {
    const entity = new FavoriteEntity();
    entity.uid = user.uid.value;
    entity.postId = user.postId.getValue();
    return;
  }

  private toModel(entity: FavoriteEntity): Favorite {
    const uid = Uid.create(entity.uid);
    const postID = UUID.create(entity.postId);
    return new Favorite(uid, postID);
  }
}
