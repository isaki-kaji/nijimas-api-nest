import { Body, Controller, Post, Version } from '@nestjs/common';
import { OwnUid } from 'common/decorator/own-uid.decorator';
import { ReportPostDto } from './dto/request/report-post.dto';
import { ReportPostUseCase } from './report-post.usecase';

@Controller('post-reports')
export class PostReportsController {
  constructor(private readonly reportPostUseCase: ReportPostUseCase) {}

  @Post()
  @Version('1')
  async reportPost(
    @OwnUid() uid: string,
    @Body() dto: ReportPostDto,
  ): Promise<void> {
    await this.reportPostUseCase.execute(uid, dto);
  }
}
