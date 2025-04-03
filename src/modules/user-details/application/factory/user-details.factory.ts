import { FollowInfo } from 'modules/user-details/domain/models/follow-info';
import { PostInfo } from 'modules/user-details/domain/models/post_info';
import { UserFavoriteSubcategoryList } from 'modules/user-details/domain/models/user-favorite-subcategory-list';
import { UserProfile } from 'modules/user-details/domain/models/user-profile';
import { UserDetailResponseDto } from '../dto/response/user-detail.response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserDetailsFactory {
  createResponse(
    userProfile: UserProfile,
    followInfo: FollowInfo,
    postInfo: PostInfo,
    // categories: UserFavoriteSubcategoryList,
  ): UserDetailResponseDto {
    return {
      uid: userProfile.getUid().value,
      username: userProfile.getUsername(),
      selfIntro: userProfile.getSelfIntro() ?? undefined,
      profileImageUrl: userProfile.getProfileImageUrl()?.value ?? undefined,
      followingCount: followInfo.getFollowingCount().value,
      followersCount: followInfo.getFollowersCount().value,
      followingStatus: followInfo.getFollowingStatus().value,
      postCount: postInfo.getPostCount().value,
      // userFavoriteSubcategories: categories.getList().map((category) => ({
      //   categoryNo: category.getCategoryNo().value,
      //   categoryId: category.getCategoryId().value,
      //   categoryName: category.getCategoryName(),
      // })),
    };
  }
}
