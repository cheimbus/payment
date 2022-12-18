import React from "react";
import axios from "axios";

const CreateUserProduct = () => {
  const onClickCreateUserProduct = () => {
    axios({
      url: "http://localhost:8080/users",
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: {
        merchant_uid: "ORD20180131-0000001",
        name: "마스크",
        amount: 100,
        buyer_email: "exam@gmail.com",
        buyer_name: "황시우",
        buyer_tel: "010-1234-5678",
        buyer_addr: "서울특별시 강남구 압구정동",
        buyer_postcode: "00001",
      },
    });
  };
  return (
    <>
      <button onClick={onClickCreateUserProduct}>구매목록 생성하기</button>
    </>
  );
};
export default CreateUserProduct;
