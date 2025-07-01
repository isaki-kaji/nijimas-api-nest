import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostReportsRepository } from './post-reports.repository';
import { PostReportEntity } from 'entities/post-report.entity';
import { PostReport } from '../domain/models/post-report';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { ReasonType } from '../domain/value-objects/reason-type';
import { genUid, genUUID } from 'testing/utils/common-test-util';
import { mock } from 'jest-mock-extended';

describe('PostReportsRepository', () => {
  let repository: PostReportsRepository;
  let mockTypeOrmRepository: jest.Mocked<Repository<PostReportEntity>>;

  beforeEach(async () => {
    const mockRepository = mock<Repository<PostReportEntity>>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostReportsRepository,
        {
          provide: getRepositoryToken(PostReportEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    repository = module.get<PostReportsRepository>(PostReportsRepository);
    mockTypeOrmRepository = module.get(getRepositoryToken(PostReportEntity));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a post report', async () => {
      const postReport = new PostReport(
        genUUID(),
        Uid.create(genUid()),
        genUUID(),
        ReasonType.SPAM,
        'This is spam content',
      );

      mockTypeOrmRepository.insert.mockResolvedValue({
        identifiers: [],
        generatedMaps: [],
        raw: [],
      });

      await repository.create(postReport);

      expect(mockTypeOrmRepository.insert).toHaveBeenCalledWith({
        postReportsId: postReport.postReportsId,
        reporterUid: postReport.reporterUid.value,
        postId: postReport.postId,
        reasonType: postReport.reasonType,
        comment: postReport.comment,
      });
    });

    it('should successfully create a post report without comment', async () => {
      const postReport = new PostReport(
        genUUID(),
        Uid.create(genUid()),
        genUUID(),
        ReasonType.INAPPROPRIATE,
        undefined,
      );

      mockTypeOrmRepository.insert.mockResolvedValue({
        identifiers: [],
        generatedMaps: [],
        raw: [],
      });

      await repository.create(postReport);

      expect(mockTypeOrmRepository.insert).toHaveBeenCalledWith({
        postReportsId: postReport.postReportsId,
        reporterUid: postReport.reporterUid.value,
        postId: postReport.postId,
        reasonType: postReport.reasonType,
        comment: undefined,
      });
    });

    it('should handle database errors', async () => {
      const postReport = new PostReport(
        genUUID(),
        Uid.create(genUid()),
        genUUID(),
        ReasonType.HARASSMENT,
        'This is harassment',
      );

      const dbError = new Error('Database connection failed');
      mockTypeOrmRepository.insert.mockRejectedValue(dbError);

      await expect(repository.create(postReport)).rejects.toThrow(
        'Database connection failed',
      );

      expect(mockTypeOrmRepository.insert).toHaveBeenCalledWith({
        postReportsId: postReport.postReportsId,
        reporterUid: postReport.reporterUid.value,
        postId: postReport.postId,
        reasonType: postReport.reasonType,
        comment: postReport.comment,
      });
    });
  });
});
