import { DataSource } from 'typeorm';
import { PostsFactory } from './factory/posts.factory';
import { IPostsRepository } from '../domain/i.posts.repository';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';

import { UpdatePostDto } from './dto/request/update-post.dto';
import { PostSubCategoryHelper } from './helper/post-subcategory.helper';
import { CategoryNoEnum } from '../domain/enums/category-no.enum';

export class UpdatePostUsecase {
  constructor(
    private readonly dataSource: DataSource,
    private readonly postsFactory: PostsFactory,
    private readonly helper: PostSubCategoryHelper,
    @Inject('IPostsRepository')
    private readonly postsRepository: IPostsRepository,
  ) {}

  async execute(dto: UpdatePostDto, postId: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const post = this.postsFactory.createModelFromUpdateDto(dto, postId);
      const foundPost = await this.postsRepository.findById(post.getPostId());
      if (!foundPost) {
        throw new NotFoundException('Post not found');
      }

      if (!post.isOwnedBy(foundPost.getUid())) {
        throw new BadRequestException('You are not the owner of this post');
      }

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
