import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, QueryRunner } from 'typeorm';
import { HandleFollowRequestUsecase } from './handle-follow-request.usecase';
import { FollowsService } from 'follows/domain/follows.service';
import { IFollowRequestsRepository } from 'follows/domain/i.follow-requests.repository';
import { IFollowsRepository } from 'follows/domain/i.follows.repository';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { mock } from 'jest-mock-extended';
import { genUid, genUUID } from 'testing/utils/common-test-util';
import { FollowRequest } from 'follows/domain/models/follow-request';
import { Follow } from 'follows/domain/models/follow';
import { Uuid } from 'modules/common/domain/value-objects/uuid';
import exp from 'constants';

describe('HandleFollowRequestUsecase', () => {
  let usecase: HandleFollowRequestUsecase;
  const dataSource = mock<DataSource>();
  const queryRunner = mock<QueryRunner>();
  const followsService = mock<FollowsService>();
  const followRequestsRepository = mock<IFollowRequestsRepository>();
  const followsRepository = mock<IFollowsRepository>();

  beforeEach(async () => {
    dataSource.createQueryRunner.mockReturnValue(queryRunner);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HandleFollowRequestUsecase,
        { provide: DataSource, useValue: dataSource },
        { provide: FollowsService, useValue: followsService },
        {
          provide: 'IFollowRequestsRepository',
          useValue: followRequestsRepository,
        },
        { provide: 'IFollowsRepository', useValue: followsRepository },
      ],
    }).compile();

    usecase = module.get<HandleFollowRequestUsecase>(
      HandleFollowRequestUsecase,
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  describe('execute', () => {
    it('should throw NotFoundException if follow request does not exist', async () => {
      const uidStr = genUid();
      const requestIdStr = genUUID();
      const requestId = Uuid.create(requestIdStr);

      followRequestsRepository.findOne.mockResolvedValueOnce(undefined);

      await expect(
        usecase.execute(uidStr, requestIdStr, 'accept'),
      ).rejects.toThrow(new NotFoundException('Request not found'));

      expect(followRequestsRepository.findOne).toHaveBeenCalledWith(requestId);
    });

    it('should throw BadRequestException if request is not for the user', async () => {
      const uidStr = genUid();
      const requestIdStr = genUUID();
      const requestId = Uuid.create(requestIdStr);
      const followRequest = mock<FollowRequest>();

      followRequestsRepository.findOne.mockResolvedValueOnce(followRequest);
      followRequest.isForUser.mockReturnValueOnce(false);

      await expect(
        usecase.execute(uidStr, requestIdStr, 'accept'),
      ).rejects.toThrow(new BadRequestException('Invalid request'));

      expect(followRequestsRepository.findOne).toHaveBeenCalledWith(requestId);
      expect(followRequest.isForUser).toHaveBeenCalledWith(Uid.create(uidStr));
    });

    it('should throw BadRequestException if action is invalid', async () => {
      const uidStr = genUid();
      const requestIdStr = genUUID();
      const requestId = Uuid.create(requestIdStr);
      const followRequest = mock<FollowRequest>();

      followRequestsRepository.findOne.mockResolvedValueOnce(followRequest);
      followRequest.isForUser.mockReturnValueOnce(true);

      await expect(
        usecase.execute(uidStr, requestIdStr, 'invalid_action'),
      ).rejects.toThrow(new BadRequestException('Invalid action'));

      expect(followRequestsRepository.findOne).toHaveBeenCalledWith(requestId);
      expect(followRequest.isForUser).toHaveBeenCalledWith(Uid.create(uidStr));
    });

    it('should throw ConflictException if follow already exists when accepting', async () => {
      const uidStr = genUid();
      const requestIdStr = genUUID();
      const requestId = Uuid.create(requestIdStr);
      const followRequest = mock<FollowRequest>();

      followRequestsRepository.findOne.mockResolvedValueOnce(followRequest);
      followRequest.isForUser.mockReturnValueOnce(true);
      followsService.exists.mockResolvedValueOnce(true);

      await expect(
        usecase.execute(uidStr, requestIdStr, 'accept'),
      ).rejects.toThrow(new ConflictException('You already follow this user'));

      expect(followRequestsRepository.findOne).toHaveBeenCalledWith(requestId);
      expect(followRequest.isForUser).toHaveBeenCalledWith(Uid.create(uidStr));
      expect(followsService.exists).toHaveBeenCalledWith(
        followRequest.getUid(),
        followRequest.getRequestedUid(),
      );
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).not.toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('should throw ConflictException if follow request already exists when rejecting', async () => {
      const uidStr = genUid();
      const requestIdStr = genUUID();
      const requestId = Uuid.create(requestIdStr);
      const followRequest = mock<FollowRequest>();

      followRequestsRepository.findOne.mockResolvedValueOnce(followRequest);
      followRequest.isForUser.mockReturnValueOnce(true);
      followsService.exists.mockResolvedValueOnce(false);
      followRequest.reject.mockReturnValueOnce();
      followRequestsRepository.save.mockResolvedValueOnce();

      await usecase.execute(uidStr, requestIdStr, 'reject');

      expect(followRequestsRepository.findOne).toHaveBeenCalledWith(requestId);
      expect(followRequest.isForUser).toHaveBeenCalledWith(Uid.create(uidStr));
      expect(followRequest.reject).toHaveBeenCalled();
      expect(followRequestsRepository.save).toHaveBeenCalledWith(followRequest);
    });

    it('should accept follow request and commit transaction', async () => {
      const uidStr = genUid();
      const requestIdStr = genUUID();
      const requestId = Uuid.create(requestIdStr);
      const followRequest = mock<FollowRequest>();

      followRequestsRepository.findOne.mockResolvedValueOnce(followRequest);
      followRequest.isForUser.mockReturnValueOnce(true);
      followsService.exists.mockResolvedValueOnce(false);
      followRequest.accept.mockReturnValueOnce();
      followsRepository.save.mockResolvedValueOnce();

      await usecase.execute(uidStr, requestIdStr, 'accept');

      expect(queryRunner.connect).toHaveBeenCalled();
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(followRequestsRepository.findOne).toHaveBeenCalledWith(requestId);
      expect(followRequest.isForUser).toHaveBeenCalledWith(Uid.create(uidStr));
      expect(followsService.exists).toHaveBeenCalledWith(
        followRequest.getUid(),
        followRequest.getRequestedUid(),
      );
      expect(followRequest.accept).toHaveBeenCalled();
      expect(followRequestsRepository.save).toHaveBeenCalledWith(
        followRequest,
        queryRunner.manager,
      );
      expect(followsRepository.save).toHaveBeenCalledWith(
        expect.any(Follow),
        queryRunner.manager,
      );
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });
  });
});
