import { Controller, Post, Body } from '@nestjs/common';
import { UsersUsecase } from './users.usecase';
import { CreateUserDto } from './dto/request/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersUsecase: UsersUsecase) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    await this.usersUsecase.create(dto);
  }
}
