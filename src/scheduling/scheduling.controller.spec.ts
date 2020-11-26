import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SchedulingController } from './scheduling.controller';
import { SchedulingService } from './scheduling.service';
import * as request from 'supertest';

const mockSchedulingService = () => ({
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByClientCpf: jest.fn(),
});

describe('SchedulingController', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SchedulingController],
            providers: [{ provide: SchedulingService, useFactory: mockSchedulingService }],
        }).compile();

        app = module.createNestApplication();

        app.useGlobalPipes(
            new ValidationPipe({
                transform: true,
            }),
        );

        await app.init();
    });

    it('successfully scheduling created with 201', async () => {
        await request(app.getHttpServer())
            .post('/api/v1/schedulings')
            .send({ date: '2020-01-01T11:00:00', cpf: '28042658036', examId: '1' })
            .expect(201);
    });

    it('get all schedulings for client', async () => {
        await request(app.getHttpServer()).get('/api/v1/schedulings')
            .query({ cpf: '28042658036' })
            .expect(200);
    });

    it('successfully update a scheduling', async () => {
        const id = 1;
        await request(app.getHttpServer())
            .put(`/api/v1/schedulings/${id}`)
            .send({ date: '2020-01-01T11:00:00' })
            .expect(200);
    });

    it('successfully remove a scheduling', async () => {
        const id = 1;
        await request(app.getHttpServer())
            .delete(`/api/v1/schedulings/${id}`)
            .expect(200);
    });
});
