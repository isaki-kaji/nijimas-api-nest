import { Uid } from 'modules/common/domain/value-objects/uid';
import { FollowInfo } from './models/follow-info';
import { PostInfo } from './models/post_info';
import { UserProfile } from './models/user-profile';
import { UserFavoriteSubcategoryList } from './models/user-favorite-subcategory-list';

export interface IUserDetailsRepository {
  getUserProfile(uid: Uid): Promise<UserProfile>;
  getFollowInfo(uid: Uid, followingUid: Uid): Promise<FollowInfo>;
  getPostInfo(uid: Uid): Promise<PostInfo>;
  // getUserFavoriteSubCategories(uid: Uid): Promise<UserFavoriteSubcategoryList>;
}
