import { Inject, Injectable } from '@nestjs/common';
import { Uuid } from 'modules/common/domain/value-objects/uuid';
import { CategoryNoEnum } from 'modules/posts/domain/enums/category-no.enum';
import { IPostSubCategoriesRepository } from 'modules/posts/domain/i.post-sub-category.repository';
import { ISubCategoriesRepository } from 'modules/posts/domain/i.sub-categories.repository';
import { SubCategory } from 'modules/posts/domain/models/sub-category';
import { CategoryNo } from 'modules/posts/domain/value-objects/category-no';
import { EntityManager } from 'typeorm';

@Injectable()
export class PostSubCategoryHelper {
  constructor(
    @Inject('ISubCategoriesRepository')
    private readonly subCategoriesRepository: ISubCategoriesRepository,
    @Inject('IPostSubCategoriesRepository')
    private readonly postSubCategoryRepository: IPostSubCategoriesRepository,
  ) {}

  async handleSubCategory(
    categoryName: string,
    categoryNoValue: CategoryNoEnum,
    postId: Uuid,
    manager: EntityManager,
  ): Promise<void> {
    if (!categoryName) return;

    let subCategory =
      await this.subCategoriesRepository.findByName(categoryName);
    if (!subCategory) {
      const categoryId = Uuid.generate();
      subCategory = new SubCategory(categoryId, categoryName);
      await this.subCategoriesRepository.save(subCategory, manager);
    }

    const categoryNo = CategoryNo.create(categoryNoValue);
    await this.postSubCategoryRepository.save(
      subCategory,
      postId,
      categoryNo,
      manager,
    );
  }
}
