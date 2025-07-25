import { Test, TestingModule } from "@nestjs/testing";
import { IServiceTracing } from '@claro/generic-models-library';
import { ServiceTracingUcimpl } from "./service-tracing.resource.uc.impl";
import { IServiceTracingProvider } from "../../../../data-provider/service-tracing.provider";

describe('ServiceTracingUcimpl', () => {
  let service: ServiceTracingUcimpl;
  let serviceProviderMock: jest.Mocked<IServiceTracingProvider>;

  beforeEach(async () => {
    serviceProviderMock = {
      createServiceTracing: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceTracingUcimpl,
        { provide: IServiceTracingProvider, useValue: serviceProviderMock },
      ],
    }).compile();

    service = module.get<ServiceTracingUcimpl>(ServiceTracingUcimpl);
  });

  it('debe llamar a createServiceTracing con el objeto serviceTracing', async () => {
    // Arrange
    const serviceTracing: IServiceTracing = {
      status: 'success',
      origin: 'example',
      task: 'example',
      description: 'example',
    };

    // Act
    await service.createServiceTracing(serviceTracing);

    // Assert
    expect(serviceProviderMock.createServiceTracing).toHaveBeenCalled
  });
});
