import { Module } from '@nestjs/common';
import { UsersUsecase } from './application/users.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersController } from './application/users.controller';
import { UsersService } from './domain/users.service';
import { UsersFactory } from './application/factory/users.factory';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [
    UsersUsecase,
    UsersService,
    UsersFactory,
    {
      provide: 'IUsersRepository',
      useClass: UsersRepository,
    },
  ],
})
export class UsersModule {}
