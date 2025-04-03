import { UserFavoriteSubcategory } from './user-favorite-subcategory';

export class UserFavoriteSubcategoryList {
  private readonly _list: UserFavoriteSubcategory[];

  constructor(subcategories: UserFavoriteSubcategory[]) {
    if (subcategories.length > 4) {
      throw new Error('A user can have up to 4 favorite subcategories.');
    }
    this._list = subcategories;
  }

  get list(): UserFavoriteSubcategory[] {
    return this._list;
  }
}
