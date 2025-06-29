import { Test, TestingModule } from '@nestjs/testing';
import { DoFollowRequestUsecase } from './do-follow-request.usecase';
import { FollowsService } from 'follows/domain/follows.service';
import { FollowRequestsService } from 'follows/domain/follow-requests.service';
import { FollowRequestsFactory } from './factory/follow-requests.factory';
import { IFollowRequestsRepository } from 'follows/domain/i.follow-requests.repository';
import { FollowDto } from './dto/request/follow-request.dto';
import { ConflictException, ForbiddenException } from '@nestjs/common';
import { mock } from 'jest-mock-extended';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { genUid } from 'testing/utils/common-test-util';
import { FollowRequest } from 'follows/domain/models/follow-request';
import { UserBlocksService } from '../../user-blocks/domain/user-blocks.service';

describe('DoFollowRequestUsecase', () => {
  let usecase: DoFollowRequestUsecase;
  const followsService = mock<FollowsService>();
  const followRequestsService = mock<FollowRequestsService>();
  const followRequestsFactory = mock<FollowRequestsFactory>();
  const followRequestsRepository = mock<IFollowRequestsRepository>();
  const userBlocksService = mock<UserBlocksService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoFollowRequestUsecase,
        { provide: FollowsService, useValue: followsService },
        { provide: FollowRequestsService, useValue: followRequestsService },
        { provide: FollowRequestsFactory, useValue: followRequestsFactory },
        { provide: UserBlocksService, useValue: userBlocksService },
        {
          provide: 'IFollowRequestsRepository',
          useValue: followRequestsRepository,
        },
      ],
    }).compile();

    usecase = module.get<DoFollowRequestUsecase>(DoFollowRequestUsecase);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  describe('execute', () => {
    it('should throw ConflictException if user already follows the target user', async () => {
      const dto: FollowDto = { uid: genUid(), targetUid: genUid() };
      const uid = Uid.create(dto.uid);
      const requestedUid = Uid.create(dto.targetUid);
      const followRequest = {
        get uid() {
          return uid;
        },
        get requestedUid() {
          return requestedUid;
        },
      } as FollowRequest;

      followRequestsFactory.createModel.mockReturnValue(followRequest);
      userBlocksService.exists.mockResolvedValue(false);
      followsService.exists.mockResolvedValue(true);

      await expect(usecase.execute(dto)).rejects.toThrow(
        new ConflictException('You already follow this user'),
      );

      expect(followRequestsFactory.createModel).toHaveBeenCalledWith(dto);
      expect(userBlocksService.exists).toHaveBeenCalledWith(requestedUid, uid);
      expect(followsService.exists).toHaveBeenCalledWith(uid, requestedUid);
      expect(followRequestsService.hasPendingRequest).not.toHaveBeenCalled();
      expect(followRequestsRepository.save).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if there is already a pending follow request', async () => {
      const dto: FollowDto = { uid: genUid(), targetUid: genUid() };
      const uid = Uid.create(dto.uid);
      const requestedUid = Uid.create(dto.targetUid);
      const followRequest = {
        get uid() {
          return uid;
        },
        get requestedUid() {
          return requestedUid;
        },
      } as FollowRequest;

      followRequestsFactory.createModel.mockReturnValue(followRequest);
      userBlocksService.exists.mockResolvedValue(false);
      followsService.exists.mockResolvedValue(false);
      followRequestsService.hasPendingRequest.mockResolvedValue(true);

      await expect(usecase.execute(dto)).rejects.toThrow(
        new ConflictException('You already have a pending request'),
      );

      expect(followRequestsFactory.createModel).toHaveBeenCalledWith(dto);
      expect(userBlocksService.exists).toHaveBeenCalledWith(requestedUid, uid);
      expect(followsService.exists).toHaveBeenCalledWith(uid, requestedUid);
      expect(followRequestsService.hasPendingRequest).toHaveBeenCalledWith(
        uid,
        requestedUid,
      );
      expect(followRequestsRepository.save).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user is blocked by target user', async () => {
      const dto: FollowDto = { uid: genUid(), targetUid: genUid() };
      const uid = Uid.create(dto.uid);
      const requestedUid = Uid.create(dto.targetUid);
      const followRequest = {
        get uid() {
          return uid;
        },
        get requestedUid() {
          return requestedUid;
        },
      } as FollowRequest;

      followRequestsFactory.createModel.mockReturnValue(followRequest);
      userBlocksService.exists.mockResolvedValue(true);

      await expect(usecase.execute(dto)).rejects.toThrow(
        new ForbiddenException(
          'Cannot follow this user because you have been blocked',
        ),
      );

      expect(followRequestsFactory.createModel).toHaveBeenCalledWith(dto);
      expect(userBlocksService.exists).toHaveBeenCalledWith(requestedUid, uid);
      expect(followsService.exists).not.toHaveBeenCalled();
      expect(followRequestsService.hasPendingRequest).not.toHaveBeenCalled();
      expect(followRequestsRepository.save).not.toHaveBeenCalled();
    });

    it('should save the follow request if no conflicts exist', async () => {
      const dto: FollowDto = { uid: genUid(), targetUid: genUid() };
      const uid = Uid.create(dto.uid);
      const requestedUid = Uid.create(dto.targetUid);
      const followRequest = {
        get uid() {
          return uid;
        },
        get requestedUid() {
          return requestedUid;
        },
      } as FollowRequest;

      followRequestsFactory.createModel.mockReturnValue(followRequest);
      userBlocksService.exists.mockResolvedValue(false);
      followsService.exists.mockResolvedValue(false);
      followRequestsService.hasPendingRequest.mockResolvedValue(false);

      await usecase.execute(dto);

      expect(followRequestsFactory.createModel).toHaveBeenCalledWith(dto);
      expect(userBlocksService.exists).toHaveBeenCalledWith(requestedUid, uid);
      expect(followsService.exists).toHaveBeenCalledWith(uid, requestedUid);
      expect(followRequestsService.hasPendingRequest).toHaveBeenCalledWith(
        uid,
        requestedUid,
      );
      expect(followRequestsRepository.save).toHaveBeenCalledWith(followRequest);
    });
  });
});
