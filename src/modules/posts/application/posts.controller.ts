import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { CreatePostUsecase } from './create-post.usecase';
import { CreatePostDto } from './dto/request/create-post.dto';
import { FindPostsUsecase } from './find-posts.usecase';

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
  async findOwnPosts(@Req() request: Request) {
    const uid = request['ownUid'];
    if (!uid) {
      throw new Error('UID is not available in the request');
    }
    return await this.findPostsUsecase.findOwnPosts(uid);
  }
}
