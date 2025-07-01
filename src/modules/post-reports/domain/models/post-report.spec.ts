import { PostReport } from './post-report';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { ReasonType } from '../value-objects/reason-type';
import { genUid, genUUID } from 'testing/utils/common-test-util';

describe('PostReport', () => {
  const postReportsId = genUUID();
  const reporterUid = Uid.create(genUid());
  const postId = genUUID();
  const reasonType = ReasonType.SPAM;
  const comment = 'This is spam content';

  describe('constructor', () => {
    it('should create PostReport with all fields', () => {
      const postReport = new PostReport(
        postReportsId,
        reporterUid,
        postId,
        reasonType,
        comment,
      );

      expect(postReport.postReportsId).toBe(postReportsId);
      expect(postReport.reporterUid).toBe(reporterUid);
      expect(postReport.postId).toBe(postId);
      expect(postReport.reasonType).toBe(reasonType);
      expect(postReport.comment).toBe(comment);
    });

    it('should create PostReport without comment', () => {
      const postReport = new PostReport(
        postReportsId,
        reporterUid,
        postId,
        reasonType,
      );

      expect(postReport.postReportsId).toBe(postReportsId);
      expect(postReport.reporterUid).toBe(reporterUid);
      expect(postReport.postId).toBe(postId);
      expect(postReport.reasonType).toBe(reasonType);
      expect(postReport.comment).toBeUndefined();
    });
  });

  describe('getters', () => {
    it('should return correct values from getters', () => {
      const postReport = new PostReport(
        postReportsId,
        reporterUid,
        postId,
        reasonType,
        comment,
      );

      expect(postReport.postReportsId).toBe(postReportsId);
      expect(postReport.reporterUid.value).toBe(reporterUid.value);
      expect(postReport.postId).toBe(postId);
      expect(postReport.reasonType).toBe(reasonType);
      expect(postReport.comment).toBe(comment);
    });

    it('should handle different reason types', () => {
      const reasonTypes = [
        ReasonType.SPAM,
        ReasonType.INAPPROPRIATE,
        ReasonType.HARASSMENT,
        ReasonType.FALSE_INFO,
        ReasonType.OTHER,
      ];

      reasonTypes.forEach((type) => {
        const postReport = new PostReport(
          postReportsId,
          reporterUid,
          postId,
          type,
          comment,
        );

        expect(postReport.reasonType).toBe(type);
      });
    });
  });
});
