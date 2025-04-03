import { FavoriteCategoryNo } from '../value-objects/favorite-category-no';
import { Uuid } from 'modules/common/domain/value-objects/uuid';

export class UserFavoriteSubcategory {
  constructor(
    private readonly _categoryId: Uuid,
    private readonly _categoryNo: FavoriteCategoryNo,
    private readonly _categoryName: string,
  ) {}

  get categoryId(): Uuid {
    return this._categoryId;
  }

  get categoryNo(): FavoriteCategoryNo {
    return this._categoryNo;
  }

  get categoryName(): string {
    return this._categoryName;
  }
}
