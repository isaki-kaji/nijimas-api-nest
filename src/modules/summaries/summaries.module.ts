import { Module } from '@nestjs/common';
import { SummariesService } from './domain/summaries.service';
import { SummariesUseCase } from './application/summaries.usecase';

@Module({
  controllers: [],
  providers: [
    SummariesUseCase,
    SummariesService,
    {
      provide: 'ISummariesRepository',
      useClass: null,
    },
  ],
  exports: [],
})
export class SummariesModule {}
