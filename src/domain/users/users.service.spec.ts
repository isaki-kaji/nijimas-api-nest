import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/request/create-user.dto';
import { faker } from '@faker-js/faker';
import { User } from '../../entities/user.entity';
import { UpdateUserDto } from './dto/request/update-user.dto';
import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { mock } from 'jest-mock-extended';

describe('UsersService', () => {
  let service: UsersService;
  const usersRepository = mock<UsersRepository>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: usersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    describe('when no error occurs', () => {
      it('should create the user', async () => {
        const uid = genUid();
        const dto = genCreateDto(uid);
        const user = genUser(dto);

        usersRepository.findByUid.mockResolvedValueOnce(null);

        await service.create(dto);

        expect(usersRepository.findByUid).toHaveBeenCalledWith(uid);
        expect(usersRepository.create).toHaveBeenCalledWith(user);
      });
    });

    describe('when user already exists', () => {
      it('should throw the exception', async () => {
        const uid = genUid();
        const dto = genCreateDto(uid);
        const user = genUser(dto);

        usersRepository.findByUid.mockResolvedValueOnce(user);

        await expect(service.create(dto)).rejects.toThrow(ConflictException);
        expect(usersRepository.findByUid).toHaveBeenCalledWith(uid);
      });
    });
  });

  describe('findByUid', () => {
    describe('when user exists', () => {
      it('should return the user-response-dto', async () => {
        const uid = genUid();
        const expectedUser = genUser(uid);

        usersRepository.findByUid.mockResolvedValueOnce(expectedUser);

        const result = await service.findByUid(uid);

        expect(result).toEqual(expectedUser);
      });
    });

    describe('when user not exists', () => {
      it('should throw the exception', async () => {
        const uid = genUid();

        usersRepository.findByUid.mockResolvedValueOnce(null);

        await expect(service.findByUid(uid)).rejects.toThrow(NotFoundException);
        expect(usersRepository.findByUid).toHaveBeenCalledWith(uid);
      });
    });
  });
});

const genUid = () => faker.string.alphanumeric(28);

const genCreateDto = (uid: string): CreateUserDto => ({
  uid,
  username: faker.person.firstName(),
});

const genUser = (input: string | CreateUserDto | UpdateUserDto): User => {
  if (typeof input === 'string') {
    return {
      ...genCreateDto(input),
    } as User;
  } else {
    return {
      ...input,
    } as User;
  }
};
