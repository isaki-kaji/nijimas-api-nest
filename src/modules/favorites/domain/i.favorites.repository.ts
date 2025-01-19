import { Favorite } from './models/favorite';

export interface IFavoritesRepository {
  create(favorite: Favorite): Promise<void>;
  delete(favorite: Favorite): Promise<void>;
}
