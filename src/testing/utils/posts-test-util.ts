import { faker } from '@faker-js/faker/.';
import { PostResponseDto } from 'posts/application/dto/response/post.response.dto';
import { genUid, genUUID } from './common-test-util';

export const genPostsResponseForUid = (uid: string): PostResponseDto[] => {
  const result: PostResponseDto[] = [];
  const count = faker.number.int({ min: 10, max: 20 });
  for (let i = 0; i < count; i++) {
    result.push({
      postId: genUUID(),
      uid,
      username: 'test-user',
      profileImageUrl: 'test.jpg',
      mainCategory: 'food',
      isFavorite: false,
      favoriteCount: 0,
      publicTypeNo: '1',
      createdAt: new Date(),
      subCategory1: 'test-sub-category1',
      subCategory2: 'test-sub-category2',
      postText: 'test-post-text',
      photoUrlList: ['test.jpg'],
      expense: 1000,
      location: 'test-location',
      version: 1,
    });
  }
  return result;
};

export const genPostsResponseForSubCategory = (
  categoryName: string,
): PostResponseDto[] => {
  const result: PostResponseDto[] = [];
  const count = faker.number.int({ min: 10, max: 20 });
  for (let i = 0; i < count; i++) {
    result.push({
      postId: genUUID(),
      uid: genUid(),
      username: 'test-user',
      profileImageUrl: 'test.jpg',
      mainCategory: 'food',
      isFavorite: false,
      favoriteCount: 0,
      publicTypeNo: '1',
      createdAt: new Date(),
      subCategory1: categoryName,
      subCategory2: undefined,
      postText: 'test-post-text',
      photoUrlList: ['test.jpg'],
      expense: 1000,
      location: 'test-location',
      version: 1,
    });
  }
  return result;
};
