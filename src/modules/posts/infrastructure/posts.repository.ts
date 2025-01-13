import { InjectRepository } from '@nestjs/typeorm';
import { IPostsRepository } from '../domain/i.posts.repository';
import { Post } from '../domain/models/post';
import { PostEntity } from 'entities/post.entity';
import { EntityManager, Repository } from 'typeorm';

export class PostsRepository implements IPostsRepository {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}
  async create(post: Post, manager?: EntityManager): Promise<void> {
    const entity = this.toEntity(post);
    (await manager)
      ? manager.getRepository(PostEntity).save(entity)
      : this.postRepository.save(entity);
  }

  private toEntity(post: Post): PostEntity {
    const entity = new PostEntity();
    entity.uid = post.uid.value;
    entity.postId = post.postId.toString();
    entity.mainCategory = post.mainCategory.getValue();
    entity.postText = post.postText ?? null;
    entity.photoUrl = post.photoUrlList.getValue() ?? null;
    entity.expense = post.expense.getValue() ?? null;
    entity.location = post.location ?? null;
    entity.publicTypeNo = post.publicTypeNo.getValue();
    return entity;
  }
}
