import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { IFavoritesRepository } from '../domain/i.favorites.repository';
import { FavoriteEntity } from 'entities/favorite.entity';
import { Favorite } from '../domain/models/favorite';
import { Uuid } from 'modules/common/domain/value-objects/uuid';

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

  async findOne(uid: Uid, postId: Uuid): Promise<Favorite | null> {
    const row = await this.userRepository.findOne({
      where: { uid: uid.value, postId: postId.value },
    });
    return row ? this.toModel(row) : null;
  }

  private toEntity(user: Favorite): FavoriteEntity {
    const entity = new FavoriteEntity();
    entity.uid = user.uid.value;
    entity.postId = user.postId.value;
    return entity;
  }

  private toModel(entity: FavoriteEntity): Favorite {
    const uid = Uid.create(entity.uid);
    const postID = Uuid.create(entity.postId);
    return new Favorite(uid, postID, true);
  }
}
