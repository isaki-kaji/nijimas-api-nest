import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostReportEntity } from 'entities/post-report.entity';
import { PostReportsController } from './application/post-reports.controller';
import { ReportPostUseCase } from './application/report-post.usecase';
import { PostReportsFactory } from './application/factory/post-reports.factory';
import { PostReportsService } from './domain/post-reports.service';
import { PostReportsRepository } from './infrastructure/post-reports.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PostReportEntity])],
  controllers: [PostReportsController],
  providers: [
    ReportPostUseCase,
    PostReportsFactory,
    PostReportsService,
    {
      provide: 'IPostReportsRepository',
      useClass: PostReportsRepository,
    },
  ],
  exports: [PostReportsService],
})
export class PostReportsModule {}
