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
      uid: userProfile.uid.getValue(),
      username: userProfile.username,
      selfIntro: userProfile.selfIntro ?? null,
      profileImageUrl: userProfile.profileImageUrl?.getValue() ?? null,
      followingCount: followInfo.followingCount.getValue(),
      followersCount: followInfo.followersCount.getValue(),
      followingStatus: followInfo.followingStatus.getValue(),
      postCount: postInfo.postCount.getValue(),
      userFavoriteSubcategories: categories.getList().map((category) => ({
        categoryNo: category.categoryNo.getValue(),
        categoryId: category.categoryId.getValue(),
        categoryName: category.categoryName,
      })),
    };
  }
}
