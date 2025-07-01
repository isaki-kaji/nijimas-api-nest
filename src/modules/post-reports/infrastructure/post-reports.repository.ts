import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostReportEntity } from 'entities/post-report.entity';
import { IPostReportsRepository } from '../domain/i.post-reports.repository';
import { PostReport } from '../domain/models/post-report';

@Injectable()
export class PostReportsRepository implements IPostReportsRepository {
  constructor(
    @InjectRepository(PostReportEntity)
    private readonly postReportRepository: Repository<PostReportEntity>,
  ) {}

  async create(postReport: PostReport): Promise<void> {
    const entity = this.toEntity(postReport);
    await this.postReportRepository.insert(entity);
  }

  private toEntity(postReport: PostReport): PostReportEntity {
    const entity = new PostReportEntity();
    entity.postReportsId = postReport.postReportsId;
    entity.reporterUid = postReport.reporterUid.value;
    entity.postId = postReport.postId;
    entity.reasonType = postReport.reasonType;
    entity.comment = postReport.comment;
    return entity;
  }
}
