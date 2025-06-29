import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Version,
} from '@nestjs/common';
import { OwnUid } from 'common/decorator/own-uid.decorator';
import { BlockUserDto } from './dto/request/block-user.dto';
import { BlockUserUseCase } from './block-user.usecase';
import { UnblockUserUseCase } from './unblock-user.usecase';
import { GetBlockedUsersUsecase } from './get-blocked-users.usecase';
import { BlockedUserResponseDto } from './dto/response/blocked-user.response.dto';

@Controller('user-blocks')
export class UserBlocksController {
  constructor(
    private readonly blockUserUseCase: BlockUserUseCase,
    private readonly unblockUserUseCase: UnblockUserUseCase,
    private readonly getBlockedUsersUsecase: GetBlockedUsersUsecase,
  ) {}

  @Post()
  @Version('1')
  async blockUser(
    @OwnUid() uid: string,
    @Body() dto: BlockUserDto,
  ): Promise<void> {
    await this.blockUserUseCase.execute(uid, dto);
  }

  @Delete(':blockedUid')
  @Version('1')
  async unblockUser(
    @OwnUid() uid: string,
    @Param('blockedUid') blockedUid: string,
  ): Promise<void> {
    await this.unblockUserUseCase.execute(uid, blockedUid);
  }

  @Get()
  @Version('1')
  async getBlockedUsers(
    @OwnUid() uid: string,
  ): Promise<BlockedUserResponseDto[]> {
    return await this.getBlockedUsersUsecase.execute(uid);
  }
}
