import { Test, TestingModule } from '@nestjs/testing';
import { FollowRequestsService } from './follow-requests.service';
import { mock, MockProxy } from 'jest-mock-extended';
import { IFollowRequestsRepository } from './i.follow-requests.repository';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { genUid } from 'testing/utils/common-test-util';

describe('FollowRequestsService', () => {
  let service: FollowRequestsService;
  let followRequestsRepository: MockProxy<IFollowRequestsRepository>;

  beforeEach(async () => {
    followRequestsRepository = mock<IFollowRequestsRepository>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowRequestsService,
        {
          provide: 'IFollowRequestsRepository',
          useValue: followRequestsRepository,
        },
      ],
    }).compile();

    service = module.get<FollowRequestsService>(FollowRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hasPendingRequest', () => {
    it('should return true if a pending follow request exists', async () => {
      const uid = Uid.create(genUid());
      const requestedUid = Uid.create(genUid());
      followRequestsRepository.findPendingRequestByUid.mockResolvedValueOnce(
        {} as any,
      );

      const result = await service.hasPendingRequest(uid, requestedUid);

      expect(
        followRequestsRepository.findPendingRequestByUid,
      ).toHaveBeenCalledWith(uid, requestedUid);
      expect(result).toBe(true);
    });

    it('should return false if no pending follow request exists', async () => {
      const uid = Uid.create(genUid());
      const requestedUid = Uid.create(genUid());
      followRequestsRepository.findPendingRequestByUid.mockResolvedValueOnce(
        null,
      );

      const result = await service.hasPendingRequest(uid, requestedUid);

      expect(
        followRequestsRepository.findPendingRequestByUid,
      ).toHaveBeenCalledWith(uid, requestedUid);
      expect(result).toBe(false);
    });
  });
});
