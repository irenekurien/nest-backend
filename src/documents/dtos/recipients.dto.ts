import { IsBoolean, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { UserDto } from 'src/users/dtos/user.dto';

export class RecipentsDto {
    // @Expose()
    // @IsString()
    // pdf: string;
    
    @Expose()
    @ValidateNested()
    @Type(() => UserDto)
    user1: UserDto;

    @Expose()
    @ValidateNested()
    @Type(() => UserDto)
    user2: UserDto;
}

