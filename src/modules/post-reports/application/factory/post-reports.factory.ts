import { Injectable } from '@nestjs/common';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { Uuid } from 'modules/common/domain/value-objects/uuid';
import { ReportPostDto } from '../dto/request/report-post.dto';
import { PostReport } from '../../domain/models/post-report';
import { createReasonType } from '../../domain/value-objects/reason-type';

@Injectable()
export class PostReportsFactory {
  createModel(reporterUid: string, dto: ReportPostDto): PostReport {
    const postReportsId = Uuid.generate();
    const reporterUidObj = Uid.create(reporterUid);
    const reasonType = createReasonType(dto.reasonType);

    return new PostReport(
      postReportsId.value,
      reporterUidObj,
      dto.postId,
      reasonType,
      dto.comment,
    );
  }
}
