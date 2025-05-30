import { Test, TestingModule } from '@nestjs/testing';
import { UsersUsecase } from './users.usecase';
import { UsersRepository } from '../infrastructure/users.repository';

import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { UsersService } from 'users/domain/users.service';
import { User } from 'users/domain/models/user';
import { UsersFactory } from './factory/users.factory';
import { mock } from 'jest-mock-extended';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { CurrentUserResponseDto } from './dto/response/current-user.response.dto';
import {
  genCreateDto,
  genUpdateDto,
  genCreatedUser,
} from 'testing/utils/users-test-utils';
import { genUid } from 'testing/utils/common-test-util';

describe('UsersUsecase', () => {
  let usecase: UsersUsecase;
  const usersRepository = mock<UsersRepository>();
  const usersService = mock<UsersService>();
  const usersFactory = mock<UsersFactory>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersUsecase,
        {
          provide: UsersService,
          useValue: usersService,
        },
        {
          provide: UsersFactory,
          useValue: usersFactory,
        },
        {
          provide: 'IUsersRepository',
          useValue: usersRepository,
        },
      ],
    }).compile();

    usecase = module.get<UsersUsecase>(UsersUsecase);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  describe('create', () => {
    describe('when no error occurs', () => {
      it('should create the user', async () => {
        const uid = genUid();
        const dto = genCreateDto(uid);
        const user = mock<User>();

        usersFactory.createModelFromCreateDto.mockReturnValueOnce(user);
        usersService.exists.mockResolvedValueOnce(false);

        await usecase.create(dto);

        expect(usersFactory.createModelFromCreateDto).toHaveBeenCalledWith(dto);
        expect(usersService.exists).toHaveBeenCalledWith(user.uid);
        expect(usersRepository.save).toHaveBeenCalledWith(user);
      });
    });

    describe('when user already exists', () => {
      it('should throw the exception', async () => {
        const uid = genUid();
        const dto = genCreateDto(uid);
        const user = mock<User>();

        usersFactory.createModelFromCreateDto.mockReturnValueOnce(user);
        usersService.exists.mockResolvedValueOnce(true);

        await expect(usecase.create(dto)).rejects.toThrow(ConflictException);
        expect(usersFactory.createModelFromCreateDto).toHaveBeenCalledWith(dto);
      });
    });
  });

  describe('update', () => {
    describe('when no error occurs', () => {
      it('should update the user', async () => {
        const uid = genUid();
        const dto = genUpdateDto(uid);
        const user = genCreatedUser(dto);

        usersFactory.createModelFromUpdateDto.mockReturnValueOnce(user);
        usersService.exists.mockResolvedValueOnce(true);

        await usecase.update(dto);

        expect(usersFactory.createModelFromUpdateDto).toHaveBeenCalledWith(dto);
        expect(usersService.exists).toHaveBeenCalledWith(user.uid);
        expect(usersRepository.save).toHaveBeenCalledWith(user);
      });
    });

    describe('when user not found', () => {
      it('should throw the exception', async () => {
        const uid = genUid();
        const dto = genUpdateDto(uid);
        const user = genCreatedUser(dto);

        usersFactory.createModelFromUpdateDto.mockReturnValueOnce(user);
        usersService.exists.mockResolvedValueOnce(false);

        await expect(usecase.update(dto)).rejects.toThrow(NotFoundException);
        expect(usersFactory.createModelFromUpdateDto).toHaveBeenCalledWith(dto);
      });
    });
  });

  describe('getOwnUser', () => {
    describe('when no error occurs', () => {
      it('should return the user', async () => {
        const uid = genUid();
        const user = mock<User>();
        const userResponse = mock<CurrentUserResponseDto>();

        usersRepository.findByUid.mockResolvedValueOnce(user);
        usersFactory.createResponse.mockReturnValueOnce(userResponse);

        const result = await usecase.getOwnUser(uid);

        expect(usersRepository.findByUid).toHaveBeenCalledWith(Uid.create(uid));
        expect(usersFactory.createResponse).toHaveBeenCalledWith(user);
        expect(result).toEqual(userResponse);
      });

      describe('when user not found', () => {
        it('should throw the exception', async () => {
          const uid = genUid();

          usersRepository.findByUid.mockResolvedValueOnce(undefined);

          await expect(usecase.getOwnUser(uid)).rejects.toThrow(
            NotFoundException,
          );
          expect(usersRepository.findByUid).toHaveBeenCalledWith(
            Uid.create(uid),
          );
        });
      });
    });
  });
});
