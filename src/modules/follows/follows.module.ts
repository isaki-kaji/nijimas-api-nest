import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowRequestEntity } from 'entities/follow-request.entity';
import { FollowEntity } from 'entities/follow.entity';
import { FollowRequestsRepository } from './infrastructure/follow-requests.repository';
import { FollowsRepository } from './infrastructure/follows.repository';
import { FollowRequestsService } from './domain/follow-requests.service';
import { FollowsService } from './domain/follows.service';
import { FollowRequestsController } from './application/follow-requests.controller';
import { FollowRequestsFactory } from './application/factory/follow-requests.factory';
import { FollowsController } from './application/follows.controller';
import { FollowsUsecase } from './application/follows.usecase';
import { FollowsFactory } from './application/factory/follows.factory';
import { DoFollowRequestUsecase } from './application/do-follow-request.usecase';
import { CancelFollowRequestUsecase } from './application/cancel-follow-request.usecase';
import { GetFollowRequestsUsecase } from './application/follow-requests.usecase';
import { HandleFollowRequestUsecase } from './application/handle-follow-request.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([FollowRequestEntity, FollowEntity])],
  controllers: [FollowRequestsController, FollowsController],
  providers: [
    GetFollowRequestsUsecase,
    DoFollowRequestUsecase,
    CancelFollowRequestUsecase,
    HandleFollowRequestUsecase,
    FollowsUsecase,
    FollowRequestsService,
    FollowsService,
    FollowRequestsFactory,
    FollowsFactory,
    {
      provide: 'IFollowRequestsRepository',
      useClass: FollowRequestsRepository,
    },
    {
      provide: 'IFollowsRepository',
      useClass: FollowsRepository,
    },
  ],
  exports: [],
})
export class FollowsModule {}
