import { Injectable } from '@nestjs/common';
import { CreatePostDto } from 'modules/posts/application/dto/request/create-post.dto';
import { Post } from '../../domain/models/post';

import { Uid } from 'modules/common/domain/value-objects/uid';
import { MainCategory } from '../../../common/domain/value-objects/main-category';
import { PublicTypeNo } from '../../domain/value-objects/public-type-no';
import { Expense } from '../../../common/domain/value-objects/expense';
import { PhotoUrlList } from '../../domain/value-objects/photo-url-list';
import { Uuid } from 'modules/common/domain/value-objects/uuid';
import { PostResponseDto } from '../dto/response/post.response.dto';

@Injectable()
export class PostsFactory {
  createModel(dto: CreatePostDto): Post {
    const postId = Uuid.create(dto.postId);
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
      null,
      publicTypeNo,
      new Date(),
      dto.subCategory1,
      dto.subCategory2,
      dto.postText,
      photoUrl,
      expense,
      dto.location,
    );
  }

  createResponse(post: Post): PostResponseDto {
    return {
      postId: post.getPostId().getValue(),
      uid: post.getUid().getValue(),
      username: post.getUsername(),
      profileImageUrl: post.getProfileImageUrl()?.value ?? null,
      mainCategory: post.getMainCategory().getValue(),
      subCategory1: post.getSubCategory1() ?? null,
      subCategory2: post.getSubCategory2() ?? null,
      postText: post.getPostText() ?? null,
      photoUrlList: post.getPhotoUrlList()
        ? post.getPhotoUrlList().getListValue()
        : [],
      expense: post.getExpense ? post.getExpense().getValue() : null,
      location: post.getLocation() ?? null,
      createdAt: post.getCreatedAt(),
      isFavorite: post.getIsFavorite(),
      publicTypeNo: post.getPublicTypeNo().getValue(),
    };
  }

  createResponseList(posts: Post[]): PostResponseDto[] {
    return posts.map((post) => this.createResponse(post));
  }
}
