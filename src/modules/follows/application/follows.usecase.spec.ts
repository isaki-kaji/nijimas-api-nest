import { Test, TestingModule } from '@nestjs/testing';
import { FollowsUsecase } from './follows.usecase';
import { FollowsService } from '../domain/follows.service';
import { IFollowsRepository } from '../domain/i.follows.repository';
import { FollowDto } from './dto/request/follow-request.dto';
import { FollowsFactory } from './factory/follows.factory';
import { NotFoundException } from '@nestjs/common';
import { mock } from 'jest-mock-extended';
import { Follow } from 'follows/domain/models/follow';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { genUid } from 'testing/utils/common-test-util';

describe('FollowsUsecase', () => {
  let usecase: FollowsUsecase;
  const followsService = mock<FollowsService>();
  const followsFactory = mock<FollowsFactory>();
  const followsRepository = mock<IFollowsRepository>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowsUsecase,
        { provide: FollowsService, useValue: followsService },
        { provide: FollowsFactory, useValue: followsFactory },
        { provide: 'IFollowsRepository', useValue: followsRepository },
      ],
    }).compile();

    usecase = module.get<FollowsUsecase>(FollowsUsecase);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  describe('cancelFollow', () => {
    it('should cancel follow if it exists', async () => {
      const dto: FollowDto = { uid: genUid(), targetUid: genUid() };
      const uid = Uid.create(dto.uid);
      const followingUid = Uid.create(dto.targetUid);
      const follow = {
        get uid() {
          return uid;
        },
        get followingUid() {
          return followingUid;
        },
      } as Follow;

      followsFactory.createModel.mockReturnValue(follow);
      followsService.exists.mockResolvedValue(true);

      await usecase.cancelFollow(dto);

      expect(followsFactory.createModel).toHaveBeenCalledWith(dto);
      expect(followsService.exists).toHaveBeenCalledWith(uid, followingUid);
      expect(followsRepository.delete).toHaveBeenCalledWith(follow);
    });

    it('should throw NotFoundException if follow does not exist', async () => {
      const dto: FollowDto = { uid: genUid(), targetUid: genUid() };
      const uid = Uid.create(dto.uid);
      const followingUid = Uid.create(dto.targetUid);
      const follow = {
        get uid() {
          return uid;
        },
        get followingUid() {
          return followingUid;
        },
      } as Follow;

      followsFactory.createModel.mockReturnValue(follow);
      followsService.exists.mockResolvedValue(false);

      await expect(usecase.cancelFollow(dto)).rejects.toThrow(
        NotFoundException,
      );
      expect(followsFactory.createModel).toHaveBeenCalledWith(dto);
      expect(followsService.exists).toHaveBeenCalledWith(uid, followingUid);
      expect(followsRepository.delete).not.toHaveBeenCalled();
    });
  });
});
