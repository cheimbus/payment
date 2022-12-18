import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AddUserAndProductDto } from './common/dto/add.user.and.product.dto';
import { PaymentCancel } from './common/dto/payment.cancel.dto';
import { PaymentCompleteDto } from './common/dto/payment.complete.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('users')
  async addUserAndProduct(@Body() data: AddUserAndProductDto): Promise<any> {
    return this.appService.addUserAndProduct({ data });
  }

  @Post('payments/complete')
  async paymentComplete(@Body() data: PaymentCompleteDto): Promise<any> {
    return this.appService.paymentComplete({ data });
  }

  @Post('payments/cancel')
  async paymentCancel(@Body() data: PaymentCancel): Promise<any> {
    return this.appService.paymentCancel({ data });
  }
}
