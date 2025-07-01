import { Inject, Injectable } from '@nestjs/common';
import { IPostReportsRepository } from './i.post-reports.repository';

@Injectable()
export class PostReportsService {
  constructor(
    @Inject('IPostReportsRepository')
    private readonly repository: IPostReportsRepository,
  ) {}

  // 投稿報告に関するビジネスロジックがあれば、ここに追加
  // 現在は単純な追加のみなので特にメソッドは不要
}
