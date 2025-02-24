import { EntityManager } from 'typeorm';
import { Uuid } from 'modules/common/domain/value-objects/uuid';
import { SubCategory } from './models/sub-category';
import { CategoryNo } from './value-objects/category-no';

export interface IPostSubCategoriesRepository {
  save(
    subCategory: SubCategory,
    postId: Uuid,
    categoryNo: CategoryNo,
    manager?: EntityManager,
  ): Promise<void>;

  deleteByPostId(postId: Uuid, manager?: EntityManager): Promise<void>;
}
