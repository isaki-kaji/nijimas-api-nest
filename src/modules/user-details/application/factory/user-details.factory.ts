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
    categories: UserFavoriteSubcategoryList,
  ): UserDetailResponseDto {
    return {
      uid: userProfile.getUid().getValue(),
      username: userProfile.getUsername(),
      selfIntro: userProfile.getSelfIntro() ?? undefined,
      profileImageUrl:
        userProfile.getProfileImageUrl()?.getValue() ?? undefined,
      followingCount: followInfo.getFollowingCount().getValue(),
      followersCount: followInfo.getFollowersCount().getValue(),
      followingStatus: followInfo.getFollowingStatus().getValue(),
      postCount: postInfo.getPostCount().getValue(),
      userFavoriteSubcategories: categories.getList().map((category) => ({
        categoryNo: category.getCategoryNo().getValue(),
        categoryId: category.getCategoryId().getValue(),
        categoryName: category.getCategoryName(),
      })),
    };
  }
}
