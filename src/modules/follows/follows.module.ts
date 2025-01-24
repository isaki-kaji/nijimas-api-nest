import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowRequestEntity } from 'entities/follow-request.entity';
import { FollowEntity } from 'entities/follow.entity';
import { FollowRequestsRepository } from './infrastructure/follow-requests.repository';
import { FollowsRepository } from './infrastructure/follows.repository';
import { FollowRequestsService } from './domain/follow-requests.service';
import { FollowsService } from './domain/follows.service';
import { FollowRequestsUsecase } from './application/follow-requests.usecase';
import { FollowRequestsController } from './application/follow-requests.controller';
import { FollowRequestsFactory } from './application/factory/follow-requests.factory';

@Module({
  imports: [TypeOrmModule.forFeature([FollowRequestEntity, FollowEntity])],
  controllers: [FollowRequestsController],
  providers: [
    FollowRequestsUsecase,
    FollowRequestsService,
    FollowsService,
    FollowRequestsFactory,
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
