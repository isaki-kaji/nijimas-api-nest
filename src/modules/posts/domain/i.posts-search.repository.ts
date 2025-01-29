import { Uid } from 'modules/common/domain/value-objects/uid';
import { Post } from './models/post';
import { Uuid } from 'modules/common/domain/value-objects/uuid';

export interface IPostsSearchRepository {
  findOne(uid: Uid, postId: Uuid): Promise<Post | null>;
  findOwnPosts(uid: Uid): Promise<Post[]>;
  findTimelinePosts(uid: Uid): Promise<Post[]>;
  findPostsByUid(uid: Uid, targetUid: Uid): Promise<Post[]>;
  findPostsBySubCategory(uid: Uid, categoryName: string): Promise<Post[]>;
}
