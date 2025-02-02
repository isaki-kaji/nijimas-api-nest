import { Module } from '@nestjs/common';
import { SummariesService } from './domain/summaries.service';
import { SummariesUseCase } from './application/summaries.usecase';
import { SummariesController } from './application/summaries.controller';
import { SummariesRepository } from './infrastructure/summaries.repository';
import { SummariesFactory } from './application/factory/summaries.factory';

@Module({
  controllers: [SummariesController],
  providers: [
    SummariesUseCase,
    SummariesService,
    SummariesFactory,
    {
      provide: 'ISummariesRepository',
      useClass: SummariesRepository,
    },
  ],
  exports: [],
})
export class SummariesModule {}
