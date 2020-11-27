import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import * as request from 'supertest';

const mockExamService = () => ({
  findAll: jest.fn(),
});

describe('ExamController', () => {
  let app: INestApplication;
  let service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamController],
      providers: [{ provide: ExamService, useFactory: mockExamService }],
    }).compile();

    app = module.createNestApplication();
    service = module.get<ExamService>(ExamService);

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );

    await app.init();
  });

  it('successfully get all exams', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/exams')
      .expect(200);
  });
});
