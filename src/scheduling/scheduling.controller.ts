import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateSchedulingDto } from "./dto/create-scheduling.dto";
import { GetSchedulingDto } from "./dto/get-scheduling.dto";
import { QuerySchedulingDto } from "./dto/query-scheduling.dto";
import { SchedulingService } from "./scheduling.service";
import { Scheduling } from "./entities/scheduling.entity";
import { UpdateSchedulingDto } from "./dto/update-scheduling.dto";
import * as config from 'config';

const schedulingConfig = config.get('scheduling');

@Controller('/api')
@ApiTags('Schedulings')
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) { }

  @Post('/v1/schedulings')
  @ApiResponse({ status: 201, description: 'Successfully created scheduling' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 404, description: 'No exam or client found' })
  @ApiResponse({ status: 409, description: `Duplicate scheduling or scheduling limit reached. Current limit: ${schedulingConfig.maxForExamAndDate}` })
  @ApiResponse({ status: 500, description: 'Internal server error, please contact system administrator' })
  @ApiOperation({ summary: 'Creates a scheduling for client' })
  async create (@Body() createSchedulingDto: CreateSchedulingDto) {
    return await this.schedulingService.create(createSchedulingDto);
  }

  @Get('/v1/schedulings')
  @ApiResponse({ status: 200, description: 'Successfully retrieved schedulings for client' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 404, description: 'No schedulings found for client' })
  @ApiOperation({ summary: 'Get all client schedulings by cpf' })
  async findByClientCpf (@Query() querySchedulingDto: QuerySchedulingDto): Promise<GetSchedulingDto> {
    return await this.schedulingService.findByClientCpf(querySchedulingDto);
  }

  @Put('/v1/schedulings/:id')
  @ApiResponse({ status: 200, description: 'Successfully updated scheduling' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 409, description: `Duplicate scheduling or scheduling limit reached. Current limit: ${schedulingConfig.maxForExamAndDate}` })
  @ApiResponse({ status: 500, description: 'Internal server error, please contact system administrator' })
  @ApiOperation({ summary: 'Update a scheduling by id' })
  async update (
    @Param('id') id: string,
    @Body() updateSchedulingDto: UpdateSchedulingDto,
  ): Promise<Scheduling> {
    return await this.schedulingService.update(id, updateSchedulingDto);
  }

  @Delete('/v1/schedulings/:id')
  @ApiResponse({ status: 200, description: 'Successfully deleted scheduling' })
  @ApiResponse({ status: 404, description: 'No scheduling found' })
  @ApiOperation({ summary: 'Delete a scheduling by id' })
  async remove (@Param('id') id: string) {
    await this.schedulingService.remove(id);
  }
}