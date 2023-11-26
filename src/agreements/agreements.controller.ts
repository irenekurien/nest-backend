import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
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
  constructor(private agreementsService: AgreementsService) {}

  @Get('')
  @UseGuards(AuthGuard)
  async getAllAgreements(@CurrentUser() user: User) {
    return await this.agreementsService.findAll(user);
  }

  @Post('/new')
  @UseGuards(AdminGuard)
  @UseGuards(AuthGuard)
  async createAgreement(@Body() body: CreateAgreementDto, @Res() res: any) {
    const agreement = await this.agreementsService.create(body);
    return res.status(200).json(agreement);
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  getAgreement(@Param('id') id: string) {
    return this.agreementsService.findOne(parseInt(id));
  }

  @Post('/webhook')
  handleWebhook(@Body() payload: any) {
    this.agreementsService.handleWebhooks(payload)
  }

  @Delete('/:id')
  delete(@Param('id') id) {
    this.agreementsService.remove(id)
  }

  @Get('/download/:id')
  downloadAgreement(@Param('id') id) {
    return this.agreementsService.getLink(id)
  }
}
