import { FavoriteCategoryNo } from '../value-objects/favorite-category-no';
import { Uuid } from 'modules/common/domain/value-objects/uuid';

export class UserFavoriteSubcategory {
  constructor(
    private readonly categoryId: Uuid,
    private readonly categoryNo: FavoriteCategoryNo,
    private readonly categoryName: string,
  ) {}

  getCategoryId(): Uuid {
    return this.categoryId;
  }

  getCategoryNo(): FavoriteCategoryNo {
    return this.categoryNo;
  }

  getCategoryName(): string {
    return this.categoryName;
  }
}
