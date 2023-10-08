import { HttpStatus, INestApplication, VersioningType } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { DashboardUseCase } from '@/modules/dashboards/domain/usecase/dashboard.usecase';
import {
  Dashboard,
  TCreateDashboardRequestBody,
  TUpdateDashboardRequestBody,
} from '@/modules/dashboards/domain/entities/dashboard.entity';
import { AppModule } from '@/app.module';
import ValidationPipe from '@/core/base/frameworks/shared/pipes/validation.pipe';
import UnknownExceptionsFilter from '@/core/base/frameworks/shared/filters/unknown.filter';
import HttpExceptionFilter from '@/core/base/frameworks/shared/filters/http.filter';
import ContextInterceptor from '@/core/base/frameworks/shared/interceptors/context.interceptor';
import SuccessResponse from '@/core/base/frameworks/shared/responses/success.response';

describe('DashboardController', () => {
  let app: INestApplication;
  const mockDashboardUseCase = {
    listDropdown: jest.fn(() => {
      return [
        { id: '1', name: 'Dashboard C' },
        { id: '2', name: 'Dashboard B' },
      ];
    }),
    get: jest.fn((id: string): Dashboard => {
      return {
        id,
        description: 'Dasboard Jakarta',
        name: 'Dashboard C',
        createdAt: new Date('2023-10-08T07:09:50.460Z'),
        updatedAt: new Date('2023-10-08T07:09:50.460Z'),
      };
    }),
    create: jest.fn((body: TCreateDashboardRequestBody): Dashboard => {
      return {
        id: 'c3b02b75-359c-4732-924e-cb79c847de37',
        name: body.name,
        description: body.description,
        createdAt: new Date('2023-10-08T07:09:50.460Z'),
        updatedAt: new Date('2023-10-08T07:09:50.460Z'),
      };
    }),
    update: jest.fn(
      (
        params: { id: string },
        body: TUpdateDashboardRequestBody,
      ): Dashboard => {
        return {
          id: params.id,
          name: body.name ?? 'updated',
          description: body.description ?? 'updated description',
          createdAt: new Date('2023-10-08T07:09:50.460Z'),
          updatedAt: new Date('2023-10-08T07:09:50.460Z'),
        };
      },
    ),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DashboardUseCase)
      .useValue(mockDashboardUseCase)
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

  it(`/GET dashboards`, () => {
    return request(app.getHttpServer())
      .get('/api/v1/dashboard/all')
      .expect(HttpStatus.OK)
      .expect(
        new SuccessResponse(
          'dashboard fetched successfully',
          mockDashboardUseCase.listDropdown(),
        ),
      );
  });

  it(`/POST dashboards`, () => {
    const body: TCreateDashboardRequestBody = {
      name: 'Dashboard A',
      description: 'This is Dashboard A',
    };

    return request(app.getHttpServer())
      .post('/api/v1/dashboard')
      .send(body)
      .expect('Content-Type', /json/)
      .expect(HttpStatus.CREATED)
      .expect(
        new SuccessResponse(
          'dashboard created successfully',
          mockDashboardUseCase.create(body),
        ),
      );
  });

  it(`/PUT dashboards`, () => {
    const id = '1';
    const body: TUpdateDashboardRequestBody = {
      name: 'Dashboard A',
      description: 'This is Dashboard A',
    };

    return request(app.getHttpServer())
      .patch('/api/v1/dashboard/' + id)
      .send(body)
      .expect('Content-Type', /json/)
      .expect(HttpStatus.CREATED)
      .expect(
        new SuccessResponse(
          'dashboard updated successfully',
          mockDashboardUseCase.update({ id }, body),
        ),
      );
  });

  afterAll(async () => {
    await app.close();
  });
});
