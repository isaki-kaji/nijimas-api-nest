import { DataSource, In } from 'typeorm';
import { IPostsRepository } from '../domain/i.posts.repository';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';

import { IPostSubCategoriesRepository } from 'posts/domain/i.post-sub-category.repository';
import { Uuid } from 'modules/common/domain/value-objects/uuid';
import { Uid } from 'modules/common/domain/value-objects/uid';

export class DeletePostUsecase {
  constructor(
    private readonly dataSource: DataSource,
    @Inject('IPostsRepository')
    private readonly postsRepository: IPostsRepository,
    @Inject('IPostSubCategoriesRepository')
    private readonly postSubCategoriesRepository: IPostSubCategoriesRepository,
  ) {}

  async execute(uidStr: string, postIdStr: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const uid = Uid.create(uidStr);
      const postId = Uuid.create(postIdStr);

      const foundPost = await this.postsRepository.findById(postId);

      if (!foundPost) {
        throw new NotFoundException('Post not found');
      }

      if (!foundPost.isOwnedBy(uid)) {
        throw new BadRequestException('You are not the owner of this post');
      }

      await this.postSubCategoriesRepository.deleteByPostId(
        postId,
        queryRunner.manager,
      );

      await this.postsRepository.delete(postId, queryRunner.manager);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
