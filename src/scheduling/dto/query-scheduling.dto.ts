import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { IsCpf } from "../../utils/decorators/cpf-validator.decorator";

export class QuerySchedulingDto {
    @IsCpf({ message: 'cpf is invalid' })
    @ApiProperty({ description: 'Client identity document', example: '28042658036' })
    cpf: string;
}