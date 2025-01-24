import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FollowsService } from '../domain/follows.service';
import { IFollowRequestsRepository } from '../domain/i.follow-requests.repository';
import { FollowRequestDto } from './dto/request/follow-request.dto';
import { FollowRequestsService } from '../domain/follow-requests.service';
import { FollowRequestsFactory } from './factory/follow-requests.factory';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { DataSource } from 'typeorm';
import { IFollowsRepository } from '../domain/i.follows.repository';
import { Follow } from '../domain/models/follow';
import { FollowRequestResponseDto } from './dto/response/follow-request.response.dto';

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

  async doFollowRequest(dto: FollowRequestDto): Promise<void> {
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

  async cancelFollowRequest(dto: FollowRequestDto): Promise<void> {
    const uid = Uid.create(dto.uid);
    const requestedUid = Uid.create(dto.requestedUid);

    const request = await this.repository.findOne(uid, requestedUid);
    if (!request) {
      throw new NotFoundException('Request not found');
    }

    await this.repository.delete(request);
  }

  async acceptFollowRequest(dto: FollowRequestDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const uid = Uid.create(dto.uid);
      const requestedUid = Uid.create(dto.requestedUid);

      const existsFollow = await this.followsService.exists(uid, requestedUid);

      if (existsFollow) {
        throw new ConflictException('You already follow this user');
      }

      const request = await this.repository.findOne(uid, requestedUid);
      if (!request) {
        throw new NotFoundException('Request not found');
      }
      request.accept();
      await this.repository.save(request);

      const follow = new Follow(uid, requestedUid);
      await this.followsRepository.save(follow);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async rejectFollowRequest(dto: FollowRequestDto): Promise<void> {
    const uid = Uid.create(dto.uid);
    const requestedUid = Uid.create(dto.requestedUid);

    const request = await this.repository.findOne(uid, requestedUid);
    if (!request) {
      throw new NotFoundException('Request not found');
    }

    request.reject();

    await this.repository.delete(request);
  }

  async getFollowRequests(uidStr: string): Promise<FollowRequestResponseDto[]> {
    const uid = Uid.create(uidStr);
    const requests = await this.repository.findByUidWithUserInfo(uid);

    return requests.map((request) => this.factory.createResponse(request));
  }
}
