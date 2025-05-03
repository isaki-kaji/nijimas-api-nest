import { UserResponseDto } from './dto/response/user.response.dto';

export interface IUsersQueryService {
  getFollowers(uid: string): Promise<UserResponseDto[]>;
  getFollowings(uid: string): Promise<UserResponseDto[]>;
  getFavorites(postId: string): Promise<UserResponseDto[]>;
}
