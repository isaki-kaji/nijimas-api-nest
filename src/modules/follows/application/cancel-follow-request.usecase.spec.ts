import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CancelFollowRequestUsecase } from './cancel-follow-request.usecase';
import { FollowsService } from 'follows/domain/follows.service';
import { IFollowRequestsRepository } from 'follows/domain/i.follow-requests.repository';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { mock } from 'jest-mock-extended';
import { genUid } from 'testing/utils/common-test-util';
import { FollowRequest } from 'follows/domain/models/follow-request';

describe('CancelFollowRequestUsecase', () => {
  let usecase: CancelFollowRequestUsecase;
  const followsService = mock<FollowsService>();
  const followRequestsRepository = mock<IFollowRequestsRepository>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CancelFollowRequestUsecase,
        { provide: FollowsService, useValue: followsService },
        {
          provide: 'IFollowRequestsRepository',
          useValue: followRequestsRepository,
        },
      ],
    }).compile();

    usecase = module.get<CancelFollowRequestUsecase>(
      CancelFollowRequestUsecase,
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  describe('execute', () => {
    it('should throw ConflictException if user already follows the target user', async () => {
      const uidStr = genUid();
      const targetUidStr = genUid();
      const uid = Uid.create(uidStr);
      const requestedUid = Uid.create(targetUidStr);

      followsService.exists.mockResolvedValueOnce(true);

      await expect(usecase.execute(uidStr, targetUidStr)).rejects.toThrow(
        new ConflictException('You already follow this user'),
      );

      expect(followsService.exists).toHaveBeenCalledWith(uid, requestedUid);
      expect(
        followRequestsRepository.findPendingRequestByUid,
      ).not.toHaveBeenCalled();
      expect(followRequestsRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if follow request does not exist', async () => {
      const uidStr = genUid();
      const targetUidStr = genUid();
      const uid = Uid.create(uidStr);
      const requestedUid = Uid.create(targetUidStr);

      followsService.exists.mockResolvedValueOnce(false);
      followRequestsRepository.findPendingRequestByUid.mockResolvedValueOnce(
        null,
      );

      await expect(usecase.execute(uidStr, targetUidStr)).rejects.toThrow(
        new NotFoundException('Request not found'),
      );

      expect(followsService.exists).toHaveBeenCalledWith(uid, requestedUid);
      expect(
        followRequestsRepository.findPendingRequestByUid,
      ).toHaveBeenCalledWith(uid, requestedUid);
      expect(followRequestsRepository.delete).not.toHaveBeenCalled();
    });

    it('should delete follow request if it exists and user does not follow the target user', async () => {
      const uidStr = genUid();
      const targetUidStr = genUid();
      const uid = Uid.create(uidStr);
      const requestedUid = Uid.create(targetUidStr);
      const followRequest = mock<FollowRequest>();

      followsService.exists.mockResolvedValueOnce(false);
      followRequestsRepository.findPendingRequestByUid.mockResolvedValueOnce(
        followRequest,
      );

      await usecase.execute(uidStr, targetUidStr);

      expect(followsService.exists).toHaveBeenCalledWith(uid, requestedUid);
      expect(
        followRequestsRepository.findPendingRequestByUid,
      ).toHaveBeenCalledWith(uid, requestedUid);
      expect(followRequestsRepository.delete).toHaveBeenCalledWith(
        followRequest,
      );
    });
  });
});
