import { Inject, Injectable } from '@nestjs/common';
import { IPostsSearchRepository } from '../domain/i.posts-search.repository';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { PostResponseDto } from './dto/response/post.response.dto';
import { PostsFactory } from './factory/posts.factory';

@Injectable()
export class FindPostsUsecase {
  constructor(
    private readonly factory: PostsFactory,
    @Inject('IPostsSearchRepository')
    private readonly repository: IPostsSearchRepository,
  ) {}

  async findOwnPosts(uidStr: string): Promise<PostResponseDto[]> {
    const uid = Uid.create(uidStr);
    const posts = await this.repository.findOwnPosts(uid);
    return this.factory.createResponseList(posts);
  }

  async findTimelinePosts(uidStr: string): Promise<PostResponseDto[]> {
    const uid = Uid.create(uidStr);
    const posts = await this.repository.findTimelinePosts(uid);
    return this.factory.createResponseList(posts);
  }
}
