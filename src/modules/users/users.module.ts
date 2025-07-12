import { Module } from '@nestjs/common';
import { UsersUsecase } from './application/users.usecase';
import { DeleteUserUseCase } from './application/delete-user.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersController } from './application/users.controller';
import { UsersService } from './domain/users.service';
import { UsersFactory } from './application/factory/users.factory';
import { UsersQueryService } from './infrastructure/users.query.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [
    UsersUsecase,
    DeleteUserUseCase,
    UsersService,
    UsersFactory,
    {
      provide: 'IUsersRepository',
      useClass: UsersRepository,
    },
    {
      provide: 'IUsersQueryService',
      useClass: UsersQueryService,
    },
  ],
})
export class UsersModule {}
