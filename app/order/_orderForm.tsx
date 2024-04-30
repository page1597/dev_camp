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
import React, { useEffect, useState } from "react";

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

  function onSelectCupon(value: string) {
    // 쿠폰 이름 선택
    let amount;
    let cuponPrice;

    // 1. 정률제일 경우 (%)
    if (value.includes("%")) {
      amount = userInfo.cupon.find((cupon) => cupon.name === value)?.amount;
      if (amount === undefined) {
        alert("쿠폰이 유효하지 않습니다.");
        return;
      }
      cuponPrice = shippingInfo.productPrice * (amount / 100);
    }
    // 2. 정액제일 경우 (원)
    else {
      amount = userInfo.cupon.find((cupon) => cupon.name === value)?.amount;
      if (amount === undefined) {
        alert("쿠폰이 유효하지 않습니다.");
        return;
      }
      cuponPrice = amount;
    }

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
  // 사용할 포인트 설정
  function onPointChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setShippingInfo({
      ...shippingInfo,
      pointAmount: parseInt(value),
    });
  }

  // 보유 포인트 전액 사용
  function onUseAllPoints() {
    setShippingInfo({
      ...shippingInfo,
      pointAmount: userInfo.point,
    });
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
      <div className="w-full grid grid-cols-[minmax(_500px,_1fr)_350px] gap-4 mt-14">
        <div className="flex flex-col gap-4">
          <Card className="border-none rounded-none text-sm">
            <CardContent className="p-6">
              <h2 className="font-bold text-base mb-6">주문 상품 정보</h2>
              <div id="order_product_info" className="flex flex-col gap-4">
                {ordersInfo.map((order) => (
                  <div className="flex flex-col gap-2" key={order.id}>
                    {order.orderItem.map((item) => (
                      <div className="flex gap-4" key={order.id}>
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
                    <SelectItem key={option.id} value={option.value}>
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
                      <SelectItem key={cupon.name} value={cupon.name}>
                        {cupon.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button className="bg-blue-600 rounded-sm">쿠폰적용</Button>
              </div>
              <div>쿠폰 번호</div>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="쿠폰 번호 입력"
                  className="rounded-sm mb-4"
                />
                <Button
                  className="bg-blue-600 rounded-sm"
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
                  value={shippingInfo.pointAmount}
                />
                <Button
                  className="bg-blue-600 rounded-sm"
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
                  {shippingInfo.productPrice -
                    (shippingInfo.pointAmount + shippingInfo.cuponAmount) +
                    shippingInfo.shippingFee}
                  원
                </div>
              </div>
              <div className="bg-stone-50 absolute bottom-0 left-0 w-full px-6 py-4">
                <div>
                  <span className="text-blue-500">700</span> 포인트 적립예정
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none rounded-none text-sm">
            <CardContent className="p-6 ">
              {/* default check 설정하기 */}
              <h2 className="font-bold text-base mb-6">결제 방법</h2>
              <RadioGroup
                defaultValue="option-one"
                defaultChecked={true}
                className="grid grid-cols-2"
              >
                {paymentMethod.map((method) => (
                  <div className="flex items-center space-x-2" key={method.id}>
                    <RadioGroupItem value={method.value} id={method.value} />
                    <Label htmlFor={method.value}>{method.value}</Label>
                  </div>
                ))}
              </RadioGroup>
              <div className="flex flex-col gap-2 my-4">
                <Select>
                  <SelectTrigger className="rounded-sm">
                    <SelectValue placeholder="계좌를 선택해주세요." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">
                      00은행: 0000-00-0000 예금주명
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="입금자명 (미입력시 주문자명)" />
                <span className="text-zinc-500">
                  주문 후 n시간 동안 미입금시 자동 취소됩니다.
                </span>
              </div>
              <hr />
              <div className="mt-4 flex items-center gap-2 text-zinc-800">
                <Checkbox
                  id="cashReceipts"
                  checked={shippingInfo.cashReceipts}
                  onCheckedChange={onCashReceiptsChange}
                />
                <label htmlFor="cashReceipts">현금영수증 신청</label>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none rounded-none text-sm relative">
            <CardContent className="p-6 pb-16">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-zinc-800">
                  <Checkbox
                    id="all_agreed"
                    checked={shippingInfo.agreed}
                    onCheckedChange={onAgreementChange}
                  />
                  <label htmlFor="all_agreed">전체 동의</label>
                </div>
                <div className="flex items-center gap-2 text-zinc-800">
                  &nbsp;
                  <Checkbox
                    id="agreed"
                    checked={shippingInfo.agreed}
                    onCheckedChange={onAgreementChange}
                  />
                  <label htmlFor="agreed">
                    구매조건 확인 및 결제진행에 동의
                  </label>
                </div>
              </div>
              <Button
                onClick={submitPayment}
                className="bg-blue-600 absolute bottom-0 left-0 w-full rounded-none"
              >
                결제하기
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
