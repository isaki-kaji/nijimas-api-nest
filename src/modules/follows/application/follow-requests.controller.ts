import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { FollowRequestsUsecase } from './follow-requests.usecase';
import { OwnUid } from 'common/decorator/own-uid.decorator';
import { FollowRequestDto } from './dto/request/follow-request.dto';

@Controller('follow-requests')
export class FollowRequestsController {
  constructor(private readonly usecase: FollowRequestsUsecase) {}

  @Post()
  async doFollowRequest(@Body() dto: FollowRequestDto) {
    await this.usecase.doFollowRequest(dto);
  }

  @Delete()
  async cancelFollowRequest(@Body() dto: FollowRequestDto) {
    await this.usecase.cancelFollowRequest(dto);
  }

  @Put('/:requestId')
  async handleFollowRequest(
    @OwnUid() uid: string,
    @Param('requestId') requestId: string,
    @Query('action') action: string,
  ) {
    await this.usecase.handleFollowRequest(uid, requestId, action);
  }

  @Get()
  async getFollowRequests(@OwnUid() uid: string) {
    return await this.usecase.getFollowRequests(uid);
  }
}
