import { IPostsRepository } from '../domain/i.posts.repository';
import { Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/request/create-post.dto';
import { PostsFactory } from '../domain/factory/posts.factory';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ISubCategoriesRepository } from '../domain/i.sub-categories.repository';
import { SubCategory } from '../domain/models/sub-category';
import { UUID } from 'modules/common/domain/value-objects/uuid';
import { IPostSubCategoriesRepository } from '../domain/i.post-sub-category.repository';
import { CategoryNo } from '../domain/value-objects/category-no';
import { CategoryNoEnum } from '../domain/enums/category-no.enum';

@Injectable()
export class CreatePostUsecase {
  constructor(
    @InjectEntityManager()
    private readonly manager: EntityManager,
    private readonly postsFactory: PostsFactory,
    @Inject('IPostsRepository')
    private readonly postsRepository: IPostsRepository,
    @Inject('ISubCategoriesRepository')
    private readonly subCategoriesRepository: ISubCategoriesRepository,
    @Inject('IPostSubCategoryRepository')
    private readonly postSubCategoryRepository: IPostSubCategoriesRepository,
  ) {}

  async execute(dto: CreatePostDto): Promise<void> {
    const post = this.postsFactory.createModel(dto);
    await this.manager.transaction(async (manager) => {
      await this.postsRepository.create(post, manager);

      await this.handleSubCategory(
        dto.subCategory1,
        CategoryNoEnum.ONE,
        post.postId,
        manager,
      );

      await this.handleSubCategory(
        dto.subCategory2,
        CategoryNoEnum.TWO,
        post.postId,
        manager,
      );
    });
  }

  private async handleSubCategory(
    categoryName: string,
    categoryNoValue: CategoryNoEnum,
    postId: UUID,
    manager: EntityManager,
  ) {
    if (!categoryName) {
      return;
    }

    let existsSubCategory =
      await this.subCategoriesRepository.findByName(categoryName);
    if (!existsSubCategory) {
      const categoryId = UUID.generate();
      existsSubCategory = new SubCategory(categoryId, categoryName);
      await this.subCategoriesRepository.create(existsSubCategory, manager);
    }

    const categoryNo = CategoryNo.create(categoryNoValue);
    await this.postSubCategoryRepository.create(
      existsSubCategory,
      postId,
      categoryNo,
      manager,
    );
  }
}
