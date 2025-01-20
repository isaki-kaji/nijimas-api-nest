import { Injectable } from '@nestjs/common';

import { Uid } from 'modules/common/domain/value-objects/uid';
import { UUID } from 'modules/common/domain/value-objects/uuid';
import { ToggleFavoriteDto } from '../dto/request/toggle-favorite.dto';
import { Favorite } from 'modules/favorites/domain/models/favorite';

@Injectable()
export class FavoritesFactory {
  createModel(dto: ToggleFavoriteDto): Favorite {
    const postId = UUID.create(dto.postId);
    const uid = Uid.create(dto.uid);
    return new Favorite(uid, postId);
  }
}
