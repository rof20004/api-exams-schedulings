import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

@Controller('/api')
@ApiTags('Clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) { }

  @Post('/v1/clients')
  @ApiResponse({ status: 201, description: 'Successfully created client' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 409, description: 'Duplicate client' })
  @ApiResponse({ status: 500, description: 'Internal server error, please contact system administrator' })
  @ApiOperation({ summary: 'Create a client' })
  async create (@Body() createClientDto: CreateClientDto): Promise<Client> {
    return await this.clientService.create(createClientDto);
  }

  @Get('/v1/clients')
  @ApiResponse({ status: 200, description: 'Successfully retrieved clients' })
  @ApiResponse({ status: 404, description: 'No clients found' })
  @ApiOperation({ summary: 'Get all clients' })
  async findAll (): Promise<Client[]> {
    return await this.clientService.findAll();
  }

  @Get('/v1/clients/:cpf')
  @ApiResponse({ status: 200, description: 'Successfully found a client' })
  @ApiResponse({ status: 404, description: 'No client found' })
  @ApiOperation({ summary: 'Get a client by cpf' })
  async findByCpf (@Param('cpf') cpf: string): Promise<Client> {
    return await this.clientService.findByCpf(cpf);
  }

  @Put('/v1/clients/:id')
  @ApiResponse({ status: 200, description: 'Successfully updated client' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 409, description: 'Duplicate client' })
  @ApiResponse({ status: 500, description: 'Internal server error, please contact system administrator' })
  @ApiOperation({ summary: 'Update a client by id' })
  async update (
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    return await this.clientService.update(id, updateClientDto);
  }

  @Delete('/v1/clients/:id')
  @ApiResponse({ status: 200, description: 'Successfully deleted client' })
  @ApiResponse({ status: 404, description: 'No client found' })
  @ApiOperation({ summary: 'Delete a client by id' })
  async remove (@Param('id') id: string) {
    await this.clientService.remove(id);
  }
}
