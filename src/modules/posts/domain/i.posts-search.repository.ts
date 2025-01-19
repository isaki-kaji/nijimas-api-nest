import { Uid } from 'modules/common/domain/value-objects/uid';
import { Post } from './models/post';

export interface IPostsSearchRepository {
  findOwnPosts(uid: Uid): Promise<Post[]>;
  findTimelinePosts(uid: Uid): Promise<Post[]>;
}
