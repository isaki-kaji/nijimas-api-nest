import { InjectRepository } from '@nestjs/typeorm';
import { IPostsRepository } from '../domain/i.posts.repository';
import { Post } from '../domain/models/post';
import { PostEntity } from 'entities/post.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Uuid } from 'modules/common/domain/value-objects/uuid';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { createPublicTypeNo } from '../domain/value-objects/public-type-no';
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

  async findById(postId: Uuid): Promise<Post | undefined> {
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

    const rawPosts = await this.dataSource.query(sql, [postId.value]);

    if (rawPosts.length === 0) {
      return undefined;
    }

    return this.toModel(rawPosts[0]);
  }

  async delete(postId: Uuid, manager?: EntityManager): Promise<void> {
    const sql = `
    UPDATE posts
    SET deleted_at = NOW()
    WHERE post_id = $1;
  `;
    manager
      ? await manager.query(sql, [postId.value])
      : await this.dataSource.query(sql, [postId.value]);
  }

  private toModel(raw: any): Post {
    return new Post(
      Uuid.create(raw.post_id),
      Uid.create(raw.uid),
      raw.main_category,
      createPublicTypeNo(raw.public_type_no),
      new Date(raw.created_at),
      raw.version,
      raw.sub_category1 ? [raw.sub_category1, raw.sub_category2] : [],
      raw.post_text || undefined,
      raw.photo_url ? PhotoUrlList.create(raw.photo_url) : undefined,
      raw.expense ? Expense.create(raw.expense) : undefined,
      raw.location || undefined,
    );
  }

  private toEntity(post: Post): PostEntity {
    const entity = new PostEntity();
    entity.uid = post.uid.value;
    entity.postId = post.postId.value;
    entity.mainCategory = post.mainCategory;
    entity.postText = post.postText ?? undefined;
    entity.photoUrl = post.photoUrlList?.strValue ?? undefined;
    entity.expense = post.expense?.value ?? 0;
    entity.location = post.location ?? undefined;
    entity.publicTypeNo = post.publicTypeNo;
    entity.version = post.version;
    return entity;
  }
}
