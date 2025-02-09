import { Controller, Post, Body, Put, Get } from '@nestjs/common';
import { UsersUsecase } from './users.usecase';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { OwnUid } from 'common/decorator/own-uid.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersUsecase: UsersUsecase) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    await this.usersUsecase.create(dto);
  }

  @Put()
  async update(@Body() dto: UpdateUserDto) {
    console.log('dto', dto);
    await this.usersUsecase.update(dto);
  }

  @Get('me')
  async getOwnUser(@OwnUid() uid: string) {
    return await this.usersUsecase.getOwnUser(uid);
  }
}
