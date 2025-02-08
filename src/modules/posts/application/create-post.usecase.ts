import { IPostsRepository } from '../domain/i.posts.repository';
import { Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/request/create-post.dto';
import { PostsFactory } from './factory/posts.factory';
import { DataSource } from 'typeorm';
import { CategoryNoEnum } from '../domain/enums/category-no.enum';
import { PostSubCategoryHelper } from './helper/post-subcategory.helper';

@Injectable()
export class CreatePostUsecase {
  constructor(
    private readonly dataSource: DataSource,
    private readonly postsFactory: PostsFactory,
    private readonly helper: PostSubCategoryHelper,
    @Inject('IPostsRepository')
    private readonly postsRepository: IPostsRepository,
  ) {}

  async execute(dto: CreatePostDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const post = this.postsFactory.createModelFromCreateDto(dto);

      await this.postsRepository.save(post, queryRunner.manager);

      await this.helper.handleSubCategory(
        dto.subCategory1,
        CategoryNoEnum.ONE,
        post.getPostId(),
        queryRunner.manager,
      );

      await this.helper.handleSubCategory(
        dto.subCategory2,
        CategoryNoEnum.TWO,
        post.getPostId(),
        queryRunner.manager,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
