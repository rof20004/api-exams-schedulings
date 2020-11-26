import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExamDto } from './dto/exam.dto';
import { ExamService } from './exam.service';

@Controller('/api')
@ApiTags('Exams')
export class ExamController {
  constructor(private readonly examService: ExamService) { }

  @Get('/v1/exams')
  @ApiResponse({ status: 200, description: 'Successfully retrieved exams' })
  @ApiResponse({ status: 404, description: 'No exams found' })
  @ApiOperation({ summary: 'Get all exams' })
  async findAll (): Promise<ExamDto[]> {
    return await this.examService.findAll();
  }
}
