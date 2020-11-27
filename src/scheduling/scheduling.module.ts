import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from '../client/client.module';
import { ExamModule } from '../exam/exam.module';
import { SchedulingController } from './scheduling.controller';
import { SchedulingRepository } from './scheduling.repository';
import { SchedulingService } from './scheduling.service';

@Module({
  imports: [TypeOrmModule.forFeature([SchedulingRepository]), ExamModule, ClientModule],
  controllers: [SchedulingController],
  providers: [SchedulingService],
  exports: [SchedulingService],
})
export class SchedulingModule { }
