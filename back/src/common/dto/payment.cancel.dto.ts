export interface PaymentCancel {
  merchant_uid: string;
  cancel_request_amount: number;
  reason: string;
}
