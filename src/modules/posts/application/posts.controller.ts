import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Inject,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { CreatePostUsecase } from './create-post.usecase';
import { CreatePostDto } from './dto/request/create-post.dto';
import { OwnUid } from 'common/decorator/own-uid.decorator';
import { IPostsQueryService } from './i.posts.query.service';
import { UpdatePostDto } from './dto/request/update-post.dto';
import { UpdatePostUsecase } from './update-post.usecase';
import { DeletePostUsecase } from './delete-post.usecase';
import { Throttle } from '@nestjs/throttler';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly createPostUsecase: CreatePostUsecase,
    private readonly updatePostUsecase: UpdatePostUsecase,
    private readonly deletePostUsecase: DeletePostUsecase,
    @Inject('IPostsQueryService')
    private readonly queryService: IPostsQueryService,
  ) {}

  @Post()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async create(@Body() createPostDto: CreatePostDto) {
    await this.createPostUsecase.execute(createPostDto);
  }

  @Put(':postId')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async update(
    @Body() updatePostDto: UpdatePostDto,
    @Param('postId') postId: string,
  ) {
    await this.updatePostUsecase.execute(updatePostDto, postId);
  }

  @Delete(':postId')
  async delete(@OwnUid() uid: string, @Param('postId') postId: string) {
    await this.deletePostUsecase.execute(uid, postId);
  }

  @Get('me')
  async findOwnPosts(
    @OwnUid() uid: string,
    @Query('reference') referencePostId?: string,
  ) {
    return await this.queryService.findOwnPosts(uid, referencePostId);
  }

  @Get('timeline')
  async findTimelinePosts(
    @OwnUid() uid: string,
    @Query('reference') referencePostId?: string,
  ) {
    return await this.queryService.findTimelinePosts(uid, referencePostId);
  }

  @Get()
  async findPosts(
    @OwnUid() uid: string,
    @Query('uid') targetUid?: string,
    @Query('sub-category') categoryName?: string,
    @Query('reference') referencePostId?: string,
  ) {
    if (targetUid) {
      return await this.queryService.findPostsByUid(
        uid,
        targetUid,
        referencePostId,
      );
    }
    if (categoryName) {
      return await this.queryService.findPostsBySubCategory(
        uid,
        categoryName,
        referencePostId,
      );
    }
    return [];
  }
}
