import { Injectable } from '@nestjs/common';

import { Uid } from 'modules/common/domain/value-objects/uid';
import { UUID } from 'modules/common/domain/value-objects/uuid';
import { FollowRequestDto } from '../dto/request/follow-request.dto';
import { FollowRequest } from 'modules/follows/domain/models/follow-request';
import { FollowRequestStatus } from 'modules/follows/domain/value-objects/follow-request-status';
import { FollowRequestStatusEnum } from 'modules/follows/domain/enums/follow-request-status.enum';
import { FollowRequestResponseDto } from '../dto/response/follow-request.response.dto';
import { FollowRequestRow } from 'modules/follows/infrastructure/follow-request.row';

@Injectable()
export class FollowRequestsFactory {
  createModel(dto: FollowRequestDto): FollowRequest {
    const requestId = UUID.generate();
    const uid = Uid.create(dto.uid);
    const requestedUid = Uid.create(dto.requestedUid);
    const status = FollowRequestStatus.create(FollowRequestStatusEnum.PENDING);
    return new FollowRequest(requestId, uid, requestedUid, status);
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