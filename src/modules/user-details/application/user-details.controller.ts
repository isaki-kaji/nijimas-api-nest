import { Controller, Get, Param } from '@nestjs/common';
import { UserDetailsUsecase } from './user-details.usecase';
import { OwnUid } from 'common/decorator/own-uid.decorator';
import { UserDetailResponseDto } from './dto/response/user-detail.response.dto';

@Controller()
export class UserDetailsController {
  constructor(private readonly usecase: UserDetailsUsecase) {}

  @Get('users/:uid')
  async getUserDetails(
    @OwnUid() uid: string,
    @Param('uid') targetUid: string,
  ): Promise<UserDetailResponseDto> {
    return await this.usecase.getUserDetails(uid, targetUid);
  }
}
