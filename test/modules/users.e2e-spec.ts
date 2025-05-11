import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from 'users/users.module';
import { faker } from '@faker-js/faker/.';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { VALIDATION_PIPE_OPTIONS } from 'common/util/common.constants';
import { CreateUserDto } from 'users/application/dto/request/create-user.dto';
import { TEST_ENV_VALIDATION_SCHEMA } from 'testing/utils/testing.constants';
import { LoggingExceptionFilter } from 'common/filter/logging-exception.filter';
import dbConfig from 'config/db.config';
import { UpdateUserDto } from 'users/application/dto/request/update-user.dto';
import { UidInterceptor } from 'common/interceptor/uid.interceptor';
import { MockAuthGuard } from '../mock/mock.auth.guard';

function generateCreateDto(): CreateUserDto {
  return {
    uid: faker.string.alphanumeric(28),
    username: faker.person.firstName(),
  };
}

function generateUpdateDto(): UpdateUserDto {
  return {
    username: faker.person.firstName(),
    userCode: faker.string.alphanumeric(6),
    selfIntro: faker.lorem.sentence(),
    profileImageUrl: 'https://example.com',
    version: 0,
  };
}

const createDto = generateCreateDto();
const updateDto = generateUpdateDto();

describe('Users [/users]', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        ConfigModule.forRoot({
          expandVariables: true,
          validationSchema: TEST_ENV_VALIDATION_SCHEMA,
        }),
        TypeOrmModule.forRootAsync(dbConfig.asProvider()),
      ],
      providers: [
        {
          provide: 'TEST_UID',
          useFactory: () => createDto.uid,
        },
        {
          provide: APP_GUARD,
          useClass: MockAuthGuard,
        },
        {
          provide: APP_PIPE,
          useValue: new ValidationPipe(VALIDATION_PIPE_OPTIONS),
        },
        {
          provide: APP_FILTER,
          useClass: LoggingExceptionFilter,
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: UidInterceptor,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('OK - Create [POST /]', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(createDto);

    const { status } = response;

    expect(status).toBe(HttpStatus.CREATED);
  });

  it('NG (Conflict) - Create [POST /]', async () => {
    const createDto = generateCreateDto();

    await request(app.getHttpServer()).post('/users').send(createDto);

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(createDto);

    const { status } = response;
    expect(status).toBe(HttpStatus.CONFLICT);
  });

  it('OK - Update [PUT /]', async () => {
    await request(app.getHttpServer()).put('/users').send(updateDto);

    const response = await request(app.getHttpServer())
      .put('/users')
      .send(updateDto);

    const { status } = response;
    expect(status).toBe(HttpStatus.OK);
  });

  it('OK - Get Own User [GET /me]', async () => {
    await request(app.getHttpServer()).get('/users/me').send();

    const response = await request(app.getHttpServer()).get('/users/me');

    const { status, body } = response;
    expect(status).toBe(HttpStatus.OK);
    expect(body).toEqual(
      expect.objectContaining({
        uid: createDto.uid,
        username: updateDto.username,
        selfIntro: updateDto.selfIntro,
        profileImageUrl: updateDto.profileImageUrl,
      }),
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
