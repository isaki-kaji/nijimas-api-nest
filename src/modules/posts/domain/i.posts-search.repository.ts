import { Uid } from 'modules/common/domain/value-objects/uid';
import { Post } from './models/post';
import { UUID } from 'modules/common/domain/value-objects/uuid';

export interface IPostsSearchRepository {
  findOne(uid: Uid, postId: UUID): Promise<Post | null>;
  findOwnPosts(uid: Uid): Promise<Post[]>;
  findTimelinePosts(uid: Uid): Promise<Post[]>;
  findPostsBySubCategory(uid: Uid, categoryName: string): Promise<Post[]>;
}
