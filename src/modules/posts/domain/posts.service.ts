import { Inject, Injectable } from '@nestjs/common';
import { Uuid } from 'modules/common/domain/value-objects/uuid';
import { IPostsRepository } from './i.posts.repository';

@Injectable()
export class PostsService {
  constructor(
    @Inject('IPostsRepository')
    private readonly repository: IPostsRepository,
  ) {}

  async exists(postId: Uuid): Promise<boolean> {
    const foundPost = await this.repository.findById(postId);
    return !!foundPost;
  }
}
