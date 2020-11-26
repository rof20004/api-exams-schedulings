import { HttpService, Injectable, NotFoundException } from '@nestjs/common';
import { ISetupCache, setupCache } from 'axios-cache-adapter';
import * as config from 'config';
import { ExamDto } from './dto/exam.dto';

const cacheConfig = config.get('cache');
const mockyConfig = config.get('mocky');

interface ExamMockyResponse {
  exams: any[];
}

@Injectable()
export class ExamService {
  private cacheExams: ISetupCache;
  private examsEndpoint: string;

  constructor(private readonly httpService: HttpService) {
    this.examsEndpoint = mockyConfig.endpoints.exams;
    this.cacheExams = setupCache({
      maxAge: cacheConfig.mocky.exams.maxAge,
    });
  }

  async findByExamId (examId: string): Promise<any> {
    const externalExams = await this.fetchAllExamsFromExternalResource();

    const exam = externalExams.find((exam) => exam.id === examId);

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    return exam;
  }

  async findAll (): Promise<ExamDto[]> {
    const exams = await this.fetchAllExamsFromExternalResource();

    if (exams.length === 0) {
      throw new NotFoundException('No exams found');
    }

    return exams.map((exam) => new ExamDto(exam.id, exam.name));
  }

  async fetchAllExamsFromExternalResource (): Promise<any[]> {
    const config = {
      adapter: this.cacheExams.adapter,
    };

    const response = await this.httpService
      .get<ExamMockyResponse>(this.examsEndpoint, config)
      .toPromise();

    return response.data.exams;
  }
}
