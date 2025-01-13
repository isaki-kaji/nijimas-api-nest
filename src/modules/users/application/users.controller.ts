import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersUsecase } from './users.usecase';
import { CreateUserDto } from './dto/request/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersUsecase: UsersUsecase) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    this.usersUsecase.create(createUserDto);
  }

  @Get(':uid')
  findByUid(@Param('uid') uid: string) {
    return this.usersUsecase.findByUid(uid);
  }
}
