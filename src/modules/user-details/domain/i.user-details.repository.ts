import { Uid } from 'modules/common/domain/value-objects/uid';
import { PostInfo } from './models/post_info';
import { UserProfile } from './models/user-profile';
import { FollowingStatus } from './value-objects/following-status';
import { Count } from 'modules/common/domain/value-objects/count';

export interface IUserDetailsRepository {
  getUserProfile(uid: Uid): Promise<UserProfile>;
  getFollowingStatus(uid: Uid, followingUid: Uid): Promise<FollowingStatus>;
  getFollowersCount(uid: Uid): Promise<Count>;
  getFollowingCount(uid: Uid): Promise<Count>;
  getPostInfo(uid: Uid): Promise<PostInfo>;
  // getUserFavoriteSubCategories(uid: Uid): Promise<UserFavoriteSubcategoryList>;
}
