import { UserFavoriteSubcategory } from './user-favorite-subcategory';

export class UserFavoriteSubcategoryList {
  private readonly list: UserFavoriteSubcategory[];

  constructor(subcategories: UserFavoriteSubcategory[]) {
    if (subcategories.length > 4) {
      throw new Error('A user can have up to 4 favorite subcategories.');
    }
    this.list = subcategories;
  }

  getList(): UserFavoriteSubcategory[] {
    return this.list;
  }
}
