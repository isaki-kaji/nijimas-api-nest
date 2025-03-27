import { PostResponseDto } from './dto/response/post.response.dto';

export interface IPostsQueryService {
  findOne(uid: string, postId: string): Promise<PostResponseDto | undefined>;
  findOwnPosts(
    uid: string,
    referencePostId?: string,
  ): Promise<PostResponseDto[]>;
  findTimelinePosts(
    uid: string,
    referencePostId?: string,
  ): Promise<PostResponseDto[]>;
  findFavoritePosts(
    uid: string,
    referencePostId?: string,
  ): Promise<PostResponseDto[]>;
  findPostsByUid(
    uid: string,
    targetUid: string,
    referencePostId?: string,
  ): Promise<PostResponseDto[]>;
  findPostsBySubCategory(
    uid: string,
    categoryName: string,
    referencePostId?: string,
  ): Promise<PostResponseDto[]>;
}
