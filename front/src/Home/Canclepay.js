import React from "react";
import axios from "axios";

const CanclePay = () => {
  const onClickCancelPay = () => {
    axios({
      url: "http://localhost:8080/payments/cancel",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        merchantUid: "ORD20180131-0000183",
        cancelRequestAmount: 10,
        reason: '그냥'
      },
    })
      .then(() => {
        alert(`결제가 취소되었습니다.`);
      })
      .catch(() => alert(`이미 전액 환불된 주문입니다.`));
  };

  return (
    <>
      <button onClick={onClickCancelPay}>환불하기</button>
    </>
  );
};

export default CanclePay;
