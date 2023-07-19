import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { DashboardUseCase } from '../../src/usecases/dashboards';
import {
  CreateDashboardDto,
  UpdateDashboardDto,
} from '../../src/core/dtos/dashboard.dto';
import { DashboardFactoryService } from '../../src/usecases/dashboards/dashboard-factory.service';
import { Dashboard } from '../../src/core/entities';

describe('DashboardController', () => {
  let app: INestApplication;
  const mockDashboardUseCase = {
    getAllDashboards: jest.fn(() => {
      return [
        { id: '1', description: 'Dasboard Jakarta', name: 'Dashboard C' },
        { id: '2', description: 'Dasboard Bandung', name: 'Dashboard B' },
      ];
    }),
    getDashboardById: jest.fn((id: string) => {
      return { id, description: 'Dasboard Jakarta', name: 'Dashboard C' };
    }),
    createDashboard: jest
      .fn()
      .mockImplementation((dtoDashboard: CreateDashboardDto): Dashboard => {
        return dtoDashboard;
      }),
    updateDashboard: jest
      .fn()
      .mockImplementation((id: string, dtoDashboard: UpdateDashboardDto) => {
        return {
          id,
          ...dtoDashboard,
        };
      }),
  };

  const factoryDashboardFactoryService = new DashboardFactoryService();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DashboardUseCase)
      .useValue(mockDashboardUseCase)
      .overrideProvider(DashboardFactoryService)
      .useValue(factoryDashboardFactoryService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET dashboards`, () => {
    return request(app.getHttpServer())
      .get('/api/dashboard')
      .expect(200)
      .expect(mockDashboardUseCase.getAllDashboards());
  });

  it(`/GET dashboards by id`, () => {
    return request(app.getHttpServer())
      .get('/api/dashboard/' + '1')
      .expect(200)
      .expect(mockDashboardUseCase.getDashboardById('1'));
  });

  it(`/POST dashboards`, () => {
    const body: CreateDashboardDto = {
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
    const body: UpdateDashboardDto = {
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
