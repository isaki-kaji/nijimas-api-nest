import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../entities/user.entity';
import { IUsersRepository } from '../domain/i.users.repository';
import { Repository } from 'typeorm';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { User } from '../domain/models/user';
import { CountryCode } from 'users/domain/value-objects/country-code';
import { ImageUrl } from 'modules/common/domain/value-objects/image-url';
import { UCode } from 'modules/common/domain/value-objects/u-code';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async save(user: User) {
    const entity = this.toEntity(user);
    await this.userRepository.save(entity);
  }

  async findByUid(uid: Uid): Promise<User | undefined> {
    const row = await this.userRepository.findOne({
      where: { uid: uid.value },
    });
    return row ? this.toModel(row) : undefined;
  }

  private toEntity(user: User): UserEntity {
    const entity = new UserEntity();
    entity.uid = user.uid.value;
    entity.username = user.username;
    entity.userCode = user.userCode.value;
    entity.selfIntro = user.selfIntro ?? undefined;
    entity.profileImageUrl = user.profileImageUrl?.value ?? undefined;
    entity.countryCode = user.countryCode?.value ?? undefined;
    return entity;
  }

  private toModel(entity: UserEntity): User {
    const uid = Uid.create(entity.uid);
    const userCode = UCode.create(entity.userCode);
    const profileImageUrl = entity.profileImageUrl
      ? ImageUrl.create(entity.profileImageUrl)
      : undefined;
    const countryCode = entity.countryCode
      ? CountryCode.create(entity.countryCode)
      : undefined;
    return new User(
      uid,
      entity.username,
      userCode,
      entity.version,
      entity.selfIntro,
      profileImageUrl,
      countryCode,
    );
  }
}
