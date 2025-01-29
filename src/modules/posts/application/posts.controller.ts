import { Controller, Post, Body, Get, Req, Query } from '@nestjs/common';
import { CreatePostUsecase } from './create-post.usecase';
import { CreatePostDto } from './dto/request/create-post.dto';
import { FindPostsUsecase } from './find-posts.usecase';
import { OwnUid } from 'common/decorator/own-uid.decorator';

@Controller()
export class PostsController {
  constructor(
    private readonly createPostUsecase: CreatePostUsecase,
    private readonly findPostsUsecase: FindPostsUsecase,
  ) {}

  @Post('posts')
  async create(@Body() createPostDto: CreatePostDto) {
    await this.createPostUsecase.execute(createPostDto);
  }

  @Get('me/posts')
  async findOwnPosts(@OwnUid() uid: string) {
    return await this.findPostsUsecase.findOwnPosts(uid);
  }

  @Get('me/timeline')
  async findTimelinePosts(@OwnUid() uid: string) {
    return await this.findPostsUsecase.findTimelinePosts(uid);
  }

  @Get('posts')
  async findPosts(
    @OwnUid() uid: string,
    @Query('uid') targetUid?: string,
    @Query('sub-category') categoryName?: string,
  ) {
    if (targetUid) {
      return await this.findPostsUsecase.findPostsByUid(uid, targetUid);
    }
    if (categoryName) {
      return await this.findPostsUsecase.findPostsBySubCategory(
        uid,
        categoryName,
      );
    }
  }
}
