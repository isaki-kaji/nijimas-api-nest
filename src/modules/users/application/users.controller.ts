import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersUsecase } from './users.usecase';
import { CreateUserDto } from './dto/request/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersUsecase: UsersUsecase) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    await this.usersUsecase.create(createUserDto);
  }

  @Get(':uid')
  async findByUid(@Param('uid') uid: string) {
    return await this.usersUsecase.findByUid(uid);
  }
}
