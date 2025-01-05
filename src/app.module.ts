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

@Module({
  imports: [EnvModule, AppConfigModule, UsersModule],
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
