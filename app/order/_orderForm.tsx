// 포인트 먼저 적용하고 쿠폰 적용하기
//
// 커밋 메시지 내용, 리드미 쓰기

"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Order } from "@/types/order";
import { User } from "@/types/user";
import Image from "next/image";
import React, { use, useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import {
  PaymentWidgetInstance,
  loadPaymentWidget,
  ANONYMOUS,
} from "@tosspayments/payment-widget-sdk";
import { useQuery } from "@tanstack/react-query";

// 배송 메모
const shippingMemoOptions = [
  { id: 1, value: "문 앞에 놓아주세요." },
  { id: 2, value: "관리실에 맡겨주세요." },
];

// 결제 방법
const paymentMethod = [
  { id: 1, value: "신용카드" },
  { id: 2, value: "가상계좌" },
  { id: 3, value: "무통장 입금" },
  { id: 4, value: "핸드폰 결제" },
  { id: 5, value: "카카오페이" },
];
const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = nanoid();

export default function OrderForm({
  user,
  orders,
}: {
  user: User;
  orders: Order[];
}) {
  const [cuponNumber, setCuponNumber] = useState<string>(""); // 번호로 쿠폰 적용
  const [userInfo, setUserInfo] = useState(user); // user 대신 '주문자'라는 뜻의 변수명으로 변경하기
  const [ordersInfo, setOrdersInfo] = useState(orders);
  const [shippingInfo, setShippingInfo] = useState({
    id: 1,
    shippingName: userInfo.name,
    shippingPhone: user.phone,
    shippingAddress:
      "서울특별시 서대문구 성산로7길 89-8 (연희동) 주식회사 아임웹 (03706)",
    memo: "배송 메모",
    cuponAmount: 0, // 사용할 쿠폰
    pointAmount: 0, // 사용할 포인트
    shippingFee: 2500, // n만원 이상 배송비 무료
    productPrice: 0, // 쿠폰, 포인트 포함 전 가격

    // 결제 정보
    paymentMethod: "신용카드",
    cashReceipts: false, // 현금 영수증 신청
    agreed: false, // 구매조건 확인 및 결제진행 동의
  });

  const finalPaymentAmountBeforeShippingFee =
    shippingInfo.productPrice -
    (shippingInfo.pointAmount + shippingInfo.cuponAmount);

  useEffect(() => {
    let total = 0;
    ordersInfo.forEach((orders) =>
      orders.orderItem.forEach((item) => {
        total += item.amount * item.product.price;
      })
    );
    setShippingInfo({
      ...shippingInfo,
      productPrice: total,
    });
  }, []);

  const [cuponToUse, setCuponToUse] = useState<string>("");
  const [selectedCuponPrice, setSelectedCuponPrice] = useState<number>(0);

  // 정률제 쿠폰인지 여부 반환
  function isFlatRateCupon(value: string) {
    return value.includes("%");
  }

  /*
    정액제일 경우: 쿠폰 금액 반환
    정률제일 경우: 쿠폰 할인율 반환
  */
  function getAmountOfCupon(value: string): number {
    let amount;
    amount = userInfo.cupon.find((cupon) => cupon.name === value)?.amount;
    if (amount === undefined) {
      alert("쿠폰이 유효하지 않습니다.");
      return 0;
    }
    return amount;
  }

  function onSelectCupon(value: string) {
    // 쿠폰 이름 선택
    let amount;
    let cuponPrice;
    setCuponToUse(value);
    // 1. 정률제일 경우 (%)
    if (isFlatRateCupon(value)) {
      amount = getAmountOfCupon(value);
      // 여기 변경하기. 포인트 먼저 적용된 금액으로!
      cuponPrice = (shippingInfo.productPrice - pointToUse) * (amount / 100);
    }
    // 2. 정액제일 경우 (원)
    else {
      amount = getAmountOfCupon(value);
      cuponPrice = amount;
    }

    setSelectedCuponPrice(cuponPrice);
  }

  function onChooseCupon() {
    let cuponPrice = selectedCuponPrice;
    if (cuponPrice > shippingInfo.productPrice - shippingInfo.pointAmount) {
      alert(
        "선택한 쿠폰의 금액이 상품 가격을 초과하여 최대 할인 금액을 상품 가격으로 제한합니다"
      );
      cuponPrice = Math.max(
        shippingInfo.productPrice - shippingInfo.pointAmount,
        0
      );
    }
    alert("쿠폰이 적용되었습니다.");
    setShippingInfo({
      ...shippingInfo,
      cuponAmount: cuponPrice,
    });
  }

  function onSelectShippingMemo(value: string) {
    setShippingInfo({
      ...shippingInfo,
      memo: value,
    });
  }

  // 주문한 사람
  const [orderer, setOrderer] = useState({
    name: userInfo.name,
    phone: userInfo.phone,
    email: userInfo.email,
  });
  function onOrdererInfoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setOrderer({
      ...orderer,
      [id]: value,
    });
  }

  // 배송 받는 사람
  const [recipient, setRecipient] = useState({
    name: shippingInfo.shippingName,
    phone: shippingInfo.shippingPhone,
    address: shippingInfo.shippingAddress,
  });
  function onRecipientInfoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setRecipient({
      ...recipient,
      [id]: value,
    });
  }

  const [pointToUse, setPointToUse] = useState<number>(0);

  // 쿠폰 먼저 적용하고, 포인트 적용할때 포인트 먼저 적용되게 하기
  // 정률제일 경우만 해당
  useEffect(() => {
    let cuponAmount = 0;
    let amount;

    // 정률제일 경우
    if (isFlatRateCupon(cuponToUse)) {
      amount = getAmountOfCupon(cuponToUse);
      cuponAmount = (shippingInfo.productPrice - pointToUse) * (amount / 100);
      setShippingInfo({
        ...shippingInfo,
        cuponAmount: cuponAmount,
      });
    }
  }, [pointToUse]);

  // 사용할 포인트 설정
  function onPointChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    const pointValue = Number(value);
    if (!isNaN(pointValue)) {
      setPointToUse(parseInt(value));
    }
  }

  function onChoosePoint() {
    let pointPrice = pointToUse;

    if (pointPrice > userInfo.point) {
      alert("보유 포인트 이상 사용은 불가능합니다.");
      pointPrice = 0;
    }

    if (pointPrice > shippingInfo.productPrice - shippingInfo.cuponAmount) {
      alert(
        "포인트가 상품 가격을 초과하여 최대 할인 금액을 상품 가격으로 제한합니다."
      );
      pointPrice = Math.max(
        shippingInfo.productPrice - shippingInfo.cuponAmount,
        0
      );
    }
    setPointToUse(pointPrice);
    setShippingInfo({
      ...shippingInfo,
      pointAmount: pointPrice,
    });
  }

  // 보유 포인트 전액 사용
  function onUseAllPoints() {
    let pointPrice = userInfo.point;

    if (pointPrice > shippingInfo.productPrice - shippingInfo.cuponAmount) {
      alert(
        "포인트가 상품 가격을 초과하여 최대 할인 금액을 상품 가격으로 제한합니다."
      );
      pointPrice = Math.max(
        shippingInfo.productPrice - shippingInfo.cuponAmount,
        0
      );
    }
    setPointToUse(pointPrice);
    setShippingInfo({
      ...shippingInfo,
      pointAmount: pointPrice,
    });
    // userInfo.point에서도 차감하기
  }

  // 현금영수증
  function onCashReceiptsChange() {
    setShippingInfo({
      ...shippingInfo,
      cashReceipts: !shippingInfo.cashReceipts,
    });
  }

  // 구매조건 확인 및 결제진행 동의
  function onAgreementChange() {
    setShippingInfo({
      ...shippingInfo,
      agreed: !shippingInfo.agreed,
    });
  }

  const { data: paymentWidget } = usePaymentWidget(clientKey, customerKey);
  // const { data: paymentWidget } = usePaymentWidget(clientKey, ANONYMOUS); // 비회원 결제
  const paymentMethodsWidgetRef = useRef<ReturnType<
    PaymentWidgetInstance["renderPaymentMethods"]
  > | null>(null);
  const agreementsWidgetRef = useRef<ReturnType<
    PaymentWidgetInstance["renderAgreement"]
  > | null>(null);
  const price =
    Math.max(finalPaymentAmountBeforeShippingFee, 0) + shippingInfo.shippingFee;

  const [paymentMethodsWidgetReady, isPaymentMethodsWidgetReady] =
    useState(false);

  useEffect(() => {
    if (paymentWidget == null) {
      return;
    }

    // ------  결제위젯 렌더링 ------
    const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
      "#payment-widget",
      { value: price },
      { variantKey: "DEFAULT" }
    );

    // ------  이용약관 렌더링 ------
    // @docs https://docs.tosspayments.com/reference/widget-sdk#renderagreement선택자-옵션
    paymentWidget.renderAgreement("#agreement", {
      variantKey: "AGREEMENT",
    });

    //  ------  결제 UI 렌더링 완료 이벤트 ------
    paymentMethodsWidget.on("ready", () => {
      paymentMethodsWidgetRef.current = paymentMethodsWidget;
      isPaymentMethodsWidgetReady(true);
    });
  }, [paymentWidget]);

  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current;

    if (paymentMethodsWidget == null) {
      return;
    }

    // ------ 금액 업데이트 ------
    // @docs https://docs.tosspayments.com/reference/widget-sdk#updateamount결제-금액
    paymentMethodsWidget.updateAmount(price);
  }, [price]);

  // 결제하기
  function submitPayment() {
    if (!shippingInfo.agreed) {
      alert("구매조건 확인 및 결제진행에 동의해주세요.");
      return;
    }
    alert("결제가 완료되었습니다.");

    const { cupon, point, order, ...otherUserInfo } = userInfo;
    const paymentInfo = {
      ...otherUserInfo,
      ...ordersInfo,
      ...shippingInfo,
    };
    console.log("최종 결제 정보", paymentInfo);
  }

  return (
    <div className="text-zinc-800 flex flex-col font-semibold items-center p-6">
      <h1 className="text-2xl">결제하기</h1>
      <div className="w-full grid grid-cols-[minmax(_350px,_1fr)_minmax(_470px,_1fr)] gap-4 mt-14">
        {/* <div className="w-full grid grid-cols-[minmax(_500px,_1fr)_380px] gap-4 mt-14"> */}

        <div className="flex flex-col gap-4">
          <Card className="border-none rounded-none text-sm">
            <CardContent className="p-6">
              <h2 className="font-bold text-base mb-6">주문 상품 정보</h2>
              <div id="order_product_info" className="flex flex-col gap-4">
                {ordersInfo.map((order) => (
                  <div className="flex flex-col gap-2" key={order.id}>
                    {order.orderItem.map((item) => (
                      <div className="flex gap-4" key={item.product.id}>
                        <div
                          id={item.product.image}
                          className="w-[100px] h-[100px] overflow-hidden"
                        >
                          <Image
                            // src 변경하기
                            src={item.product.image}
                            alt="product-image"
                            layout="fixed"
                            width={100}
                            height={100}
                            className="w-full h-auto block"
                          />
                        </div>
                        <div className="text-sm font-normal gap-1">
                          {item.product.name}
                          <div className="text-zinc-500 text-xs">
                            [옵션: {item.color}/{item.size}] -{item.amount}개
                          </div>
                          <div className="font-semibold">
                            {(item.product.price * item.amount).toLocaleString(
                              "ko-KR"
                            )}
                            원
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border-none rounded-none text-sm">
            <CardContent className="p-6">
              <h2 className="font-bold text-base mb-6">주문자 정보</h2>
              <div className="flex justify-between">
                <div>
                  <div id="user_name" className="font-semibold">
                    {userInfo.name}
                  </div>
                  <div
                    id="user_phone"
                    className="font-normal text-sm text-zinc-500"
                  >
                    {userInfo.phone}
                  </div>
                  <div id="user_email" className="font-normal text-sm">
                    {userInfo.email}
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="rounded-sm">
                      수정
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>주문자 정보</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-2 py-2">
                      <div className="grid grid-cols-4 items-center">
                        <Label htmlFor="name">이름</Label>
                        <Input
                          id="name"
                          value={orderer.name}
                          className="col-span-3"
                          onChange={onOrdererInfoChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center">
                        <Label htmlFor="phone">연락처</Label>
                        <Input
                          id="phone"
                          value={orderer.phone}
                          className="col-span-3"
                          onChange={onOrdererInfoChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center">
                        <Label htmlFor="email">이메일</Label>
                        <Input
                          id="email"
                          value={orderer.email}
                          className="col-span-3"
                          onChange={onOrdererInfoChange}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          type="submit"
                          className="rounded-sm"
                          onClick={() => {
                            setUserInfo({
                              ...userInfo,
                              name: orderer.name,
                              phone: orderer.phone,
                              email: orderer.email,
                            });
                          }}
                        >
                          확인
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none rounded-none text-sm">
            <CardContent className="p-6">
              <h2 className="font-bold text-base mb-6">배송 정보</h2>
              <div className="flex justify-between">
                <div>
                  <div id="user_name" className="font-semibold">
                    {shippingInfo.shippingName}
                  </div>
                  <div
                    id="user_phone"
                    className="font-normal text-sm text-zinc-500"
                  >
                    {shippingInfo.shippingPhone}
                  </div>
                  <div id="user_address" className="font-normal text-sm">
                    {shippingInfo.shippingAddress}
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="rounded-sm">
                      수정
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>배송 정보</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-2 py-2">
                      <div className="grid grid-cols-4 items-center">
                        <Label htmlFor="name">이름</Label>
                        <Input
                          id="name"
                          value={recipient.name}
                          onChange={onRecipientInfoChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center">
                        <Label htmlFor="phone">연락처</Label>
                        <Input
                          id="phone"
                          onChange={onRecipientInfoChange}
                          value={recipient.phone}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center">
                        <Label htmlFor="address">주소</Label>
                        <Input
                          id="address"
                          onChange={onRecipientInfoChange}
                          value={recipient.address}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          type="submit"
                          className="rounded-sm"
                          onClick={() => {
                            setShippingInfo({
                              ...shippingInfo,
                              shippingName: recipient.name,
                              shippingPhone: recipient.phone,
                              shippingAddress: recipient.address,
                            });
                          }}
                        >
                          확인
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="mt-6">배송 메모</div>
              <Select onValueChange={onSelectShippingMemo}>
                <SelectTrigger className="rounded-sm mt-2">
                  <SelectValue placeholder="배송 메모를 선택해주세요." />
                </SelectTrigger>
                <SelectContent>
                  {shippingMemoOptions.map((option) => (
                    <SelectItem value={option.value} key={option.id}>
                      {option.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          <Card className="border-none rounded-none text-sm">
            <CardContent className="p-6">
              <h2 className="font-bold text-base mb-6">쿠폰/포인트</h2>
              <div>쿠폰</div>
              <div className="flex gap-2 mt-2">
                <Select onValueChange={onSelectCupon}>
                  <SelectTrigger className="rounded-sm mb-4">
                    <SelectValue placeholder="쿠폰을 선택해주세요." />
                  </SelectTrigger>
                  <SelectContent>
                    {userInfo.cupon.map((cupon) => (
                      <SelectItem value={cupon.name} key={cupon.name}>
                        {cupon.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  className="bg-blue-500 rounded-sm"
                  onClick={onChooseCupon}
                >
                  쿠폰적용
                </Button>
              </div>
              <div>쿠폰 번호</div>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="쿠폰 번호 입력"
                  className="rounded-sm mb-4"
                />
                <Button
                  className="bg-blue-500 rounded-sm"
                  //   onClick={() => console.log(orderInfo)}
                >
                  번호확인
                </Button>
              </div>
              <div>포인트</div>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="0"
                  className="rounded-sm mb-2"
                  onChange={onPointChange}
                  value={pointToUse}
                  onBlur={onChoosePoint}
                />
                <Button
                  className="bg-blue-500 rounded-sm"
                  onClick={onUseAllPoints}
                >
                  전액사용
                </Button>
              </div>
              <div>보유 포인트 {userInfo.point.toLocaleString("ko-KR")}</div>
              <div className="font-normal text-sm text-zinc-500">
                5,000 포인트 이상 보유 및 10,000원 이상 구매시 사용 가능
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-4">
          <Card className="border-none rounded-none relative text-sm">
            <CardContent className="p-6 pb-20">
              <h2 className="font-bold text-base mb-6">최종 결제금액</h2>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-zinc-500 font-normal">상품 가격</div>
                <div className="text-right text-zinc-700">
                  {shippingInfo.productPrice.toLocaleString("ko-KR")}원
                </div>
                <div className="text-zinc-500 font-normal">쿠폰 할인</div>
                <div className="text-right text-zinc-700">
                  -{shippingInfo.cuponAmount.toLocaleString("ko-KR")}원
                </div>
                <div className="text-zinc-500 font-normal">포인트 사용</div>
                <div className="text-right text-zinc-700">
                  -{shippingInfo.pointAmount.toLocaleString("ko-KR")}원
                </div>
                <div className="text-zinc-500 font-normal">배송비</div>
                <div className="text-right text-zinc-700">
                  +{shippingInfo.shippingFee.toLocaleString("ko-KR")}원
                </div>
                <hr className="col-span-2 my-4" />
                <div>총 결제금액</div>
                <div className="text-blue-500 rounded-none text-right">
                  {price.toLocaleString("ko-KR")}원
                </div>
              </div>
              <div className="bg-stone-50 absolute bottom-0 left-0 w-full px-6 py-4">
                <div>
                  <span className="text-blue-500">700</span> 포인트 적립예정
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <div id="payment-widget" />
            <div
              id="agreement"
              className="bg-zinc-400"
              style={{ width: "100%" }}
            />

            <Button
              disabled={!paymentMethodsWidgetReady}
              className="w-full bg-blue-500 rounded-none rounded-b-sm text-base py-6"
              onClick={async () => {
                try {
                  // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
                  // @docs https://docs.tosspayments.com/reference/widget-sdk#requestpayment결제-정보
                  await paymentWidget?.requestPayment({
                    orderId: nanoid(),
                    orderName: `${ordersInfo[0].orderItem[0].product.name}외 ${
                      ordersInfo[0].orderItem.length - 1
                    }건`,
                    customerName: userInfo.name,
                    customerEmail: userInfo.email,
                    customerMobilePhone: userInfo.phone,
                    successUrl: `${window.location.origin}/success`,
                    failUrl: `${window.location.origin}/fail`,
                  });
                } catch (error) {
                  // 에러 처리하기
                  console.error(error);
                }
              }}
            >
              결제하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
function usePaymentWidget(clientKey: string, customerKey: string) {
  return useQuery({
    queryKey: ["payment-widget", clientKey, customerKey],
    queryFn: () => {
      // ------  결제위젯 초기화 ------
      // @docs https://docs.tosspayments.com/reference/widget-sdk#sdk-설치-및-초기화
      return loadPaymentWidget(clientKey, customerKey);
    },
  });
}
