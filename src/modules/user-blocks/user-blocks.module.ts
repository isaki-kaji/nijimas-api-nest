import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBlockEntity } from 'entities/user-block.entity';
import { UserBlocksController } from './application/user-blocks.controller';
import { BlockUserUseCase } from './application/block-user.usecase';
import { UnblockUserUseCase } from './application/unblock-user.usecase';
import { GetBlockedUsersUsecase } from './application/get-blocked-users.usecase';
import { UserBlocksFactory } from './application/factory/user-blocks.factory';
import { UserBlocksService } from './domain/user-blocks.service';
import { UserBlocksRepository } from './infrastructure/user-blocks.repository';
import { FollowsModule } from '../follows/follows.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserBlockEntity]), FollowsModule],
  controllers: [UserBlocksController],
  providers: [
    BlockUserUseCase,
    UnblockUserUseCase,
    GetBlockedUsersUsecase,
    UserBlocksFactory,
    UserBlocksService,
    {
      provide: 'IUserBlocksRepository',
      useClass: UserBlocksRepository,
    },
  ],
  exports: [UserBlocksService],
})
export class UserBlocksModule {}
