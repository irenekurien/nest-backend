import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,     
        private jwtService: JwtService
    ) {}

    async signup(name: string, email: string, password: string)    {
        const user = await this.usersService.find(email);
        if(user.length) {
            throw new BadRequestException('Email already in use');
        }

        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        const result = salt + '.' + hash.toString('hex');
        const newUser = await this.usersService.create(name, email, result);

        const payload = { sub: newUser.id, email: email };
        return {
            userId: newUser.id,
            accessToken: await this.jwtService.signAsync(payload),
        };
    }

    async signin(email: string, password: string)    {
        const [user] = await this.usersService.find(email);
        if(!user)   {
            throw new UnauthorizedException(user, email);
        }

        const [salt, storedHash] = user.password.split('.');
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if(storedHash !== hash.toString('hex')) {
            throw new BadRequestException('Incorrect Password');
        } 

        const payload = { sub: user.id, email: user.email };
        return {
            userId: user.id,
            accessToken: await this.jwtService.signAsync(payload),
        };
    }
}
