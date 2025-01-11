import { Post } from './models/post';

export interface IPostsRepository {
  create(post: Post): Promise<void>;
}
