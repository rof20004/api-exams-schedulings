import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientRepository } from './client.repository';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientService {
    constructor(
        @InjectRepository(ClientRepository)
        private readonly clientRepository: ClientRepository
    ) { }

    async create (createClientDto: CreateClientDto): Promise<Client> {
        const client = this.clientRepository.create(createClientDto);
        return await this.persist(client);
    }

    async update (id: string, updateClientDto: UpdateClientDto): Promise<Client> {
        const { name, cpf, birthDate } = updateClientDto;

        const found = await this.findOne(id);
        found.name = name;
        found.cpf = cpf;
        found.birthDate = birthDate;

        return await this.persist(found);
    }

    private async persist (client: Client): Promise<Client> {
        try {
            return await this.clientRepository.save(client);
        } catch (error) {
            // Unique exception
            if (error.code === 11000) {
                throw new ConflictException('Already exists a client with same cpf');
            }

            throw new InternalServerErrorException();
        }
    }

    async findAll (): Promise<Client[]> {
        const clients = await this.clientRepository.find();

        if (clients.length === 0) {
            throw new NotFoundException('No clients found');
        }

        return clients;
    }

    async findByCpf (cpf: string): Promise<Client> {
        const found = await this.clientRepository.findOne({ cpf });

        if (!found) {
            throw new NotFoundException(`No client found for cpf ${cpf}`);
        }

        return found;
    }

    async findOne (id: string): Promise<Client> {
        try {
            return await this.clientRepository.findOneOrFail(id);
        } catch (error) {
            throw new NotFoundException(`Client #${id} not found`);
        }
    }

    async remove (id: string) {
        await this.findOne(id);
        await this.clientRepository.delete(id);
    }
}
