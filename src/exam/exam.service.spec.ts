import { HttpModule, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ExamService } from './exam.service';

describe('ExamService', () => {
  let service: ExamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [ExamService],
    }).compile();

    service = module.get<ExamService>(ExamService);
  });

  it('get all exams', async () => {
    const result = await service.findAll();
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(10);
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('name');
    expect(result[0]).not.toHaveProperty('value');
  });

  it('get exam by id', async () => {
    const result = await service.findByExamId('1');
    expect(result).toBeDefined();
  });

  it('get exam by id and throws exception when not found', () => {
    expect(async () => await service.findByExamId('a')).rejects.toThrowError(
      NotFoundException,
    );
  });
});
