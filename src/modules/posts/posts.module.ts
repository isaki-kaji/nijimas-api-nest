import { Module } from '@nestjs/common';
import { PostsRepository } from './infrastructure/posts.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from 'entities/post.entity';
import { PostsService } from './domain/posts.service';
import { PostsFactory } from './application/factory/posts.factory';
import { CreatePostUsecase } from './application/create-post.usecase';
import { PostsController } from './application/posts.controller';
import { SubCategoriesRepository } from './infrastructure/sub-categories.repository';
import { PostSubCategoriesRepository } from './infrastructure/post-sub-categories.repository';
import { PostSubcategoryEntity } from 'entities/post-subcategory.entity';
import { SubCategoryEntity } from 'entities/sub-category.entity';
import { PostsQueryService } from './infrastructure/posts.query.service';
import { PostSubCategoryHelper } from './application/helper/post-subcategory.helper';
import { UpdatePostUsecase } from './application/update-post.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostEntity,
      SubCategoryEntity,
      PostSubcategoryEntity,
    ]),
  ],
  controllers: [PostsController],
  providers: [
    CreatePostUsecase,
    UpdatePostUsecase,
    PostsService,
    PostsFactory,
    PostSubCategoryHelper,
    {
      provide: 'IPostsRepository',
      useClass: PostsRepository,
    },
    {
      provide: 'ISubCategoriesRepository',
      useClass: SubCategoriesRepository,
    },
    {
      provide: 'IPostSubCategoriesRepository',
      useClass: PostSubCategoriesRepository,
    },
    {
      provide: 'IPostsQueryService',
      useClass: PostsQueryService,
    },
  ],
  exports: [PostsService],
})
export class PostsModule {}
