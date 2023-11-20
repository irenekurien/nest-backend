import { IsEmail, IsString } from 'class-validator';

export class CreateAgreementDto {
    @IsString()
    user1Name: string;

    @IsEmail()
    user1Email: string;

    @IsString()
    user2Name: string;

    @IsEmail()
    user2Email: string;
}