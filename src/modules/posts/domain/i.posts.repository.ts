import { EntityManager } from 'typeorm';
import { Post } from './models/post';
import { Uuid } from 'modules/common/domain/value-objects/uuid';

export interface IPostsRepository {
  create(post: Post, manager?: EntityManager): Promise<void>;
  findById(postId: Uuid): Promise<Post | null>;
}
