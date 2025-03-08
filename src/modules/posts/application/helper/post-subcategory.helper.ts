import { Inject, Injectable } from '@nestjs/common';
import { Uuid } from 'modules/common/domain/value-objects/uuid';
import { IPostSubCategoriesRepository } from 'modules/posts/domain/i.post-sub-category.repository';
import { ISubCategoriesRepository } from 'modules/posts/domain/i.sub-categories.repository';
import { SubCategory } from 'modules/posts/domain/models/sub-category';
import { createCategoryNo } from 'modules/posts/domain/value-objects/category-no';
import { EntityManager } from 'typeorm';

@Injectable()
export class PostSubCategoryHelper {
  constructor(
    @Inject('ISubCategoriesRepository')
    private readonly subCategoriesRepository: ISubCategoriesRepository,
    @Inject('IPostSubCategoriesRepository')
    private readonly postSubCategoryRepository: IPostSubCategoriesRepository,
  ) {}

  async handleSubCategories(
    subCategories: string[],
    postId: Uuid,
    manager: EntityManager,
  ): Promise<void> {
    if (!subCategories) {
      return;
    }

    for (let i = 0; i < subCategories.length; i++) {
      let subCategory = await this.subCategoriesRepository.findByName(
        subCategories[i],
      );
      if (!subCategory) {
        const categoryId = Uuid.generate();
        subCategory = new SubCategory(categoryId, subCategories[i]);
        await this.subCategoriesRepository.save(subCategory, manager);
      }

      const categoryNo = createCategoryNo(i + 1);
      await this.postSubCategoryRepository.save(
        subCategory,
        postId,
        categoryNo,
        manager,
      );
    }
  }
}
