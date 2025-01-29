import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FollowsService } from '../domain/follows.service';
import { IFollowRequestsRepository } from '../domain/i.follow-requests.repository';
import { FollowDto } from './dto/request/follow-request.dto';
import { FollowRequestsService } from '../domain/follow-requests.service';
import { FollowRequestsFactory } from './factory/follow-requests.factory';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { DataSource } from 'typeorm';
import { IFollowsRepository } from '../domain/i.follows.repository';
import { Follow } from '../domain/models/follow';
import { FollowRequestResponseDto } from './dto/response/follow-request.response.dto';
import { Uuid } from 'modules/common/domain/value-objects/uuid';
import { FollowRequest } from '../domain/models/follow-request';

@Injectable()
export class FollowRequestsUsecase {
  constructor(
    private readonly dataSource: DataSource,
    private readonly service: FollowRequestsService,
    private readonly followsService: FollowsService,
    private readonly factory: FollowRequestsFactory,
    @Inject('IFollowRequestsRepository')
    private readonly repository: IFollowRequestsRepository,
    @Inject('IFollowsRepository')
    private readonly followsRepository: IFollowsRepository,
  ) {}

  async doFollowRequest(dto: FollowDto): Promise<void> {
    const request = this.factory.createModel(dto);

    const existsFollow = await this.followsService.exists(
      request.uid,
      request.requestedUid,
    );

    if (existsFollow) {
      throw new ConflictException('You already follow this user');
    }

    const existsPendingRequest = await this.service.hasPendingRequest(
      request.uid,
      request.requestedUid,
    );

    if (existsPendingRequest) {
      throw new ConflictException('You already have a pending request');
    }

    await this.repository.save(request);
  }

  async cancelFollowRequest(dto: FollowDto): Promise<void> {
    const uid = Uid.create(dto.uid);
    const requestedUid = Uid.create(dto.targetUid);

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

  async handleFollowRequest(
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
      await this.repository.save(request);

      const follow = new Follow(request.uid, request.requestedUid);
      await this.followsRepository.save(follow);
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

  async getFollowRequests(uidStr: string): Promise<FollowRequestResponseDto[]> {
    const uid = Uid.create(uidStr);
    const requests = await this.repository.findByUidWithUserInfo(uid);

    return requests.map((request) => this.factory.createResponse(request));
  }
}
