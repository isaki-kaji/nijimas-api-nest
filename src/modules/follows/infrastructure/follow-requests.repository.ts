import { Injectable } from '@nestjs/common';
import { IFollowRequestsRepository } from '../domain/i.follow-requests.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { FollowRequestEntity } from 'entities/follow-request.entity';
import { DataSource, Repository } from 'typeorm';
import { FollowRequest } from '../domain/models/follow-request';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { UUID } from 'modules/common/domain/value-objects/uuid';
import { FollowRequestStatus } from '../domain/value-objects/follow-request-status';
import { FollowRequestRow } from './follow-request.row';

@Injectable()
export class FollowRequestsRepository implements IFollowRequestsRepository {
  constructor(
    @InjectRepository(FollowRequestEntity)
    private readonly repository: Repository<FollowRequestEntity>,
    private readonly dataSource: DataSource,
  ) {}
  async save(request: FollowRequest): Promise<void> {
    const entity = this.toEntity(request);
    await this.repository.save(entity);
  }

  async delete(request: FollowRequest): Promise<void> {
    await this.repository.delete({ requestId: request.requestId.getValue() });
  }

  async findOne(uid: Uid, followingUid: Uid): Promise<FollowRequest | null> {
    const entity = await this.repository.findOne({
      where: { uid: uid.getValue(), followingUid: followingUid.getValue() },
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

    const rows = await this.dataSource.query(sql, [uid.getValue()]);

    if (!rows || rows.length === 0) {
      return [];
    }

    return rows;
  }

  private toEntity(request: FollowRequest): FollowRequestEntity {
    const entity = new FollowRequestEntity();
    entity.requestId = request.requestId.getValue();
    entity.followingUid = request.requestedUid.getValue();
    entity.uid = request.uid.getValue();
    entity.status = request.status.getValue();
    return entity;
  }

  private toModel(entity: FollowRequestEntity): FollowRequest {
    const requestId = UUID.create(entity.requestId);
    const uid = Uid.create(entity.uid);
    const followingUid = Uid.create(entity.followingUid);
    const status = FollowRequestStatus.create(entity.status);
    return new FollowRequest(requestId, uid, followingUid, status);
  }
}
