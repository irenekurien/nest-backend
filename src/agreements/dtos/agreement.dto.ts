import { IsNumber, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { RecipientDto } from './recipients.dto';

export class AgreementsDto {
    @Expose()
    @IsNumber()
    id: number;

    @Expose()
    @IsNumber()
    requestId: number;

    @Expose()
    @ValidateNested()
    @Type(() => RecipientDto)
    recipient1: RecipientDto;

    @Expose()
    @ValidateNested()
    @Type(() => RecipientDto)
    recipient2: RecipientDto;
}


