import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { mock } from 'jest-mock-extended';
import { faker } from '@faker-js/faker/.';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

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
        const user = genUser(uid);

        usersService.findByUid.mockResolvedValueOnce(user);

        await controller.findByUid(uid);

        expect(usersService.findByUid).toHaveBeenCalledWith(uid);
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
