import {
  Controller,
  Post,
  Body,
  Put,
  Get,
  Delete,
  Inject,
  Param,
  Version,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersUsecase } from './users.usecase';
import { DeleteUserUseCase } from './delete-user.usecase';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { OwnUid } from 'common/decorator/own-uid.decorator';
import { IUsersQueryService } from './i.users.query.service';

@Controller()
export class UsersController {
  constructor(
    private readonly usersUsecase: UsersUsecase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    @Inject('IUsersQueryService')
    private readonly usersQueryService: IUsersQueryService,
  ) {}

  @Post('/users')
  @Version('1')
  async create(@Body() dto: CreateUserDto) {
    await this.usersUsecase.create(dto);
  }

  @Put('/users')
  @Version('1')
  async update(@Body() dto: UpdateUserDto) {
    await this.usersUsecase.update(dto);
  }

  @Get('/users/me')
  @Version('1')
  async getOwnUser(@OwnUid() uid: string) {
    return await this.usersUsecase.getOwnUser(uid);
  }

  @Get('/users/:uid/followers')
  @Version('1')
  async getFollowers(@Param('uid') uid: string) {
    return await this.usersQueryService.getFollowers(uid);
  }

  @Get('/users/:uid/followings')
  @Version('1')
  async getFollowings(@Param('uid') uid: string) {
    return await this.usersQueryService.getFollowings(uid);
  }

  @Get('/posts/:postId/favorites')
  @Version('1')
  async getPostFavorites(@Param('postId') postId: string) {
    return await this.usersQueryService.getFavorites(postId);
  }

  @Delete('/users/me')
  @Version('1')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@OwnUid() uid: string) {
    await this.deleteUserUseCase.execute(uid);
  }
}
