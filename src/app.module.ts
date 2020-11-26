import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from './client/client.module';
import { typeOrmConfig } from './typeorm.config';
import { ExamModule } from './exam/exam.module';
import { SchedulingModule } from './scheduling/scheduling.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), ClientModule, ExamModule, SchedulingModule],
})
export class AppModule { }
