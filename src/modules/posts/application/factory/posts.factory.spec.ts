import { PostsFactory } from './posts.factory';
import { Post } from 'posts/domain/models/post';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { Uuid } from 'modules/common/domain/value-objects/uuid';
import { CreatePostDto } from '../dto/request/create-post.dto';
import { genUid, genUUID } from 'testing/utils/common-test-util';
import { createPublicTypeNo } from 'posts/domain/value-objects/public-type-no';
import { UpdatePostDto } from '../dto/request/update-post.dto';

describe('PostsFactory', () => {
  let factory: PostsFactory;

  beforeEach(() => {
    factory = new PostsFactory();
  });

  describe('createModelFromCreateDto', () => {
    it('should create a Post model from CreatePostDto', () => {
      const dto: CreatePostDto = {
        postId: genUUID(),
        uid: genUid(),
        mainCategory: 'food',
        publicTypeNo: '1',
        subCategories: ['sub1', 'sub2'],
        postText: 'Some post text',
        photoUrl:
          'http://example.com/photo1.jpg , http://example.com/photo2.jpg',
        expense: '100',
      };

      const post = factory.createModelFromCreateDto(dto);

      expect(post).toBeInstanceOf(Post);
      expect(post.postId).toEqual(Uuid.create(dto.postId));
      expect(post.uid).toEqual(Uid.create(dto.uid));
      expect(post.mainCategory).toEqual(dto.mainCategory);
      expect(post.publicTypeNo).toEqual(createPublicTypeNo(dto.publicTypeNo));
      expect(post.subCategories).toEqual(dto.subCategories);
      expect(post.postText).toBe(dto.postText);
      expect(post.photoUrlList?.strValue).toEqual(dto.photoUrl);
      expect(post.expense?.value).toBe(parseInt(dto.expense, 10));
      expect(post.location).toBe(dto.location);
    });

    describe('createModelFromUpdateDto', () => {
      it('should create a Post model from UpdatePostDto', () => {
        const dto: UpdatePostDto = {
          uid: genUid(),
          mainCategory: 'fashion',
          publicTypeNo: '1',
          subCategories: ['sub1', 'sub2'],
          postText: 'Updated post text',
          photoUrl: 'http://example.com/photo1.jpg',
          expense: '200',
          version: 2,
        };

        const postIdStr = genUUID();
        const post = factory.createModelFromUpdateDto(dto, postIdStr);

        expect(post).toBeInstanceOf(Post);
        expect(post.postId).toEqual(Uuid.create(postIdStr));
        expect(post.uid).toEqual(Uid.create(dto.uid));
        expect(post.mainCategory).toEqual(dto.mainCategory);
        expect(post.publicTypeNo).toEqual(createPublicTypeNo(dto.publicTypeNo));
        expect(post.subCategories).toEqual(dto.subCategories);
        expect(post.postText).toBe(dto.postText);
        expect(post.photoUrlList?.strValue).toEqual(dto.photoUrl);
        expect(post.expense?.value).toBe(parseInt(dto.expense!, 10));
        expect(post.location).toBe(dto.location);
        expect(post.version).toBe(dto.version);
      });
    });
  });
});
