import { Injectable } from '@nestjs/common';
import { FollowDto } from '../dto/request/follow-request.dto';
import { Follow } from 'modules/follows/domain/models/follow';
import { Uid } from 'modules/common/domain/value-objects/uid';

@Injectable()
export class FollowsFactory {
  createModel(dto: FollowDto): Follow {
    const uid = Uid.create(dto.uid);
    const followingUid = Uid.create(dto.targetUid);
    return new Follow(uid, followingUid);
  }
}
