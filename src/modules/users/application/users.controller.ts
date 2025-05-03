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

@Controller()
export class UsersController {
  constructor(
    private readonly usersUsecase: UsersUsecase,
    @Inject('IUsersQueryService')
    private readonly usersQueryService: IUsersQueryService,
  ) {}

  @Post('/users')
  async create(@Body() dto: CreateUserDto) {
    await this.usersUsecase.create(dto);
  }

  @Put('/users')
  async update(@Body() dto: UpdateUserDto) {
    await this.usersUsecase.update(dto);
  }

  @Get('/users/me')
  async getOwnUser(@OwnUid() uid: string) {
    return await this.usersUsecase.getOwnUser(uid);
  }

  @Get('/users/:uid/followers')
  async getFollowers(@Param('uid') uid: string) {
    return await this.usersQueryService.getFollowers(uid);
  }

  @Get('/users/:uid/followings')
  async getFollowings(@Param('uid') uid: string) {
    return await this.usersQueryService.getFollowings(uid);
  }

  @Get('/posts/:postId/favorites')
  async getPostFavorites(@Param('postId') postId: string) {
    return await this.usersQueryService.getFavorites(postId);
  }
}
