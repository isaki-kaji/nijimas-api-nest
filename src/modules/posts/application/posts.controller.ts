import { Controller, Post, Body } from '@nestjs/common';
import { CreatePostUsecase } from './create-post.usecase';
import { CreatePostDto } from './dto/request/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly createPostUsecase: CreatePostUsecase) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    await this.createPostUsecase.execute(createPostDto);
  }
}
