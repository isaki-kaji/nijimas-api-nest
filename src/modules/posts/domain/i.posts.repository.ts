import { EntityManager } from 'typeorm';
import { Post } from './models/post';

export interface IPostsRepository {
  create(post: Post, manager?: EntityManager): Promise<void>;
}
