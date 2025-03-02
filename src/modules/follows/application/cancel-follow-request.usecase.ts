import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FollowsService } from 'follows/domain/follows.service';
import { IFollowRequestsRepository } from 'follows/domain/i.follow-requests.repository';
import { Uid } from 'modules/common/domain/value-objects/uid';

@Injectable()
export class CancelFollowRequestUsecase {
  constructor(
    private readonly followsService: FollowsService,
    @Inject('IFollowRequestsRepository')
    private readonly repository: IFollowRequestsRepository,
  ) {}

  async execute(uidStr: string, targetUidStr: string): Promise<void> {
    const uid = Uid.create(uidStr);
    const requestedUid = Uid.create(targetUidStr);

    const existsFollow = await this.followsService.exists(uid, requestedUid);
    if (existsFollow) {
      throw new ConflictException('You already follow this user');
    }

    const request = await this.repository.findPendingRequestByUid(
      uid,
      requestedUid,
    );

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    await this.repository.delete(request);
  }
}
