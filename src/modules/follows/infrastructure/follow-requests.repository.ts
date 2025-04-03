import { Injectable } from '@nestjs/common';
import { IFollowRequestsRepository } from '../domain/i.follow-requests.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { FollowRequestEntity } from 'entities/follow-request.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { FollowRequest } from '../domain/models/follow-request';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { Uuid } from 'modules/common/domain/value-objects/uuid';
import { FollowRequestRow } from './rows/follow-request.row';
import {
  createFollowRequestStatus,
  FollowRequestStatus,
} from 'follows/domain/value-objects/follow-request-status';

@Injectable()
export class FollowRequestsRepository implements IFollowRequestsRepository {
  constructor(
    @InjectRepository(FollowRequestEntity)
    private readonly repository: Repository<FollowRequestEntity>,
    private readonly dataSource: DataSource,
  ) {}
  async save(request: FollowRequest, manager?: EntityManager): Promise<void> {
    const entity = this.toEntity(request);
    manager
      ? await manager.getRepository(FollowRequestEntity).save(entity)
      : await this.repository.save(entity);
  }

  async delete(request: FollowRequest): Promise<void> {
    await this.repository.delete({
      requestId: request.requestId.value,
    });
  }

  async findOne(requestId: Uuid): Promise<FollowRequest | null> {
    const entity = await this.repository.findOne({
      where: { requestId: requestId.value },
    });
    return entity ? this.toModel(entity) : null;
  }

  async findPendingRequestByUid(
    uid: Uid,
    requestedUid: Uid,
  ): Promise<FollowRequest | null> {
    const entity = await this.repository.findOne({
      where: {
        uid: uid.value,
        followingUid: requestedUid.value,
        status: FollowRequestStatus.Pending,
      },
    });

    return entity ? this.toModel(entity) : null;
  }

  async findByUidWithUserInfo(uid: Uid): Promise<FollowRequestRow[]> {
    const sql = `
    SELECT
      fr.request_id AS "requestId",
      u.uid AS "uid",
      u.username AS "username",
      u.profile_image_url AS "profileImageUrl"
    FROM users u
    JOIN follow_requests fr
    ON u.uid = fr.uid
    WHERE fr.following_uid = $1 AND fr.status = '0';
  `;

    const rows = await this.dataSource.query(sql, [uid.value]);

    if (!rows || rows.length === 0) {
      return [];
    }

    return rows;
  }

  private toEntity(request: FollowRequest): FollowRequestEntity {
    const entity = new FollowRequestEntity();
    entity.requestId = request.requestId.value;
    entity.followingUid = request.requestedUid.value;
    entity.uid = request.uid.value;
    entity.status = request.status;
    return entity;
  }

  private toModel(entity: FollowRequestEntity): FollowRequest {
    const requestId = Uuid.create(entity.requestId);
    const uid = Uid.create(entity.uid);
    const followingUid = Uid.create(entity.followingUid);
    const status = entity.status;
    return new FollowRequest(
      requestId,
      uid,
      followingUid,
      createFollowRequestStatus(status),
      entity.version,
    );
  }
}
