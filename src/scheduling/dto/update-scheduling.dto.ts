import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class UpdateSchedulingDto {
    @IsDateString()
    @ApiProperty({ description: 'Scheduling date', example: '2020-11-25T14:00:00', pattern: 'YYYY-DD-MMTHH:mm:ss' })
    date: Date;
}
