import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FollowsService } from 'follows/domain/follows.service';
import { IFollowRequestsRepository } from 'follows/domain/i.follow-requests.repository';
import { IFollowsRepository } from 'follows/domain/i.follows.repository';
import { Follow } from 'follows/domain/models/follow';
import { FollowRequest } from 'follows/domain/models/follow-request';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { Uuid } from 'modules/common/domain/value-objects/uuid';
import { DataSource } from 'typeorm';

@Injectable()
export class HandleFollowRequestUsecase {
  constructor(
    private readonly dataSource: DataSource,
    private readonly followsService: FollowsService,
    @Inject('IFollowRequestsRepository')
    private readonly repository: IFollowRequestsRepository,
    @Inject('IFollowsRepository')
    private readonly followsRepository: IFollowsRepository,
  ) {}

  async execute(
    uidStr: string,
    requestIdStr: string,
    action: string,
  ): Promise<void> {
    const requestId = Uuid.create(requestIdStr);
    const request = await this.repository.findOne(requestId);
    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (!request.isForUser(Uid.create(uidStr))) {
      throw new BadRequestException('Invalid request');
    }

    if (action === 'accept') {
      await this.acceptFollowRequest(request);
      return;
    }
    if (action === 'reject') {
      await this.rejectFollowRequest(request);
      return;
    }

    throw new BadRequestException('Invalid action');
  }

  private async acceptFollowRequest(request: FollowRequest): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existsFollow = await this.followsService.exists(
        request.uid,
        request.requestedUid,
      );

      if (existsFollow) {
        throw new ConflictException('You already follow this user');
      }

      request.accept();
      await this.repository.save(request, queryRunner.manager);

      const follow = new Follow(request.uid, request.requestedUid);
      await this.followsRepository.save(follow, queryRunner.manager);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async rejectFollowRequest(request: FollowRequest): Promise<void> {
    request.reject();

    await this.repository.save(request);
  }
}
