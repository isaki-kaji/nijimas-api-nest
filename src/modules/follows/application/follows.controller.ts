import { Body, Controller, Delete, Version } from '@nestjs/common';
import { FollowDto } from './dto/request/follow-request.dto';
import { FollowsUsecase } from './follows.usecase';

@Controller('follows')
export class FollowsController {
  constructor(private readonly usecase: FollowsUsecase) {}

  @Delete()
  @Version('1')
  async cancelFollow(@Body() dto: FollowDto) {
    await this.usecase.cancelFollow(dto);
  }
}
