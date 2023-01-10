import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AddUserAndProductDto } from './common/dto/add.user.and.product.dto';
import { PaymentCancel } from './common/dto/payment.cancel.dto';
import { PaymentCompleteDto } from './common/dto/payment.complete.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  /**
   *  아임포트 결제 시
   */
  @Post('users')
  async addUserAndProduct(@Body() data: AddUserAndProductDto) {
    return this.appService.addUserAndProduct({ data });
  }

  @Post('payments/complete')
  async paymentComplete(@Body() data: PaymentCompleteDto) {
    return this.appService.paymentComplete(data.impUid, data.merchantUid, data.count);
  }

  @Post('payments/cancel')
  async paymentCancel(@Body() data: PaymentCancel) {
    return this.appService.paymentCancel(data.merchantUid, data);
  }

  /**
   * @todo 인앱 결제 시 api
   * POST payments/app/complete
   * POST payments/app/cancel
   * GET payments/app/count/
   */
}
