import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ClientRepository } from './client.repository';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ExamService } from '../exam/exam.service';
import { SchedulingService } from '../scheduling/scheduling.service';
import { SchedulingRepository } from '../scheduling/scheduling.repository';

const mockClientRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneOrFail: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
});

describe('ClientService', () => {
    let service: ClientService;
    let repository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ClientService,
                { provide: ClientRepository, useFactory: mockClientRepository },
            ],
        }).compile();

        service = module.get<ClientService>(ClientService);
        repository = module.get<ClientRepository>(ClientRepository);
    });

    it('create a client', async () => {
        const name = 'Rodolfo';
        const cpf = '12345678901';
        const birthDate = new Date();

        const mockResult = {
            id: 1,
            name,
            cpf,
            birthDate,
        };
        repository.save.mockResolvedValue(mockResult);

        const payload: CreateClientDto = { name, cpf, birthDate };

        const result = await service.create(payload);
        expect(repository.save).toHaveBeenCalled();
        expect(result).toHaveProperty('id');
    });

    it('get all clients', async () => {
        const mockResult = [
            {
                id: 1,
                name: 'Rodolfo',
                cpf: '12345678901',
                birthDate: new Date(),
            },
            {
                id: 2,
                name: 'Genoveva',
                cpf: '12345678910',
                birthDate: new Date(),
            },
        ];
        repository.find.mockResolvedValue(mockResult);

        const result = await service.findAll();
        expect(repository.find).toHaveBeenCalled();
        expect(result).toBeDefined();
        expect(result).toMatchObject(mockResult);
    });

    it('get empty clients', () => {
        const mockResult = [];
        repository.find.mockResolvedValue(mockResult);

        expect(async () => await service.findAll()).rejects.toThrowError(NotFoundException);
        expect(repository.find).toHaveBeenCalled();
    });

    it('get one client by cpf', async () => {
        const mockResult = {
            id: 1,
            name: 'Rodolfo',
            cpf: '12345678901',
            birthDate: new Date(),
        };
        repository.findOne.mockResolvedValue(mockResult);

        const cpf = '12345678901';
        const result = await service.findByCpf(cpf);
        expect(repository.findOne).toHaveBeenCalled();
        expect(result).toBeDefined();
        expect(result).toMatchObject(mockResult);
    });

    it('get one client by cpf and throw not found', async () => {
        repository.findOneOrFail.mockRejectedValue(null);
        const cpf = 'cpf';
        expect(async () => await service.findByCpf(cpf)).rejects.toThrowError(
            NotFoundException,
        );
    });

    it('get one client by id', async () => {
        const mockResult = {
            id: 1,
            name: 'Rodolfo',
            cpf: '12345678901',
            birthDate: new Date(),
        };
        repository.findOneOrFail.mockResolvedValue(mockResult);

        const id = '1';
        const result = await service.findOne(id);
        expect(repository.findOneOrFail).toHaveBeenCalled();
        expect(result).toBeDefined();
        expect(result).toMatchObject(mockResult);
    });

    it('get one client by id and throw not found', async () => {
        repository.findOneOrFail.mockRejectedValue(null);
        const id = '1';
        expect(async () => await service.findOne(id)).rejects.toThrowError(
            NotFoundException,
        );
    });

    it('update a client', async () => {
        const mockFindOne = {
            id: 1,
            name: 'Rodolfo',
            cpf: '12345678901',
            birthDate: new Date(),
        };
        repository.findOneOrFail.mockResolvedValue(mockFindOne);

        const mockResult: UpdateClientDto = {
            name: 'Rodolfo Azevedo',
            cpf: '012345678900',
            birthDate: new Date(),
        };
        repository.save.mockResolvedValue(mockResult);

        const id = '1';
        const payload = { ...mockResult };
        const result = await service.update(id, payload);
        expect(repository.save).toHaveBeenCalled();
        expect(result).toBeDefined();
        expect(result).toMatchObject(mockResult);
    });

    it('update a client and throw not found', () => {
        repository.findOneOrFail.mockRejectedValue(null);

        const payload = {
            name: 'Rodolfo Azevedo',
            cpf: '01234567890',
            birthDate: new Date(),
        };

        const id = '1';
        expect(async () => await service.update(id, payload)).rejects.toThrowError(
            NotFoundException,
        );
        expect(repository.update).not.toHaveBeenCalled();
    });

    it('remove a client', async () => {
        const mockFind = { id: 1 };
        repository.findOneOrFail.mockResolvedValue(mockFind);

        const id = '1';
        await service.remove(id);
        expect(repository.findOneOrFail).toHaveBeenCalled();
        expect(repository.delete).toHaveBeenCalled();
    });

    it('remove a client and throw not found', () => {
        repository.findOneOrFail.mockRejectedValue(null);

        const id = '1';
        expect(async () => await service.remove(id)).rejects.toThrowError(
            NotFoundException,
        );
        expect(repository.findOneOrFail).toHaveBeenCalled();
        expect(repository.delete).not.toHaveBeenCalled();
    });
});
