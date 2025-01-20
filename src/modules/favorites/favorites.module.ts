import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteEntity } from 'entities/favorite.entity';
import { FavoritesRepository } from './infrastructure/favorites.repository';
import { FavoritesController } from './application/favorites.controller';
import { FavoritesUsecase } from './application/favorites.usecase';
import { FavoritesFactory } from './application/factory/favorites.factory';
import { FavoritesService } from './domain/favorites.service';
import { PostsModule } from 'modules/posts/posts.module';

@Module({
  imports: [TypeOrmModule.forFeature([FavoriteEntity]), PostsModule],
  controllers: [FavoritesController],
  providers: [
    FavoritesUsecase,
    FavoritesFactory,
    FavoritesService,
    {
      provide: 'IFavoritesRepository',
      useClass: FavoritesRepository,
    },
  ],
})
export class FavoritesModule {}
