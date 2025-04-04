import { EntityManager } from 'typeorm';
import { SubCategory } from './models/sub-category';

export interface ISubCategoriesRepository {
  save(subCategory: SubCategory, manager?: EntityManager): Promise<SubCategory>;

  findByName(
    name: string,
    manager?: EntityManager,
  ): Promise<SubCategory | undefined>;
}
