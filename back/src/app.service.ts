import { BadRequestException, Injectable } from '@nestjs/common';
import dataSource from 'datasource';
import { Order } from './entitis/Order';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Payment } from './entitis/Payment';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  async addUserAndProduct(data): Promise<any> {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const exiProduct = await dataSource
        .getRepository(Order)
        .createQueryBuilder()
        .where('name=:name', { name: data.data.name })
        .getOne();
      if (!exiProduct) {
        await dataSource
          .createQueryBuilder()
          .insert()
          .into(Order)
          .values({
            merchant_uid: data.data.merchant_uid,
            name: data.data.name,
            amount: data.data.amount,
            buyer_email: data.data.buyer_email,
            buyer_name: data.data.buyer_name,
            buyer_tel: data.data.buyer_tel,
            buyer_addr: data.data.buyer_addr,
            buyer_postcode: data.data.buyer_postcode,
          })
          .execute();
      }
      await queryRunner.commitTransaction();
      return;
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async paymentComplete(data): Promise<any> {
    const queryRunner = await dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { imp_uid, merchant_uid } = data.data;
      const getToken = await axios({
        url: 'https://api.iamport.kr/users/getToken',
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        data: {
          imp_key: this.configService.get('REST_API_KEY'),
          imp_secret: this.configService.get('REST_API_SECRET'),
        },
      });
      const { access_token } = getToken.data.response;
      const getPaymentData = await axios({
        url: `https://api.iamport.kr/payments/${imp_uid}`,
        method: 'get',
        headers: { Authorization: access_token },
      });
      const paymentData = getPaymentData.data.response;
      const { amount, status } = paymentData;
      const amountInDB = await dataSource
        .getRepository(Order)
        .createQueryBuilder()
        .where('merchant_uid=:merchant_uid', { merchant_uid })
        .getOne();
      if (amountInDB.amount === amount) {
        const payment = new Payment();
        payment.imp_uid = imp_uid;
        payment.merchant_uid = merchant_uid;
        payment.amount = amountInDB.amount;
        await queryRunner.manager.getRepository(Payment).save(payment);
        await dataSource
          .createQueryBuilder()
          .update(Order)
          .set({ status })
          .where('merchant_uid=:merchant_uid', { merchant_uid })
          .execute();
      } else {
        throw new Error('위조된 결제시도');
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async paymentCancel(data): Promise<any> {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const paymentData = await dataSource
      .getRepository(Order)
      .createQueryBuilder()
      .where('merchant_uid=:merchant_uid', {
        merchant_uid: data.data.merchant_uid,
      })
      .getOne();
    const cancelAbleAmount =
      paymentData.amount - data.data.cancel_request_amount;
    if (cancelAbleAmount < 0) {
      throw new BadRequestException('이미 전액 환불된 주문입니다.');
    }
    try {
      const getToken = await axios({
        url: 'https://api.iamport.kr/users/getToken',
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        data: {
          imp_key: this.configService.get('REST_API_KEY'),
          imp_secret: this.configService.get('REST_API_SECRET'),
        },
      });
      const { access_token } = getToken.data.response;
      const getCancelData = await axios({
        url: 'https://api.iamport.kr/payments/cancel',
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: access_token,
        },
        data: {
          reason: data.data.reason,
          merchant_uid: data.data.merchant_uid,
          amount: data.data.cancel_request_amount,
          checksum: paymentData.amount, // 부분환불은 안됨 따라서 전액환불로 해야함
        },
      });
      const { response } = getCancelData.data;
      await dataSource
        .createQueryBuilder()
        .update(Payment)
        .set({
          cancel_amount: cancelAbleAmount,
          reason: response.cancel_reason,
        })
        .where('merchant_uid=:merchant_uid', {
          merchant_uid: data.data.merchant_uid,
        })
        .execute();
      await dataSource
        .createQueryBuilder()
        .update(Order)
        .set({ status: response.status, amount: cancelAbleAmount })
        .where('merchant_uid=:merchant_uid', {
          merchant_uid: data.data.merchant_uid,
        })
        .execute();
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
