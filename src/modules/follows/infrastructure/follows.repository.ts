import { Injectable } from '@nestjs/common';
import { IFollowsRepository } from '../domain/i.follows.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { FollowEntity } from 'entities/follow.entity';
import { EntityManager, Repository } from 'typeorm';
import { Follow } from '../domain/models/follow';
import { Uid } from 'modules/common/domain/value-objects/uid';

@Injectable()
export class FollowsRepository implements IFollowsRepository {
  constructor(
    @InjectRepository(FollowEntity)
    private readonly repository: Repository<FollowEntity>,
  ) {}
  async save(follow: Follow, manager?: EntityManager): Promise<void> {
    const entity = this.toEntity(follow);
    manager
      ? await manager.getRepository(FollowEntity).save(entity)
      : await this.repository.save(entity);
  }

  async delete(follow: Follow): Promise<void> {
    const entity = this.toEntity(follow);
    await this.repository.delete(entity);
  }

  async findOne(uid: Uid, followingUid: Uid): Promise<Follow | null> {
    const entity = await this.repository.findOne({
      where: { uid: uid.getValue(), followingUid: followingUid.getValue() },
    });
    return entity ? this.toModel(entity) : null;
  }

  private toEntity(follow: Follow): FollowEntity {
    const entity = new FollowEntity();
    entity.followingUid = follow.followingUid.getValue();
    entity.uid = follow.uid.getValue();
    return entity;
  }

  private toModel(entity: FollowEntity): Follow {
    const uid = Uid.create(entity.uid);
    const followingUid = Uid.create(entity.followingUid);
    return new Follow(uid, followingUid);
  }
}
