import { Module } from '@nestjs/common';
import { UsersService } from './application/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersController } from './application/users.controller';
import { UsersDomainService } from './domain/users.domain.service';
import { UserFactory } from './domain/factory/user.factory';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersDomainService,
    UserFactory,
    {
      provide: 'IUsersRepository',
      useClass: UsersRepository,
    },
  ],
})
export class UsersModule {}
