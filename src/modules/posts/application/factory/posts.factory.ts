import { Injectable } from '@nestjs/common';
import { CreatePostDto } from 'modules/posts/application/dto/request/create-post.dto';
import { Post } from '../../domain/models/post';

import { Uid } from 'modules/common/domain/value-objects/uid';
import { MainCategory } from '../../../common/domain/value-objects/main-category';
import { createPublicTypeNo } from '../../domain/value-objects/public-type-no';
import { Expense } from '../../../common/domain/value-objects/expense';
import { PhotoUrlList } from '../../domain/value-objects/photo-url-list';
import { Uuid } from 'modules/common/domain/value-objects/uuid';
import { UpdatePostDto } from '../dto/request/update-post.dto';

@Injectable()
export class PostsFactory {
  createModelFromCreateDto(dto: CreatePostDto): Post {
    const postId = Uuid.create(dto.postId);
    const uid = Uid.create(dto.uid);
    const mainCategory = MainCategory.create(dto.mainCategory);
    const publicTypeNo = createPublicTypeNo(dto.publicTypeNo);
    const expense = dto.expense
      ? Expense.create(parseInt(dto.expense, 10))
      : undefined;
    const photoUrl = dto.photoUrl
      ? PhotoUrlList.create(dto.photoUrl)
      : undefined;

    return new Post(
      postId,
      uid,
      mainCategory,
      publicTypeNo,
      new Date(),
      1,
      dto.subCategories,
      dto.postText,
      photoUrl,
      expense,
      dto.location,
    );
  }

  createModelFromUpdateDto(dto: UpdatePostDto, postIdStr: string): Post {
    const postId = Uuid.create(postIdStr);
    const uid = Uid.create(dto.uid);
    const mainCategory = MainCategory.create(dto.mainCategory);
    const publicTypeNo = createPublicTypeNo(dto.publicTypeNo);
    const expense = dto.expense
      ? Expense.create(parseInt(dto.expense, 10))
      : undefined;
    const photoUrl = dto.photoUrl
      ? PhotoUrlList.create(dto.photoUrl)
      : undefined;

    return new Post(
      postId,
      uid,
      mainCategory,
      publicTypeNo,
      new Date(),
      dto.version,
      dto.subCategories ?? [],
      dto.postText,
      photoUrl,
      expense,
      dto.location,
    );
  }
}
