import { Inject, Injectable } from '@nestjs/common';
import { IPostsSearchRepository } from './i.posts-search.repository';
import { Uuid } from 'modules/common/domain/value-objects/uuid';
import { Uid } from 'modules/common/domain/value-objects/uid';

@Injectable()
export class PostsService {
  constructor(
    @Inject('IPostsSearchRepository')
    private readonly postSearchRepository: IPostsSearchRepository,
  ) {}

  async exists(uid: Uid, post: Uuid): Promise<boolean> {
    const foundPost = await this.postSearchRepository.findOne(uid, post);
    return !!foundPost;
  }
}
