import { Module } from '@nestjs/common';
import { PostsRepository } from './infrastructure/posts.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: 'IPostsRepository',
      useClass: PostsRepository,
    },
  ],
})
export class PostsModule {}
