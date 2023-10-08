import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { DashboardUseCase } from '@/modules/dashboards/domain/usecase/dashboard.usecase';
import {
  TCreateDashboardRequestBody,
  TUpdateDashboardRequestBody,
} from '@/modules/dashboards/domain/entities/dashboard.entity';

describe('DashboardController', () => {
  let app: INestApplication;
  const mockDashboardUseCase = {
    listDropdown: jest.fn(() => {
      return [
        { id: '1', description: 'Dasboard Jakarta', name: 'Dashboard C' },
        { id: '2', description: 'Dasboard Bandung', name: 'Dashboard B' },
      ];
    }),
    get: jest.fn((id: string) => {
      return { id, description: 'Dasboard Jakarta', name: 'Dashboard C' };
    }),
    create: jest
      .fn()
      .mockImplementation((dtoDashboard: TCreateDashboardRequestBody) => {
        return dtoDashboard;
      }),
    update: jest
      .fn()
      .mockImplementation(
        (id: string, dtoDashboard: TUpdateDashboardRequestBody) => {
          return {
            id,
            ...dtoDashboard,
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
    await app.init();
  });

  it(`/GET dashboards`, () => {
    return request(app.getHttpServer())
      .get('/api/dashboard')
      .expect(200)
      .expect(mockDashboardUseCase.listDropdown());
  });

  it(`/GET dashboards by id`, () => {
    return request(app.getHttpServer())
      .get('/api/dashboard/' + '1')
      .expect(200)
      .expect(mockDashboardUseCase.get('1'));
  });

  it(`/POST dashboards`, () => {
    const body: TCreateDashboardRequestBody = {
      name: 'Dashboard A',
      description: 'This is Dashboard A',
    };

    return request(app.getHttpServer())
      .post('/api/dashboard')
      .send(body)
      .expect('Content-Type', /json/)
      .expect(201)
      .expect({
        success: true,
        createdDashboard: body,
      });
  });

  it(`/PUT dashboards`, () => {
    const id = '1';
    const body: TUpdateDashboardRequestBody = {
      name: 'Dashboard A',
      description: 'This is Dashboard A',
    };

    return request(app.getHttpServer())
      .put('/api/dashboard/' + id)
      .send(body)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({
        id,
        ...body,
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
