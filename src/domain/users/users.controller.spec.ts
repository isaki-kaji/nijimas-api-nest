import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { mock } from 'jest-mock-extended';
import { faker } from '@faker-js/faker/.';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { UserResponseDto } from './dto/response/user.response.dto';

describe('UsersController', () => {
  let controller: UsersController;
  const usersService = mock<UsersService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    describe('when no error occurs', () => {
      it('should create the user', async () => {
        const uid = genUid();
        const dto = genCreateDto(uid);

        await controller.create(dto);

        expect(usersService.create).toHaveBeenCalledWith(dto);
      });
    });
  });

  describe('findByUid', () => {
    describe('when no error occurs', () => {
      it('should find the user', async () => {
        const uid = genUid();
        const userResponse = genUserResponse(uid);

        usersService.findByUid.mockResolvedValueOnce(userResponse);

        const result = await controller.findByUid(uid);

        expect(usersService.findByUid).toHaveBeenCalledWith(uid);
        expect(result).toEqual(userResponse);
      });
    });
  });
});

const genUid = () => faker.string.alphanumeric(28);

const genCreateDto = (uid: string): CreateUserDto => ({
  uid,
  username: faker.person.firstName(),
});

const genUserResponse = (
  input: string | CreateUserDto | UpdateUserDto,
): UserResponseDto => {
  if (typeof input === 'string') {
    return {
      ...genCreateDto(input),
    } as UserResponseDto;
  } else {
    return {
      ...input,
    } as UserResponseDto;
  }
};
