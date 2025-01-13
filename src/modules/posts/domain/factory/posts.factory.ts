import { Injectable } from '@nestjs/common';
import { CreatePostDto } from 'modules/posts/application/dto/request/create-post.dto';
import { Post } from '../models/post';

import { Uid } from 'modules/common/domain/value-objects/uid';
import { MainCategory } from '../value-objects/main-category';
import { PublicTypeNo } from '../value-objects/public-type-no';
import { Expense } from '../value-objects/expense';
import { PhotoUrlList } from '../value-objects/photo-url-list';
import { UUID } from 'modules/common/domain/value-objects/uuid';

@Injectable()
export class PostsFactory {
  createModel(dto: CreatePostDto): Post {
    const postId = UUID.generate();
    const uid = Uid.create(dto.uid);
    const mainCategory = MainCategory.create(dto.mainCategory);
    const publicTypeNo = PublicTypeNo.create(dto.publicTypeNo);
    const expense = dto.expense
      ? Expense.create(parseInt(dto.expense, 10))
      : null;
    const photoUrl = dto.photoUrl ? PhotoUrlList.create(dto.photoUrl) : null;

    return new Post(
      postId,
      uid,
      null,
      null,
      mainCategory,
      false,
      publicTypeNo,
      null,
      dto.subCategory1,
      dto.subCategory2,
      dto.postText,
      photoUrl,
      expense,
      dto.location,
    );
  }
}
