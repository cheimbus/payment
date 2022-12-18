import React, { useEffect } from "react";
import axios from "axios";

const Payment = () => {
  useEffect(() => {
    const jquery = document.createElement("script");
    jquery.src = "https://code.jquery.com/jquery-1.12.4.min.js";
    const iamport = document.createElement("script");
    iamport.src = "https://cdn.iamport.kr/js/iamport.payment-1.1.7.js";
    document.head.appendChild(jquery);
    document.head.appendChild(iamport);
    return () => {
      document.head.removeChild(jquery);
      document.head.removeChild(iamport);
    };
  }, []);

  const onClickPayment = () => {
    const { IMP } = window;
    IMP.init("imp55161168");
    const data = {
      pg: "html5_inicis",
      pay_method: "card",
      merchant_uid: "ORD20180131-0000001",
      name: "마스크",
      amount: 100,
      buyer_email: "exam@gmail.com",
      buyer_name: "황시우",
      buyer_tel: "010-1234-5678",
      buyer_addr: "서울특별시 강남구 압구정동",
      buyer_postcode: "00001",
    };
    IMP.request_pay(data, callback);
  };

  const callback = (response) => {
    const { success, error_msg, imp_uid, merchant_uid } = response;
    if (success) {
      axios({
        url: "http://localhost:8080/payments/complete",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: {
          imp_uid,
          merchant_uid,
        },
      }).then(() => {
        alert(`결제를 성공하였습니다.`);
      });
    } else {
      alert(`결제에 실패하였습니다. 에러 내용 : ${error_msg}`);
    }
  };

  return (
    <>
      <button onClick={onClickPayment}>결제하기</button>
    </>
  );
};

export default Payment;
