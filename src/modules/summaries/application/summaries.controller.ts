import {
  Controller,
  Get,
  Param,
  ValidationPipe,
  Headers,
} from '@nestjs/common';
import { SummariesUseCase } from './summaries.usecase';
import { MonthlySummaryResponseDto } from './dto/response/monthly-summary.response.dto';
import { OwnUid } from 'common/decorator/own-uid.decorator';
import { SummaryParamsDto } from './dto/request/get-summary-params.dto';

@Controller('summaries')
export class SummariesController {
  constructor(private readonly summariesUseCase: SummariesUseCase) {}

  @Get(':year/:month')
  async getMonthlySummary(
    @OwnUid() uid: string,
    @Param(new ValidationPipe({ transform: true })) params: SummaryParamsDto,
    @Headers('Time-Zone') timezone?: string,
  ): Promise<MonthlySummaryResponseDto> {
    return await this.summariesUseCase.outputMonthlySummary(
      uid,
      String(params.year),
      String(params.month),
      timezone,
    );
  }
}
