import { Inject } from '@nestjs/common';
import { IUserDetailsRepository } from '../domain/i.user-details.repository';
import { UserDetailResponseDto } from './dto/response/user-detail.response.dto';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { UserDetailsFactory } from './factory/user-details.factory';

export class UserDetailsUsecase {
  constructor(
    private readonly factory: UserDetailsFactory,
    @Inject('IUserDetailsRepository')
    private readonly repository: IUserDetailsRepository,
  ) {}

  async getUserDetails(
    uidStr: string,
    targetUidStr: string,
  ): Promise<UserDetailResponseDto> {
    const uid = Uid.create(uidStr);
    const targetUid = Uid.create(targetUidStr);

    const userProfile = await this.repository.getUserProfile(targetUid);
    const followInfo = await this.repository.getFollowInfo(uid, targetUid);
    const postInfo = await this.repository.getPostInfo(targetUid);
    const categories =
      await this.repository.getUserFavoriteSubCategories(targetUid);

    return this.factory.createResponse(
      userProfile,
      followInfo,
      postInfo,
      categories,
    );
  }
}
