import React from "react";
import axios from "axios";

const CreateUserProduct = () => {
  const onClickCreateUserProduct = () => {
    axios({
      url: "http://localhost:8080/users",
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: {
        merchantUid: "ORD20180131-0000183",
        name: "마스크q3",
        amount: 100,
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
