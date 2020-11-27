import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Scheduling } from './entities/scheduling.entity';
import { SchedulingRepository } from './scheduling.repository';
import { CreateSchedulingDto } from './dto/create-scheduling.dto';
import { ExamService } from '../exam/exam.service';
import { ClientService } from '../client/client.service';
import { QuerySchedulingDto } from './dto/query-scheduling.dto';
import { UpdateSchedulingDto } from './dto/update-scheduling.dto';
import * as config from 'config';
import * as moment from 'moment';

const schedulingConfig = config.get('scheduling');

@Injectable()
export class SchedulingService {
  constructor(
    @InjectRepository(SchedulingRepository)
    private readonly schedulingRepository: SchedulingRepository,
    private readonly examService: ExamService,
    private readonly clientService: ClientService
  ) { }

  async create (createSchedulingDto: CreateSchedulingDto): Promise<Scheduling> {
    const { date, cpf, examId } = createSchedulingDto;
    const formattedDate = moment(date).format('YYYY-MM-DDTHH:mm');

    const exam = await this.examService.findByExamId(examId);

    await this.checkSchedulingLimitForExamAndDate(formattedDate, exam);

    const client = await this.clientService.findByCpf(cpf);

    const scheduling = this.schedulingRepository.create({ date: formattedDate, client, exam });

    return await this.persist(scheduling);
  }

  async update (id: string, updateSchedulingDto: UpdateSchedulingDto): Promise<Scheduling> {
    const { date } = updateSchedulingDto;
    const formattedDate = moment(date).format('YYYY-MM-DDTHH:mm')

    const found = await this.findOne(id);
    found.date = formattedDate;

    await this.checkSchedulingLimitForExamAndDate(found.date, found.exam);

    return await this.persist(found);
  }

  private async persist (scheduling: Scheduling): Promise<Scheduling> {
    try {
      return await this.schedulingRepository.save(scheduling);
    } catch (error) {
      // Unique exception
      if (error.code === 11000) {
        throw new ConflictException(
          'Already exists scheduling with same exam and date for this client',
        );
      }

      throw new InternalServerErrorException();
    }
  }

  async findOne (id: string): Promise<Scheduling> {
    try {
      return await this.schedulingRepository.findOneOrFail(id);
    } catch (error) {
      throw new NotFoundException(`Scheduling #${id} not found`);
    }
  }

  async findByClientCpf (querySchedulingDto: QuerySchedulingDto): Promise<any> {
    const { cpf } = querySchedulingDto;

    const schedules = await this.schedulingRepository.find({
      where: { 'client.cpf': cpf },
    });

    if (schedules.length === 0) {
      throw new NotFoundException(`No schedulings found for cpf ${cpf}`);
    }

    const total = this.buildTotal(schedules);
    const client = this.buildClient(schedules);
    const scheduledExams = this.buildScheduledExams(schedules);

    return { total, client, schedules: scheduledExams };
  }

  async remove (id: string) {
    await this.findOne(id);
    await this.schedulingRepository.delete(id);
  }

  private async checkSchedulingLimitForExamAndDate (date: string, exam: any) {
    const schedules = await this.schedulingRepository.find({
      where: { date, exam },
    });

    if (schedules.length >= schedulingConfig.maxForExamAndDate) {
      throw new ConflictException(
        'Scheduling limit for this exam and date was reached',
      );
    }
  }

  private buildTotal (schedules: Scheduling[]) {
    return schedules.reduce(
      (acc: number, scheduling: Scheduling) => acc + scheduling.exam.value,
      0,
    );
  }

  private buildClient (schedules: Scheduling[]) {
    return schedules[0].client;
  }

  private buildScheduledExams (schedules: Scheduling[]): any {
    return schedules.map((schedule) => {
      return {
        id: schedule.id.toString(),
        date: schedule.date,
        exam: schedule.exam,
      };
    });
  }
}