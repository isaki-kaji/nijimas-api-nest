import { Test, TestingModule } from '@nestjs/testing';
import { ReportPostUseCase } from './report-post.usecase';
import { PostReportsService } from '../domain/post-reports.service';
import { PostReportsFactory } from './factory/post-reports.factory';
import { IPostReportsRepository } from '../domain/i.post-reports.repository';
import { ReportPostDto } from './dto/request/report-post.dto';
import { mock } from 'jest-mock-extended';
import { genUid, genUUID } from 'testing/utils/common-test-util';
import { PostReport } from '../domain/models/post-report';
import { ReasonType } from '../domain/value-objects/reason-type';
import { Uid } from 'modules/common/domain/value-objects/uid';

describe('ReportPostUseCase', () => {
  let usecase: ReportPostUseCase;
  const postReportsService = mock<PostReportsService>();
  const postReportsFactory = mock<PostReportsFactory>();
  const postReportsRepository = mock<IPostReportsRepository>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportPostUseCase,
        { provide: PostReportsService, useValue: postReportsService },
        { provide: PostReportsFactory, useValue: postReportsFactory },
        {
          provide: 'IPostReportsRepository',
          useValue: postReportsRepository,
        },
      ],
    }).compile();

    usecase = module.get<ReportPostUseCase>(ReportPostUseCase);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  describe('execute', () => {
    it('should successfully create a post report', async () => {
      const reporterUid = genUid();
      const dto: ReportPostDto = {
        postId: genUUID(),
        reasonType: ReasonType.SPAM,
        comment: 'This is spam content',
      };

      const mockPostReport = new PostReport(
        genUUID(),
        Uid.create(reporterUid),
        dto.postId,
        ReasonType.SPAM,
        dto.comment,
      );

      postReportsFactory.createModel.mockReturnValue(mockPostReport);
      postReportsRepository.create.mockResolvedValue(undefined);

      await usecase.execute(reporterUid, dto);

      expect(postReportsFactory.createModel).toHaveBeenCalledWith(
        reporterUid,
        dto,
      );
      expect(postReportsRepository.create).toHaveBeenCalledWith(mockPostReport);
    });

    it('should successfully create a post report without comment', async () => {
      const reporterUid = genUid();
      const dto: ReportPostDto = {
        postId: genUUID(),
        reasonType: ReasonType.INAPPROPRIATE,
      };

      const mockPostReport = new PostReport(
        genUUID(),
        Uid.create(reporterUid),
        dto.postId,
        ReasonType.INAPPROPRIATE,
        undefined,
      );

      postReportsFactory.createModel.mockReturnValue(mockPostReport);
      postReportsRepository.create.mockResolvedValue(undefined);

      await usecase.execute(reporterUid, dto);

      expect(postReportsFactory.createModel).toHaveBeenCalledWith(
        reporterUid,
        dto,
      );
      expect(postReportsRepository.create).toHaveBeenCalledWith(mockPostReport);
    });

    it('should handle repository errors', async () => {
      const reporterUid = genUid();
      const dto: ReportPostDto = {
        postId: genUUID(),
        reasonType: ReasonType.HARASSMENT,
        comment: 'This is harassment',
      };

      const mockPostReport = new PostReport(
        genUUID(),
        Uid.create(reporterUid),
        dto.postId,
        ReasonType.HARASSMENT,
        dto.comment,
      );

      postReportsFactory.createModel.mockReturnValue(mockPostReport);
      postReportsRepository.create.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(usecase.execute(reporterUid, dto)).rejects.toThrow(
        'Database error',
      );

      expect(postReportsFactory.createModel).toHaveBeenCalledWith(
        reporterUid,
        dto,
      );
      expect(postReportsRepository.create).toHaveBeenCalledWith(mockPostReport);
    });
  });
});
