import { EntityManager } from 'typeorm';
import { Uuid } from 'modules/common/domain/value-objects/uuid';
import { SubCategory } from './models/sub-category';
import { CategoryNo } from './value-objects/category-no';

export interface IPostSubCategoriesRepository {
  create(
    subCategory: SubCategory,
    postId: Uuid,
    categoryNo: CategoryNo,
    manager?: EntityManager,
  ): Promise<void>;
}
