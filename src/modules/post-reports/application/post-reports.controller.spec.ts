import { Test, TestingModule } from '@nestjs/testing';
import { PostReportsController } from './post-reports.controller';
import { ReportPostUseCase } from './report-post.usecase';
import { ReportPostDto } from './dto/request/report-post.dto';
import { mock } from 'jest-mock-extended';
import { genUid, genUUID } from 'testing/utils/common-test-util';
import { ReasonType } from '../domain/value-objects/reason-type';

describe('PostReportsController', () => {
  let controller: PostReportsController;
  const reportPostUseCase = mock<ReportPostUseCase>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostReportsController],
      providers: [{ provide: ReportPostUseCase, useValue: reportPostUseCase }],
    }).compile();

    controller = module.get<PostReportsController>(PostReportsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('reportPost', () => {
    it('should successfully report a post with comment', async () => {
      const uid = genUid();
      const dto: ReportPostDto = {
        postId: genUUID(),
        reasonType: ReasonType.SPAM,
        comment: 'This is spam content',
      };

      reportPostUseCase.execute.mockResolvedValue(undefined);

      await controller.reportPost(uid, dto);

      expect(reportPostUseCase.execute).toHaveBeenCalledWith(uid, dto);
    });

    it('should successfully report a post without comment', async () => {
      const uid = genUid();
      const dto: ReportPostDto = {
        postId: genUUID(),
        reasonType: ReasonType.INAPPROPRIATE,
      };

      reportPostUseCase.execute.mockResolvedValue(undefined);

      await controller.reportPost(uid, dto);

      expect(reportPostUseCase.execute).toHaveBeenCalledWith(uid, dto);
    });

    it('should handle different reason types', async () => {
      const uid = genUid();
      const postId = genUUID();

      const reasonTypes = [
        ReasonType.SPAM,
        ReasonType.INAPPROPRIATE,
        ReasonType.HARASSMENT,
        ReasonType.FALSE_INFO,
        ReasonType.OTHER,
      ];

      for (const reasonType of reasonTypes) {
        const dto: ReportPostDto = {
          postId,
          reasonType,
          comment: `Report for ${reasonType}`,
        };

        reportPostUseCase.execute.mockResolvedValue(undefined);

        await controller.reportPost(uid, dto);

        expect(reportPostUseCase.execute).toHaveBeenCalledWith(uid, dto);
      }

      expect(reportPostUseCase.execute).toHaveBeenCalledTimes(
        reasonTypes.length,
      );
    });

    it('should handle usecase errors', async () => {
      const uid = genUid();
      const dto: ReportPostDto = {
        postId: genUUID(),
        reasonType: ReasonType.HARASSMENT,
        comment: 'This is harassment',
      };

      const error = new Error('Internal server error');
      reportPostUseCase.execute.mockRejectedValue(error);

      await expect(controller.reportPost(uid, dto)).rejects.toThrow(
        'Internal server error',
      );

      expect(reportPostUseCase.execute).toHaveBeenCalledWith(uid, dto);
    });
  });
});
