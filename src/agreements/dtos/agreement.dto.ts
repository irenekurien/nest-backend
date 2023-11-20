import { IsBoolean, IsNumber, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { UserDto } from 'src/users/dtos/user.dto';

export class AgreementsDto {
    @Expose()
    @IsNumber()
    id: number;

    @Expose()
    @IsBoolean()
    signedByUser1: boolean;

    @Expose()
    @IsBoolean()
    signedByUser2: boolean;
    
    @Expose()
    @ValidateNested()
    @Type(() => UserDto)
    user1: UserDto;

    @Expose()
    @ValidateNested()
    @Type(() => UserDto)
    user2: UserDto;
}

