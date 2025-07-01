import { Inject, Injectable } from '@nestjs/common';
import { PostReportsService } from '../domain/post-reports.service';
import { PostReportsFactory } from './factory/post-reports.factory';
import { IPostReportsRepository } from '../domain/i.post-reports.repository';
import { ReportPostDto } from './dto/request/report-post.dto';

@Injectable()
export class ReportPostUseCase {
  constructor(
    private readonly service: PostReportsService,
    private readonly factory: PostReportsFactory,
    @Inject('IPostReportsRepository')
    private readonly repository: IPostReportsRepository,
  ) {}

  async execute(reporterUid: string, dto: ReportPostDto): Promise<void> {
    const postReport = this.factory.createModel(reporterUid, dto);
    await this.repository.create(postReport);
  }
}
