/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientRepository } from './client.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ClientRepository])],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService]
})
export class ClientModule { }
