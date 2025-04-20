import {
  Controller,
  Post,
  Body,
  Put,
  Get,
  Inject,
  Param,
} from '@nestjs/common';
import { UsersUsecase } from './users.usecase';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { OwnUid } from 'common/decorator/own-uid.decorator';
import { IUsersQueryService } from './i.users.query.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersUsecase: UsersUsecase,
    @Inject('IUsersQueryService')
    private readonly usersQueryService: IUsersQueryService,
  ) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    await this.usersUsecase.create(dto);
  }

  @Put()
  async update(@Body() dto: UpdateUserDto) {
    await this.usersUsecase.update(dto);
  }

  @Get('me')
  async getOwnUser(@OwnUid() uid: string) {
    return await this.usersUsecase.getOwnUser(uid);
  }

  @Get(':uid/followers')
  async getFollowers(@Param('uid') uid: string) {
    return await this.usersQueryService.getFollowers(uid);
  }
  @Get(':uid/followings')
  async getFollowings(@Param('uid') uid: string) {
    return await this.usersQueryService.getFollowings(uid);
  }
}
