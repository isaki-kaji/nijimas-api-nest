import { Test, TestingModule } from '@nestjs/testing';
import { PostReportsFactory } from './post-reports.factory';
import { ReportPostDto } from '../dto/request/report-post.dto';
import { genUid, genUUID } from 'testing/utils/common-test-util';
import { ReasonType } from '../../domain/value-objects/reason-type';

// Uuidのモック
jest.mock('modules/common/domain/value-objects/uuid', () => ({
  Uuid: {
    generate: () => ({ value: genUUID() }),
  },
}));

describe('PostReportsFactory', () => {
  let factory: PostReportsFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostReportsFactory],
    }).compile();

    factory = module.get<PostReportsFactory>(PostReportsFactory);
  });

  it('should be defined', () => {
    expect(factory).toBeDefined();
  });

  describe('createModel', () => {
    it('should create PostReport model with all fields', () => {
      const reporterUid = genUid();
      const dto: ReportPostDto = {
        postId: genUUID(),
        reasonType: ReasonType.SPAM,
        comment: 'This is spam content',
      };

      const result = factory.createModel(reporterUid, dto);

      expect(result.postReportsId).toBeDefined();
      expect(typeof result.postReportsId).toBe('string');
      expect(result.reporterUid.value).toBe(reporterUid);
      expect(result.postId).toBe(dto.postId);
      expect(result.reasonType).toBe(ReasonType.SPAM);
      expect(result.comment).toBe(dto.comment);
    });

    it('should create PostReport model without comment', () => {
      const reporterUid = genUid();
      const dto: ReportPostDto = {
        postId: genUUID(),
        reasonType: ReasonType.INAPPROPRIATE,
      };

      const result = factory.createModel(reporterUid, dto);

      expect(result.postReportsId).toBeDefined();
      expect(typeof result.postReportsId).toBe('string');
      expect(result.reporterUid.value).toBe(reporterUid);
      expect(result.postId).toBe(dto.postId);
      expect(result.reasonType).toBe(ReasonType.INAPPROPRIATE);
      expect(result.comment).toBeUndefined();
    });

    it('should create PostReport model with different reason types', () => {
      const reporterUid = genUid();
      const postId = genUUID();

      const reasonTypes = [
        ReasonType.SPAM,
        ReasonType.INAPPROPRIATE,
        ReasonType.HARASSMENT,
        ReasonType.FALSE_INFO,
        ReasonType.OTHER,
      ];

      reasonTypes.forEach((reasonType) => {
        const dto: ReportPostDto = {
          postId,
          reasonType,
        };

        const result = factory.createModel(reporterUid, dto);

        expect(result.reasonType).toBe(reasonType);
      });
    });
  });
});
