import { FavoritesFactory } from './favorites.factory';
import { ToggleFavoriteDto } from '../dto/request/toggle-favorite.dto';
import { Favorite } from 'modules/favorites/domain/models/favorite';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { Uuid } from 'modules/common/domain/value-objects/uuid';
import { genUid, genUUID } from 'testing/utils/common-test-util';

describe('FavoritesFactory', () => {
  let factory: FavoritesFactory;

  beforeEach(() => {
    factory = new FavoritesFactory();
  });

  describe('createModel', () => {
    it('should create a Favorite model from DTO', () => {
      const dto: ToggleFavoriteDto = {
        uid: genUid(),
        postId: genUUID(),
      };

      const result = factory.createModel(dto);

      expect(result).toBeInstanceOf(Favorite);
      expect(result.getUid()).toEqual(Uid.create(dto.uid));
      expect(result.getPostId()).toEqual(Uuid.create(dto.postId));
    });
  });
});
