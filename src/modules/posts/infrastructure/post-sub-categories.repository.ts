import { InjectRepository } from '@nestjs/typeorm';
import { PostSubcategoryEntity } from 'entities/post-subcategory.entity';
import { EntityManager, Repository } from 'typeorm';
import { SubCategory } from '../domain/models/sub-category';
import { CategoryNo } from '../domain/value-objects/category-no';
import { IPostSubCategoriesRepository } from '../domain/i.post-sub-category.repository';
import { Uuid } from 'modules/common/domain/value-objects/uuid';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostSubCategoriesRepository
  implements IPostSubCategoriesRepository
{
  constructor(
    @InjectRepository(PostSubcategoryEntity)
    private readonly postSubCategoryRepository: Repository<PostSubcategoryEntity>,
  ) {}

  async save(
    subCategory: SubCategory,
    postId: Uuid,
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

  async deleteByPostId(postId: Uuid, manager?: EntityManager): Promise<void> {
    if (manager) {
      await manager
        .getRepository(PostSubcategoryEntity)
        .delete({ postId: postId.value });
    } else {
      await this.postSubCategoryRepository.delete({
        postId: postId.value,
      });
    }
  }

  private toEntity(
    subCategory: SubCategory,
    postId: Uuid,
    categoryNo: CategoryNo,
  ): PostSubcategoryEntity {
    const entity = new PostSubcategoryEntity();
    entity.categoryId = subCategory.getId().value;
    entity.postId = postId.value;
    entity.categoryNo = categoryNo;
    return entity;
  }
}
