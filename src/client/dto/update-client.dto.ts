import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty } from 'class-validator';
import { IsCpf } from '../../utils/decorators/cpf-validator.decorator';

export class UpdateClientDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Client full name', example: 'Fulano de Beltrano e Ciclano' })
  name: string;

  @IsCpf({ message: 'cpf is invalid' })
  @ApiProperty({ description: 'Client identity document', example: '28042658036' })
  cpf: string;

  @IsISO8601()
  @ApiProperty({ description: 'Client born date', example: '1984-03-04', pattern: 'YYYY-MM-DD' })
  birthDate: Date;
}
