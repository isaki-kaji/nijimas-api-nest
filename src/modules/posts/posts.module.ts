import { Module } from '@nestjs/common';
import { PostsRepository } from './infrastructure/posts.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from 'entities/post.entity';
import { PostsService } from './domain/posts.service';
import { PostsFactory } from './domain/factory/posts.factory';
import { CreatePostUsecase } from './application/create-post.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity])],
  controllers: [],
  providers: [
    CreatePostUsecase,
    PostsService,
    PostsFactory,
    {
      provide: 'IPostsRepository',
      useClass: PostsRepository,
    },
  ],
})
export class PostsModule {}
