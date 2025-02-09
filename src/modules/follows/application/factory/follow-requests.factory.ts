import { Injectable } from '@nestjs/common';

import { Uid } from 'modules/common/domain/value-objects/uid';
import { Uuid } from 'modules/common/domain/value-objects/uuid';
import { FollowDto } from '../dto/request/follow-request.dto';
import { FollowRequest } from 'modules/follows/domain/models/follow-request';
import { FollowRequestStatus } from 'modules/follows/domain/value-objects/follow-request-status';
import { FollowRequestStatusEnum } from 'modules/follows/domain/enums/follow-request-status.enum';
import { FollowRequestResponseDto } from '../dto/response/follow-request.response.dto';
import { FollowRequestRow } from 'modules/follows/infrastructure/rows/follow-request.row';

@Injectable()
export class FollowRequestsFactory {
  createModel(dto: FollowDto): FollowRequest {
    const requestId = Uuid.generate();
    const uid = Uid.create(dto.uid);
    const requestedUid = Uid.create(dto.targetUid);
    const status = FollowRequestStatus.create(FollowRequestStatusEnum.PENDING);
    return new FollowRequest(requestId, uid, requestedUid, status, 1);
  }

  createResponse(request: FollowRequestRow): FollowRequestResponseDto {
    return {
      requestId: request.requestId,
      uid: request.uid,
      username: request.username,
      profileImageUrl: request.profileImageUrl,
    };
  }
}
