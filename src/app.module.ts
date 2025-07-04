import { Module, ValidationPipe } from '@nestjs/common';
import { EnvModule } from 'env/env.module';
import { AppConfigModule } from 'config/app-config.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AuthGuard } from 'common/guard/auth.guard';
import { UidInterceptor } from 'common/interceptor/uid.interceptor';
import { LoggingInterceptor } from 'common/interceptor/logging.interceptor';
import { VALIDATION_PIPE_OPTIONS } from 'common/util/common.constants';
import { UsersModule } from 'users/users.module';
import { LoggingExceptionFilter } from 'common/filter/logging-exception.filter';
import { PostsModule } from 'modules/posts/posts.module';
import { FavoritesModule } from 'modules/favorites/favorites.module';
import { FollowsModule } from 'modules/follows/follows.module';
import { UserDetailsModule } from 'modules/user-details/user-details.module';
import { SummariesModule } from 'modules/summaries/summaries.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { UidThrottlerGuard } from 'common/guard/uid-throttler.guard';
import { UserBlocksModule } from 'modules/user-blocks/user-blocks.module';
import { PostReportsModule } from 'modules/post-reports/post-reports.module';

@Module({
  imports: [
    EnvModule,
    AppConfigModule,
    UsersModule,
    PostsModule,
    FavoritesModule,
    FollowsModule,
    UserDetailsModule,
    SummariesModule,
    UserBlocksModule,
    PostReportsModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 30,
        },
      ],
    }),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe(VALIDATION_PIPE_OPTIONS),
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: UidThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: UidInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: LoggingExceptionFilter,
    },
  ],
})
export class AppModule {}
