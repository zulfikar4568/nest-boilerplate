import assert from 'assert';
import { HttpStatus, INestApplication, VersioningType } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { AppModule } from '@/app.module';
import ValidationPipe from '@/core/base/frameworks/shared/pipes/validation.pipe';
import UnknownExceptionsFilter from '@/core/base/frameworks/shared/filters/unknown.filter';
import HttpExceptionFilter from '@/core/base/frameworks/shared/filters/http.filter';
import ContextInterceptor from '@/core/base/frameworks/shared/interceptors/context.interceptor';
import SuccessResponse from '@/core/base/frameworks/shared/responses/success.response';
import {
  TCreateUserRequestBody,
  User,
} from '@/modules/users/domain/entities/user.entity';
import { UserUseCase } from '@/modules/users/domain/usecase/user.usecase';
import { Role } from '@prisma/client';

describe('UserController', () => {
  let app: INestApplication;
  let accessToken: string;

  const mockUserUseCase = {
    listDropdown: jest.fn(() => {
      return [
        { id: '1', name: 'John 1' },
        { id: '2', name: 'John 2' },
      ];
    }),
    create: jest.fn((body: TCreateUserRequestBody): Omit<User, 'password'> => {
      return {
        id: 'c3b02b75-359c-4732-924e-cb79c847de37',
        name: body.name,
        description: body.description,
        username: body.username,
        email: body.email,
        phoneNumber: body.phoneNumber,
        roles: body.roles,
        createdAt: new Date('2023-10-08T07:09:50.460Z'),
        updatedAt: new Date('2023-10-08T07:09:50.460Z'),
      };
    }),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UserUseCase)
      .useValue(mockUserUseCase)
      .compile();

    app = moduleRef.createNestApplication();

    // Set prefix api globally
    app.setGlobalPrefix('api', { exclude: ['health', '/'] });

    // Enable CORS for security
    app.enableCors({
      credentials: true,
      origin: true,
    });

    app.useGlobalPipes(new ValidationPipe());

    // Use Exception Filter
    app.useGlobalFilters(
      new UnknownExceptionsFilter(),
      new HttpExceptionFilter(),
    );

    // Versioning of default URL V1
    app.enableVersioning({
      defaultVersion: '1',
      type: VersioningType.URI,
    });

    // Use Global Interceptors
    app.useGlobalInterceptors(new ContextInterceptor());

    // Use Cookie for http only
    app.use(cookieParser());

    await app.init();
  });

  it(`/POST create session`, async () => {
    const fakeUser = { username: 'admin', password: 'admin' };

    const response = await request(app.getHttpServer())
      .post('/api/v1/session')
      .send(fakeUser)
      .expect(HttpStatus.CREATED);

    accessToken = response.body.result.token;
  });

  it(`/GET users`, () => {
    return request(app.getHttpServer())
      .get('/api/v1/user/dropdown')
      .set('Cookie', `access-token=${accessToken}`)
      .expect(HttpStatus.OK)
      .expect(
        conversionResult(
          new SuccessResponse(
            'user fetched successfully',
            mockUserUseCase.listDropdown(),
          ),
        ),
      );
  });

  it(`/POST users`, async () => {
    const body: TCreateUserRequestBody = {
      name: 'John Deck',
      description: 'My Name is John Deck',
      password: 'mypassword',
      confirmPassword: 'mypassword',
      email: 'emailnew@gmail.com',
      phoneNumber: '08762342344',
      roles: [Role.ADMIN, Role.USER],
      username: 'username2',
    };

    const response = await request(app.getHttpServer())
      .post('/api/v1/user')
      .set('Cookie', `access-token=${accessToken}`)
      .send(body)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(HttpStatus.CREATED);
    assert.equal(response.body.success, true);
  });

  afterAll(async () => {
    await app.close();
  });
});

export const conversionResult = (data: SuccessResponse) => {
  return {
    success: data.success,
    message: data.message,
    result: data.result,
    error: data.getError(),
    meta: data.meta,
  };
};
