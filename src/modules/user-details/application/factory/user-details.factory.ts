import { FollowInfo } from 'modules/user-details/domain/models/follow-info';
import { PostInfo } from 'modules/user-details/domain/models/post_info';
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
      uid: userProfile.uid.value,
      username: userProfile.username,
      userCode: userProfile.userCode.value,
      selfIntro: userProfile.selfIntro ?? undefined,
      profileImageUrl: userProfile.profileImageUrl?.value ?? undefined,
      followingCount: followInfo.followingCount.value,
      followersCount: followInfo.followersCount.value,
      followingStatus: followInfo.followingStatus,
      postCount: postInfo.postCount.value,
      // userFavoriteSubcategories: categories.getList().map((category) => ({
      //   categoryNo: category.getCategoryNo().value,
      //   categoryId: category.getCategoryId().value,
      //   categoryName: category.getCategoryName(),
      // })),
    };
  }
}
