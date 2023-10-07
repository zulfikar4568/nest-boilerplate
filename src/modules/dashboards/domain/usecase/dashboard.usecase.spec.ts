import { TestingModule, Test } from '@nestjs/testing';
import { DashboardRepository } from '../../data/dashboard.repository';
import { DashboardUseCase } from './dashboard.usecase';

describe('DashboardUsecase', () => {
  let service: DashboardUseCase;

  const mockDataService = {
    dashboards: {
      getAll: jest.fn(() => {
        return [
          { id: '1', description: 'Dasboard Jakarta', name: 'Dashboard C' },
          { id: '2', description: 'Dasboard Bandung', name: 'Dashboard B' },
        ];
      }),
      get: jest.fn((id: string) => {
        return { id, description: 'Dasboard Jakarta', name: 'Dashboard C' };
      }),
      create: jest.fn().mockImplementation((dtoDashboard) => {
        return {
          id: '1',
          ...dtoDashboard,
        };
      }),
      update: jest.fn().mockImplementation((id: string, dtoDashboard) => {
        return {
          id,
          ...dtoDashboard,
        };
      }),
    },
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [DashboardUseCase, DashboardRepository],
    })
      .overrideProvider(DashboardRepository)
      .useValue(mockDataService)
      .compile();

    service = moduleRef.get<DashboardUseCase>(DashboardUseCase);
  });

  it('Dashboard Usecase should be defined', () => {
    expect(service).toBeDefined();
  });

  it("It's should be create a Dashboard!", async () => {
    const dataExpected = {
      id: expect.any(String),
      name: 'Dashboard C',
      description: 'Dasboard Jakarta',
    };

    const dto = {
      name: 'Dashboard C',
      description: 'Dasboard Jakarta',
    };

    expect(await service.create(dto)).toEqual(dataExpected);
  });

  it("It's should be update the Dashboard!", async () => {
    const dataExpected = {
      id: expect.any(String),
      name: 'Dashboard Z',
      description: 'Dasboard Jakarta',
    };

    const dto = {
      name: 'Dashboard Z',
      description: 'Dasboard Jakarta',
    };

    expect(await service.update({ id: '1' }, dto)).toEqual(dataExpected);
  });
});