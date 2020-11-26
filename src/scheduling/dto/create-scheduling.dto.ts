import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';
import { IsCpf } from '../../utils/decorators/cpf-validator.decorator';

export class CreateSchedulingDto {
    @IsDateString()
    @ApiProperty({ description: 'Scheduling date', example: '2020-11-25T14:00:00', pattern: 'YYYY-DD-MMTHH:mm:ss' })
    date: Date;

    @IsCpf({ message: 'CPF is invalid' })
    @ApiProperty({ description: 'Client identity document', example: '28042658036' })
    cpf: string;

    @IsNotEmpty()
    @ApiProperty({ description: 'Exam identifier', example: '1' })
    examId: string;
}
