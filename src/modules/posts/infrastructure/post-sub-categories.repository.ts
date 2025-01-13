import { InjectRepository } from '@nestjs/typeorm';
import { PostSubcategoryEntity } from 'entities/post-subcategory.entity';
import { EntityManager, Repository } from 'typeorm';
import { SubCategory } from '../domain/models/sub-category';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { CategoryNo } from '../domain/value-objects/category-no';

export class PostSubCategoriesRepository {
  constructor(
    @InjectRepository(PostSubcategoryEntity)
    private readonly postSubCategoryRepository: Repository<PostSubcategoryEntity>,
  ) {}

  async create(
    subCategory: SubCategory,
    postId: UUID,
    categoryNo: CategoryNo,
    manager?: EntityManager,
  ): Promise<void> {
    const entity = this.toEntity(subCategory, postId, categoryNo);
    if (manager) {
      await manager.getRepository(PostSubcategoryEntity).save(entity);
    } else {
      await this.postSubCategoryRepository.save(entity);
    }
  }

  private toEntity(
    subCategory: SubCategory,
    postId: UUID,
    categoryNo: CategoryNo,
  ): PostSubcategoryEntity {
    const entity = new PostSubcategoryEntity();
    entity.categoryId = subCategory.id.toString();
    entity.postId = postId.toString();
    entity.categoryNo = categoryNo.getValue();
    return entity;
  }
}
