import { Module } from '@nestjs/common';
import { UsersService } from './application/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersController } from './application/users.controller';
import { UsersDomainService } from './domain/users.domain.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UsersDomainService, UsersRepository],
})
export class UsersModule {}
