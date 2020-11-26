import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import * as request from 'supertest';

const mockClientService = () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findByCpf: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});

describe('ClientController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [{ provide: ClientService, useFactory: mockClientService }],
    }).compile();

    app = module.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );

    await app.init();
  });

  it('successfully client created with 201', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/clients')
      .send({ name: 'Rodolfo', cpf: '28042658036', birthDate: new Date() })
      .expect(201);
  });

  it('get all clients', async () => {
    await request(app.getHttpServer()).get('/api/v1/clients').expect(200);
  });

  it('get a client by cpf', async () => {
    const cpf = '28042658036';
    await request(app.getHttpServer())
      .get(`/api/v1/clients/${cpf}`)
      .expect(200);
  });

  it('successfully update a client', async () => {
    const id = 1;
    await request(app.getHttpServer())
      .put(`/api/v1/clients/${id}`)
      .send({
        name: 'Rodolfo Azevedo',
        cpf: '28042658036',
        birthDate: new Date(),
      })
      .expect(200);
  });

  it('successfully remove a client', async () => {
    const id = 1;
    await request(app.getHttpServer())
      .delete(`/api/v1/clients/${id}`)
      .expect(200);
  });
});
