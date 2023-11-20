import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    Param, 
    Patch, 
    Post, 
    Query,
    Session,
    UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { SignInUserDto } from './dtos/signin-user.dto';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authServive: AuthService
    ) {}

    @Post('/signup')
    async createUser (@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authServive.signup(body.name, body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signin')
    async signin (@Body() body: SignInUserDto, @Session() session: any) {
        const user = await this.authServive.signin(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signout')
    async signout (@Session() session: any) {
        session.userId = null;
    }

    @Get('/me')
    @UseGuards(AuthGuard)
    getCurrentUser(@CurrentUser() user: User) {
        return user;
    }

    @Get('/:id')
    getUser (@Param('id') id: string) {
        return this.usersService.findOne(parseInt(id));
    }

    @Get('/all')
    getAllUsers (@Query('email') email: string) {
        return this.usersService.find(email);
    }

    @Patch('/:id')
    @UseGuards(AuthGuard)
    updateUser (@Param('id') id: string, @Body() body: CreateUserDto) {
        return this.usersService.update(parseInt(id), body)
    }

    @Delete('/:id')
    @UseGuards(AuthGuard)
    deleteUser (@Param('id') id: string) {
        this.usersService.remove(parseInt(id))
    }
}
