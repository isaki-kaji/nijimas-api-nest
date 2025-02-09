import { PostResponseDto } from './dto/response/post.response.dto';

export interface IPostsQueryService {
  findOne(uid: string, postId: string): Promise<PostResponseDto | null>;
  findOwnPosts(uid: string): Promise<PostResponseDto[]>;
  findTimelinePosts(uid: string): Promise<PostResponseDto[]>;
  findPostsByUid(uid: string, targetUid: string): Promise<PostResponseDto[]>;
  findPostsBySubCategory(
    uid: string,
    categoryName: string,
  ): Promise<PostResponseDto[]>;
}
