import { InjectRepository } from '@nestjs/typeorm';
import { IPostsRepository } from '../domain/i.posts.repository';
import { Post } from '../domain/models/post';
import { PostEntity } from 'entities/post.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Uuid } from 'modules/common/domain/value-objects/uuid';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { MainCategory } from 'modules/common/domain/value-objects/main-category';
import { PublicTypeNo } from '../domain/value-objects/public-type-no';
import { PhotoUrlList } from '../domain/value-objects/photo-url-list';
import { Expense } from 'modules/common/domain/value-objects/expense';

@Injectable()
export class PostsRepository implements IPostsRepository {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async save(post: Post, manager?: EntityManager): Promise<void> {
    const entity = this.toEntity(post);
    manager
      ? await manager.getRepository(PostEntity).save(entity)
      : await this.postRepository.save(entity);
  }

  async findById(postId: Uuid): Promise<Post | null> {
    const sql = `
    SELECT
      p.post_id,
      p.uid,
      p.main_category,
      COALESCE(sc.sub_category1, '')::text AS sub_category1,
      COALESCE(sc.sub_category2, '')::text AS sub_category2,
      p.post_text,
      p.photo_url,
      p.expense,
      p.location,
      p.public_type_no,
      p.created_at,
      p.version
    FROM posts p
    LEFT JOIN (
      SELECT
        ps.post_id,
        MAX(CASE WHEN ps.category_no = '1' THEN s.category_name ELSE NULL END) AS sub_category1,
        MAX(CASE WHEN ps.category_no = '2' THEN s.category_name ELSE NULL END) AS sub_category2
      FROM post_subcategories ps
      JOIN sub_categories s ON ps.category_id = s.category_id
      WHERE ps.post_id = $1
      GROUP BY ps.post_id
    ) sc ON p.post_id = sc.post_id
    WHERE 
      p.post_id = $1;
  `;

    const rawPosts = await this.dataSource.query(sql, [postId.getValue()]);

    if (rawPosts.length === 0) {
      return null;
    }

    return this.toModel(rawPosts[0]);
  }

  private toModel(raw: any): Post {
    return new Post(
      Uuid.create(raw.post_id),
      Uid.create(raw.uid),
      MainCategory.create(raw.main_category),
      PublicTypeNo.create(raw.public_type_no),
      new Date(raw.created_at),
      raw.version,
      raw.sub_category1 ? [raw.sub_category1, raw.sub_category2] : [],
      raw.post_text || null,
      raw.photo_url ? PhotoUrlList.create(raw.photo_url) : null,
      raw.expense ? Expense.create(raw.expense) : null,
      raw.location || null,
    );
  }

  private toEntity(post: Post): PostEntity {
    const entity = new PostEntity();
    entity.uid = post.getUid().getValue();
    entity.postId = post.getPostId().getValue();
    entity.mainCategory = post.getMainCategory().getValue();
    entity.postText = post.getPostText() ?? null;
    entity.photoUrl = post.getPhotoUrlList()?.getStrValue() ?? null;
    entity.expense = post.getExpense().getValue() ?? null;
    entity.location = post.getLocation() ?? null;
    entity.publicTypeNo = post.getPublicTypeNo().getValue();
    entity.version = post.getVersion();
    return entity;
  }
}
