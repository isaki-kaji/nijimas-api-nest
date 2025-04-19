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
        isFavorite: true,
      };

      const result = factory.createModel(dto);

      expect(result).toBeInstanceOf(Favorite);
      expect(result.uid).toEqual(Uid.create(dto.uid));
      expect(result.postId).toEqual(Uuid.create(dto.postId));
      expect(result.isFavorite).toEqual(dto.isFavorite);
    });
  });
});
