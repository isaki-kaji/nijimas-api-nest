import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../entities/user.entity';
import { IUsersRepository } from '../domain/i.users.repository';
import { Repository } from 'typeorm';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { User } from '../domain/models/user';
import { Url } from 'modules/common/domain/value-objects/url';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(user: User) {
    const entity = this.toEntity(user);
    await this.userRepository.save(entity);
  }

  async findByUid(uid: Uid): Promise<User | null> {
    const raw = await this.userRepository.findOne({
      where: { uid: uid.value },
    });
    return raw ? this.toDomain(raw) : null;
  }

  private toEntity(user: User): UserEntity {
    const entity = new UserEntity();
    entity.uid = user.uid.value;
    entity.username = user.username;
    entity.selfIntro = user.selfIntro ?? null;
    entity.profileImageUrl = user.profileImageUrl?.value ?? null;
    entity.countryCode = user.countryCode?.value ?? null;
    return entity;
  }

  private toDomain(entity: UserEntity): User {
    const uid = new Uid(entity.uid);
    const profileImageUrl = entity.profileImageUrl
      ? new Url(entity.profileImageUrl)
      : null;
    const countryCode = entity.countryCode ? new Uid(entity.countryCode) : null;
    return new User(
      uid,
      entity.username,
      entity.selfIntro,
      profileImageUrl,
      countryCode,
    );
  }
}
