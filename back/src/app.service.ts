import { BadRequestException, Injectable } from '@nestjs/common';
// import dataSource from 'datasource';
import { ConfigService } from '@nestjs/config';
import { Payment } from './entitis/Payment';
import { catchError, map, mergeMap } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { getConnection } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) { }
  async addUserAndProduct(data): Promise<any> {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const existProduct = await getConnection()
        .getRepository(Payment)
        .createQueryBuilder()
        .where('name=:name', { name: data.data.name })
        .getOne();
      if (!existProduct) {
        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(Payment)
          .values({
            merchantUid: data.data.merchantUid,
            name: data.data.name,
            amount: data.data.amount,
            device: 'pc'
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

  // web hook
  /**
   * 아임포트 웹 훅을 이용한 결제
   */
  async paymentComplete(impUid: string, merchantUid: string, count: number) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      this.getIamportPaymentData(impUid).subscribe(async getData => {
        const { amount, status } = getData.response;
        const getPaymentData = await this.getPaymentData(merchantUid);
        if (getPaymentData.amount === amount && status === 'paid') {
          /**@todo users의 id를 가져와서 users.count와 파라미터 count를 더해줘서 업데이트 시켜줘야 함 users, membership에 각각 넣음 */

          await getConnection().createQueryBuilder()
            .update(Payment)
            .set({ status, impUid, count, device: 'pc' })
            .where('merchantUid=:merchantUid', { merchantUid })
            .execute();
        } else {
          throw new BadRequestException('위조된 결제 시도');
        }
      })
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  // 부분 환불
  /** 
   * @todo 환불이 부분 환불이라면 퍼센트 따져서 환불 시켜야 한다.
   * 
   * 
   */
  async paymentCancel(merchantUid: string, refundInformations: any) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const { impUid, amount, cancelAmount } = await this.getPaymentData(merchantUid);
    const paymentData = { amount, cancelAmount };
    this.refund(impUid, paymentData, refundInformations).subscribe(data => console.log(data))

  }

  refund(impUid: string, paymentData: any, refundInformations: any) {
    const { reason, cancelRequestAmount } = refundInformations;
    const cancelAbleAmount = paymentData.amount - paymentData.cancelAmount;
    const data = {
      // reason, // 가맹점 클라이언트로부터 받은 환불사유
      imp_uid: impUid, // impUid를 환불 `unique key`로 입력
      amount: cancelRequestAmount, // 가맹점 클라이언트로부터 받은 환불금액
      checksum: cancelAbleAmount, // [권장] 환불 가능 금액 입력
    }
    return this.getIamportAccessToken().pipe(mergeMap(accessToken => {
      return this.httpService
        .post('https://api.iamport.kr/payments/cancel', data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: accessToken,
          },
        })
        .pipe(
          catchError(error => {
            throw new BadRequestException(error);
          }),
          map(response => response)
        );
    }))
  }

  getIamportPaymentData(impUid: string) {
    return this.getIamportAccessToken().pipe(
      mergeMap(accessToken =>
        this.httpService
          .get(`https://api.iamport.kr/payments/${impUid}`, {
            headers: { Authorization: accessToken },
          })
          .pipe(
            catchError(error => {
              throw new BadRequestException(error);
            }),
            map(response => response.data),
          ),
      ),
    );
  }

  getIamportAccessToken() {
    const data = {
      imp_key: this.configService.get('REST_API_KEY'),
      imp_secret: this.configService.get('REST_API_SECRET'),
    }
    return this.httpService
      .post('https://api.iamport.kr/users/getToken', data, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        map(data => data.data.response.access_token),
        catchError(error => {
          throw new BadRequestException(error);
        }))
  }

  async getPaymentData(merchantUid: string) {
    return getConnection().getRepository(Payment).createQueryBuilder().where('merchantUid=:merchantUid', { merchantUid }).getOne();
  }
}
