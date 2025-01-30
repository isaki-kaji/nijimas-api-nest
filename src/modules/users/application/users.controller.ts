import { Controller, Post, Body, Put } from '@nestjs/common';
import { UsersUsecase } from './users.usecase';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersUsecase: UsersUsecase) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    await this.usersUsecase.create(dto);
  }

  @Put()
  async update(@Body() dto: UpdateUserDto) {
    await this.usersUsecase.update(dto);
  }
}
