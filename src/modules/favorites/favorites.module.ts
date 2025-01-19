import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteEntity } from 'entities/favorite.entity';
import { FavoritesRepository } from './infrastructure/favorites.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FavoriteEntity])],
  controllers: [],
  providers: [
    {
      provide: 'IFavoritesRepository',
      useClass: FavoritesRepository,
    },
  ],
})
export class FavoritesModule {}
