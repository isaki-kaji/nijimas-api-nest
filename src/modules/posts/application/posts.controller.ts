import { Controller, Post, Body, Get, Query, Inject } from '@nestjs/common';
import { CreatePostUsecase } from './create-post.usecase';
import { CreatePostDto } from './dto/request/create-post.dto';
import { OwnUid } from 'common/decorator/own-uid.decorator';
import { IPostsQueryService } from './i.posts.query.service';

@Controller()
export class PostsController {
  constructor(
    private readonly createPostUsecase: CreatePostUsecase,
    @Inject('IPostsQueryService')
    private readonly queryService: IPostsQueryService,
  ) {}

  @Post('posts')
  async create(@Body() createPostDto: CreatePostDto) {
    await this.createPostUsecase.execute(createPostDto);
  }

  @Get('me/posts')
  async findOwnPosts(@OwnUid() uid: string) {
    return await this.queryService.findOwnPosts(uid);
  }

  @Get('me/timeline')
  async findTimelinePosts(@OwnUid() uid: string) {
    return await this.queryService.findTimelinePosts(uid);
  }

  @Get('posts')
  async findPosts(
    @OwnUid() uid: string,
    @Query('uid') targetUid?: string,
    @Query('sub-category') categoryName?: string,
  ) {
    if (targetUid) {
      return await this.queryService.findPostsByUid(uid, targetUid);
    }
    if (categoryName) {
      return await this.queryService.findPostsBySubCategory(uid, categoryName);
    }
  }
}
