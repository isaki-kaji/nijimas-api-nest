import { FavoriteCategoryNo } from '../value-objects/favorite-category-no';
import { Uuid } from 'modules/common/domain/value-objects/uuid';

export class UserFavoriteSubcategory {
  constructor(
    readonly categoryId: Uuid,
    readonly categoryNo: FavoriteCategoryNo,
    readonly categoryName: string,
  ) {}
}
