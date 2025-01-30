import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../entities/user.entity';
import { IUsersRepository } from '../domain/i.users.repository';
import { Repository } from 'typeorm';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { User } from '../domain/models/user';
import { CountryCode } from 'users/domain/value-objects/country-code';
import { ImageUrl } from 'modules/common/domain/value-objects/image-url';

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

  async update(user: User) {
    const entity = this.toEntity(user);
    await this.userRepository.update({ uid: user.uid.getValue() }, entity);
  }

  async findByUid(uid: Uid): Promise<User | null> {
    const row = await this.userRepository.findOne({
      where: { uid: uid.value },
    });
    return row ? this.toModel(row) : null;
  }

  private toEntity(user: User): UserEntity {
    const entity = new UserEntity();
    entity.uid = user.uid.getValue();
    entity.username = user.username;
    entity.selfIntro = user.selfIntro ?? null;
    entity.profileImageUrl = user.profileImageUrl?.value ?? null;
    entity.countryCode = user.countryCode?.value ?? null;
    return entity;
  }

  private toModel(entity: UserEntity): User {
    const uid = Uid.create(entity.uid);
    const profileImageUrl = entity.profileImageUrl
      ? ImageUrl.create(entity.profileImageUrl)
      : null;
    const countryCode = entity.countryCode
      ? CountryCode.create(entity.countryCode)
      : null;
    return new User(
      uid,
      entity.username,
      entity.selfIntro,
      profileImageUrl,
      countryCode,
    );
  }
}
