import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Version,
} from '@nestjs/common';
import { OwnUid } from 'common/decorator/own-uid.decorator';
import { FollowDto } from './dto/request/follow-request.dto';
import { DoFollowRequestUsecase } from './do-follow-request.usecase';
import { CancelFollowRequestUsecase } from './cancel-follow-request.usecase';
import { HandleFollowRequestUsecase } from './handle-follow-request.usecase';
import { GetFollowRequestsUsecase } from './get-follow-requests.usecase';

@Controller('follow-requests')
export class FollowRequestsController {
  constructor(
    private readonly doFollowRequestUsecase: DoFollowRequestUsecase,
    private readonly cancelFollowRequestUsecase: CancelFollowRequestUsecase,
    private readonly handleFollowRequestUsecase: HandleFollowRequestUsecase,
    private readonly getFollowRequestsUsecase: GetFollowRequestsUsecase,
  ) {}

  @Post()
  @Version('1')
  async doFollowRequest(@Body() dto: FollowDto) {
    await this.doFollowRequestUsecase.execute(dto);
  }

  @Delete('/:targetUid')
  @Version('1')
  async cancelFollowRequest(
    @OwnUid() uid: string,
    @Param('targetUid') targetUid: string,
  ) {
    await this.cancelFollowRequestUsecase.execute(uid, targetUid);
  }

  @Put('/:requestId')
  @Version('1')
  async handleFollowRequest(
    @OwnUid() uid: string,
    @Param('requestId') requestId: string,
    @Query('action') action: string,
  ) {
    await this.handleFollowRequestUsecase.execute(uid, requestId, action);
  }

  @Get()
  @Version('1')
  async getFollowRequests(@OwnUid() uid: string) {
    return this.getFollowRequestsUsecase.execute(uid);
  }
}
