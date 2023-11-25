import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    Param, 
    Patch, 
    Post, 
    Query,
    Req, Res,
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

    @Get('/me')
    @UseGuards(AuthGuard)
    async getCurrentUser(@CurrentUser() user: User) {
        return user;
    }

    @Post('/signup')
    async createUser (@Body() body: CreateUserDto, @Req() req: any, @Res() res: any) {
        const data = await this.authServive.signup(body.name, body.email, body.password);
        res.status(200).json(data);
    }

    @Post('/signin')
    async signin (@Body() body: SignInUserDto, @Req() req: any, @Res() res: any) {
        const data = await this.authServive.signin(body.email, body.password);
        res.status(200).json(data);
    }

    @Post('/signout')
    async signout (@Session() session: any) {
        session.userId = null;
        return;
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
