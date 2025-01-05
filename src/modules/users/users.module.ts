import { Module } from '@nestjs/common';
import { UsersUsecase } from './application/users.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersController } from './application/users.controller';
import { UsersDomainService } from './domain/users.service';
import { UserFactory } from './domain/factory/user.factory';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [
    UsersUsecase,
    UsersDomainService,
    UserFactory,
    {
      provide: 'IUsersRepository',
      useClass: UsersRepository,
    },
  ],
})
export class UsersModule {}
