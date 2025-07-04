import { Controller, Post, Body, Version } from '@nestjs/common';
import { FavoritesUsecase } from './favorites.usecase';
import { ToggleFavoriteDto } from './dto/request/toggle-favorite.dto';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly usecase: FavoritesUsecase) {}

  @Post()
  @Version('1')
  async toggleFavorite(@Body() dto: ToggleFavoriteDto): Promise<void> {
    await this.usecase.toggleFavorite(dto);
  }
}
