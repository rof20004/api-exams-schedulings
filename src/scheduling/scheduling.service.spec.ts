import { Test, TestingModule } from '@nestjs/testing';
import { SchedulingService } from '../scheduling/scheduling.service';
import { SchedulingRepository } from '../scheduling/scheduling.repository';
import { ExamService } from '../exam/exam.service';
import { ClientService } from '../client/client.service';
import { CreateSchedulingDto } from './dto/create-scheduling.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateSchedulingDto } from './dto/update-scheduling.dto';

const mockSchedulingRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneOrFail: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
});

const mockClientService = () => ({
    findByCpf: jest.fn(),
});

const mockExamService = () => ({
    findByExamId: jest.fn(),
});

describe('SchedulingService', () => {
    let service: SchedulingService;
    let repository;
    let clientService;
    let examService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SchedulingService,
                { provide: SchedulingRepository, useFactory: mockSchedulingRepository },
                { provide: ClientService, useFactory: mockClientService },
                { provide: ExamService, useFactory: mockExamService },
            ],
        }).compile();

        service = module.get<SchedulingService>(SchedulingService);
        repository = module.get<SchedulingRepository>(SchedulingRepository);
        clientService = module.get<ClientService>(ClientService);
        examService = module.get<ExamService>(ExamService);
    });

    it('create client schedulings', async () => {
        const mockExam = { id: '1', name: 'Blood', value: 125.3 };
        examService.findByExamId.mockResolvedValue(mockExam);

        const mockClient = {
            id: '1',
            name: 'Rodolfo',
            cpf: '1234567890',
            birthDate: new Date(),
        };
        clientService.findByCpf.mockResolvedValue(mockClient);

        repository.find.mockResolvedValue([]);

        const mockScheduling = {
            id: '1',
            date: new Date(),
            client: mockClient,
            exam: mockExam,
        };
        repository.save.mockResolvedValue(mockScheduling);

        const payload: CreateSchedulingDto = {
            date: new Date(),
            cpf: '1234567890',
            examId: '1',
        };

        const result = await service.create(payload);
        expect(examService.findByExamId).toHaveBeenCalled();
        expect(clientService.findByCpf).toHaveBeenCalled();
        expect(repository.find).toHaveBeenCalled();
        expect(repository.save).toHaveBeenCalled();
        expect(result).toEqual(mockScheduling);
    });

    it('get client schedulings', async () => {
        const mockResultSchedulings = [
            {
                id: '5fbe65b8e01b411ab26966a0',
                date: '2020-11-25T14:00:00',
                client: {
                    id: '5fbe656fe01b411ab269669f',
                    name: 'Rodolfo do Nascimento Azevedo',
                    cpf: '12345678901',
                    birthDate: '1984-03-04',
                },
                exam: {
                    id: '1',
                    name: '17 Hidroxi-pregnenolona, após estímulo com ACTH, soro',
                    value: 35.6,
                },
            },
            {
                id: '5fbe65b8e01b411ab26966a1',
                date: '2020-11-25T14:00:00',
                client: {
                    id: '5fbe656fe01b411ab269669f',
                    name: 'Rodolfo do Nascimento Azevedo',
                    cpf: '12345678901',
                    birthDate: '1984-03-04',
                },
                exam: {
                    id: '2',
                    name: 'Acidificação Urinária, Prova de, sangue total e urina',
                    value: 84.9,
                },
            },
        ];
        repository.find.mockResolvedValue(mockResultSchedulings);

        const mockResult = {
            total: 120.5,
            client: {
                id: '5fbe656fe01b411ab269669f',
                name: 'Rodolfo do Nascimento Azevedo',
                cpf: '12345678901',
                birthDate: '1984-03-04',
            },
            schedules: [
                {
                    id: '5fbe65b8e01b411ab26966a0',
                    date: '2020-11-25T14:00:00',
                    exam: {
                        id: '1',
                        name: '17 Hidroxi-pregnenolona, após estímulo com ACTH, soro',
                        value: 35.6,
                    },
                },
                {
                    id: '5fbe65b8e01b411ab26966a1',
                    date: '2020-11-25T14:00:00',
                    exam: {
                        id: '2',
                        name: 'Acidificação Urinária, Prova de, sangue total e urina',
                        value: 84.9,
                    },
                },
            ],
        };

        const querySchedulingDto = { cpf: '12345678901' };
        const result = await service.findByClientCpf(querySchedulingDto);
        expect(repository.find).toHaveBeenCalled();
        expect(result).toEqual(mockResult);
    });

    it('get client schedulings and throw error when no found', async () => {
        repository.find.mockResolvedValue([]);

        const querySchedulingDto = { cpf: '12345678901' };
        expect(async () => await service.findByClientCpf(querySchedulingDto)).rejects.toThrowError(NotFoundException);
    });

    it('update a scheduling', async () => {
        const mockResultSchedulings = [];
        repository.find.mockResolvedValue(mockResultSchedulings);

        let mockScheduling = {
            id: '5fbe65b8e01b411ab26966a0',
            date: new Date('2020-11-25T14:00:00'),
            exam: {
                id: '1',
                name: '17 Hidroxi-pregnenolona, após estímulo com ACTH, soro',
                value: 35.6,
            },
        };
        repository.findOneOrFail.mockResolvedValue(mockScheduling);

        const payload: UpdateSchedulingDto = { date: new Date('2020-11-25T14:05:00') };
        mockScheduling.date = payload.date;
        repository.save.mockResolvedValue(mockScheduling);

        const id = '5fbe65b8e01b411ab26966a0';
        const result = await service.update(id, payload);
        expect(repository.findOneOrFail).toHaveBeenCalled();
        expect(repository.save).toHaveBeenCalled();
        expect(result.id).toEqual(mockScheduling.id);
        expect(result.exam.id).toEqual(mockScheduling.exam.id);
        expect(result.date).not.toEqual(mockScheduling);
    });

    it('update a scheduling and throw error when not found', async () => {
        repository.findOneOrFail.mockRejectedValue(null);

        const payload: UpdateSchedulingDto = { date: new Date() };
        const id = '5fbe65b8e01b411ab26966a0';

        expect(async () => await service.update(id, payload)).rejects.toThrowError(NotFoundException);
        expect(repository.findOneOrFail).toHaveBeenCalled();
        expect(repository.save).not.toHaveBeenCalled();
    });

    it('remove a scheduling', async () => {
        const mockFind = { id: 1 };
        repository.findOneOrFail.mockResolvedValue(mockFind);

        const id = '1';
        await service.remove(id);
        expect(repository.findOneOrFail).toHaveBeenCalled();
        expect(repository.delete).toHaveBeenCalled();
    });

    it('remove a scheduling and throw not found', () => {
        repository.findOneOrFail.mockRejectedValue(null);

        const id = '1';
        expect(async () => await service.remove(id)).rejects.toThrowError(
            NotFoundException,
        );
        expect(repository.findOneOrFail).toHaveBeenCalled();
        expect(repository.delete).not.toHaveBeenCalled();
    });
});