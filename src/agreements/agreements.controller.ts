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
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { CreateAgreementDto } from './dtos/create-agreement.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { AgreementsService } from './agreements.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AgreementsDto } from './dtos/agreement.dto';

@Controller('agreements')
@Serialize(AgreementsDto)
export class AgreementsController {
    constructor(
        private agreementsService: AgreementsService,
    ) {}
    
    @Get('')
    @UseGuards(AuthGuard)
    getAllAgreements(@CurrentUser() user: User)  {
        return this.agreementsService.findAll(user);
    }

    @Post('/new')
    @UseGuards(AdminGuard)
    createAgreement(@Body() body: CreateAgreementDto)    {
        return this.agreementsService.create(body);
    }

    @Get('/:id')
    @UseGuards(AuthGuard)
    getAgreement(@Param('id') id: string)  {
        return this.agreementsService.findOne(parseInt(id));
    }
}
