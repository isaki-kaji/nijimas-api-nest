import { DataSource, In } from 'typeorm';
import { PostsFactory } from './factory/posts.factory';
import { IPostsRepository } from '../domain/i.posts.repository';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';

import { UpdatePostDto } from './dto/request/update-post.dto';
import { PostSubCategoryHelper } from './helper/post-subcategory.helper';
import { IPostSubCategoriesRepository } from 'posts/domain/i.post-sub-category.repository';

export class UpdatePostUsecase {
  constructor(
    private readonly dataSource: DataSource,
    private readonly postsFactory: PostsFactory,
    private readonly helper: PostSubCategoryHelper,
    @Inject('IPostsRepository')
    private readonly postsRepository: IPostsRepository,
    @Inject('IPostSubCategoriesRepository')
    private readonly postSubCategoriesRepository: IPostSubCategoriesRepository,
  ) {}

  async execute(dto: UpdatePostDto, postId: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const post = this.postsFactory.createModelFromUpdateDto(dto, postId);
      const foundPost = await this.postsRepository.findById(post.postId);
      if (!foundPost) {
        throw new NotFoundException('Post not found');
      }

      if (!post.isOwnedBy(foundPost.uid)) {
        throw new BadRequestException('You are not the owner of this post');
      }

      await this.postsRepository.save(post, queryRunner.manager);

      await this.postSubCategoriesRepository.deleteByPostId(
        post.postId,
        queryRunner.manager,
      );
      await this.helper.handleSubCategories(
        dto.subCategories!,
        post.postId,
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
