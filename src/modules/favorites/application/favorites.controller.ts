import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { FavoritesUsecase } from './favorites.usecase';
import { ToggleFavoriteDto } from './dto/request/toggle-favorite.dto';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly usecase: FavoritesUsecase) {}

  @Post()
  async toggleFavorite(
    @Body() dto: ToggleFavoriteDto,
    @Res() res: Response,
  ): Promise<void> {
    const favoriteCreated = await this.usecase.toggleFavorite(dto);

    res
      .status(favoriteCreated ? HttpStatus.CREATED : HttpStatus.NO_CONTENT)
      .send();
  }
}
