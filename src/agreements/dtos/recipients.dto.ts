import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsString, ValidateNested } from 'class-validator';
import { UserDto } from 'src/users/dtos/user.dto';
import { AgreementsDto } from './agreement.dto';

export class RecipientDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  @ValidateNested()
  @Type(() => AgreementsDto)
  agreement1: AgreementsDto;

  @Expose()
  @ValidateNested()
  @Type(() => AgreementsDto)
  agreement2: AgreementsDto;

  @Expose()
  @IsBoolean()
  isSigned: boolean;

  @Expose()
  @IsString()
  signLink: string;
}
