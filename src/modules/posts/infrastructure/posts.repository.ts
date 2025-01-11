import { IPostsRepository } from '../domain/i.posts.repository';

export class PostsRepository implements IPostsRepository {
  async create(post) {
    throw new Error('Method not implemented.');
  }
}
