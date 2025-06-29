import { Module } from '@nestjs/common';
import { UserDetailsRepository } from './infrastructure/user-details.repository';
import { UserDetailsUsecase } from './application/user-details.usecase';
import { UserDetailsFactory } from './application/factory/user-details.factory';
import { UserDetailsController } from './application/user-details.controller';
import { UserBlocksModule } from 'modules/user-blocks/user-blocks.module';

@Module({
  imports: [UserBlocksModule],
  controllers: [UserDetailsController],
  providers: [
    UserDetailsUsecase,
    UserDetailsFactory,
    {
      provide: 'IUserDetailsRepository',
      useClass: UserDetailsRepository,
    },
  ],
})
export class UserDetailsModule {}
