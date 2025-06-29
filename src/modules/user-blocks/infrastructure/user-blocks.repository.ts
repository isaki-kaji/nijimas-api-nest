import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserBlockEntity } from 'entities/user-block.entity';
import { IUserBlocksRepository } from '../domain/i.user-blocks.repository';
import { UserBlock } from '../domain/models/user-block';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { BlockedUserWithInfo } from '../domain/models/blocked-user-with-info';
import { ImageUrl } from 'modules/common/domain/value-objects/image-url';

@Injectable()
export class UserBlocksRepository implements IUserBlocksRepository {
  constructor(
    @InjectRepository(UserBlockEntity)
    private readonly userBlockRepository: Repository<UserBlockEntity>,
  ) {}

  async create(userBlock: UserBlock): Promise<void> {
    const entity = this.toEntity(userBlock);
    await this.userBlockRepository.insert(entity);
  }

  async delete(blockerUid: Uid, blockedUid: Uid): Promise<void> {
    await this.userBlockRepository.delete({
      blockerUid: blockerUid.value,
      blockedUid: blockedUid.value,
    });
  }

  async findBlockedUsers(uid: Uid): Promise<UserBlock[]> {
    const rows = await this.userBlockRepository.find({
      where: {
        blockerUid: uid.value,
      },
    });
    return rows.map((row) => this.toModel(row));
  }

  async exists(blockerUid: Uid, blockedUid: Uid): Promise<boolean> {
    const count = await this.userBlockRepository.count({
      where: {
        blockerUid: blockerUid.value,
        blockedUid: blockedUid.value,
      },
    });
    return count > 0;
  }

  async findBlockedUsersWithInfo(uid: Uid): Promise<BlockedUserWithInfo[]> {
    const rows = await this.userBlockRepository
      .createQueryBuilder('ub')
      .leftJoin('users', 'u', 'ub.blocked_uid = u.uid')
      .select([
        'ub.blocker_uid AS blocker_uid',
        'ub.blocked_uid AS blocked_uid',
        'u.username AS username',
        'u.profile_image_url AS profile_image_url',
      ])
      .where('ub.blocker_uid = :blockerUid', { blockerUid: uid.value })
      .getRawMany();

    return rows.map((row) => {
      const blockerUid = Uid.create(row.blocker_uid);
      const blockedUid = Uid.create(row.blocked_uid);
      const profileImageUrl = row.profile_image_url
        ? ImageUrl.create(row.profile_image_url)
        : undefined;

      return new BlockedUserWithInfo(
        blockerUid,
        blockedUid,
        row.username,
        profileImageUrl,
      );
    });
  }

  private toEntity(userBlock: UserBlock): UserBlockEntity {
    const entity = new UserBlockEntity();
    entity.blockerUid = userBlock.blockerUid.value;
    entity.blockedUid = userBlock.blockedUid.value;
    return entity;
  }

  private toModel(entity: UserBlockEntity): UserBlock {
    const blockerUid = Uid.create(entity.blockerUid);
    const blockedUid = Uid.create(entity.blockedUid);
    return new UserBlock(blockerUid, blockedUid);
  }
}
