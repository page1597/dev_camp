"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function Page() {
  const cupons = [
    {
      name: "쿠폰 1",
      amount: 1000,
    },
    {
      name: "쿠폰 2",
      amount: 2000,
    },
  ];

  // 번호로 쿠폰 적용
  const [cuponNumber, setCuponNumber] = useState<string>("");

  // 주문 정보
  const [orderInfo, setOrderInfo] = useState({
    productName: "Rayon Unbal Lace Top",
    productPrice: 18000,
    productColor: "ivory(아이보리)",
    productSize: "free",
    productAmount: 1,
    ordererName: "홍길동",
    ordererPhone: "01012345678",
    ordererEmail: "user@imweb.me",
    shippingName: "홍길동",
    shippingPhone: "01012345678",
    shippingAddress:
      "서울특별시 서대문구 성산로7길 89-8 (연희동) 주식회사 아임웹 (03706)",
    shippingMemo: "배송 메모",
    cupon: cupons[0].amount,
    point: 2300,
    shippingFee: 2500,
  });
  // 보유 포인트 -> 변하지 x
  const [availablePoint, setAvailablePoint] = useState(orderInfo.point);

  const shippingMemoOptions = [
    { index: 1, value: "문 앞에 놓아주세요." },
    { index: 2, value: "관리실에 맡겨주세요." },
  ];

  // 결제 방법
  const paymentMethod = [
    { index: 1, value: "신용카드" },
    { index: 2, value: "가상계좌" },
    { index: 3, value: "무통장 입금" },
    { index: 4, value: "핸드폰 결제" },
    { index: 5, value: "카카오페이" },
  ];

  // 결제 정보
  const [paymentInfo, setPaymentInfo] = useState({
    method: "credit card",

    cashReceipts: false, // 현금 영수증 신청
    agreed: false, // 구매조건 확인 및 결제진행 동의
  });

  const totalPriceBeforeCupon =
    orderInfo.productPrice * orderInfo.productAmount;
  const totalPriceAfterCupon =
    totalPriceBeforeCupon -
    (orderInfo.cupon + orderInfo.point) +
    orderInfo.shippingFee;

  function onSelectCupon(value: string) {
    const cuponPrice = cupons.find((cupon) => cupon.name === value)?.amount;
    if (cuponPrice == undefined) {
      alert("쿠폰이 유효하지 않습니다.");
      return;
    }
    setOrderInfo({
      ...orderInfo,
      cupon: cuponPrice,
    });
  }

  function onSelectShippingMemo(value: string) {
    setOrderInfo({
      ...orderInfo,
      shippingMemo: value,
    });
  }

  const [orderer, setOrderer] = useState({
    name: orderInfo.ordererName,
    phone: orderInfo.ordererPhone,
    email: orderInfo.ordererEmail,
  });
  function onOrdererInfoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setOrderer({
      ...orderer,
      [id]: value,
    });
  }

  const [shipping, setShipping] = useState({
    name: orderInfo.shippingName,
    phone: orderInfo.shippingPhone,
    address: orderInfo.shippingAddress,
  });
  function onShippingInfoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setShipping({
      ...shipping,
      [id]: value,
    });
  }
  const [pointToUse, setPointToUse] = useState<number>(0);
  function onPointChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    console.log(value);
    setOrderInfo({
      ...orderInfo,
      point: parseInt(value),
    });
  }

  // 보유 포인트 전액 사용
  function onUseAllPoints() {
    setOrderInfo({
      ...orderInfo,
      point: availablePoint,
    });
  }

  // 현금영수증
  function onCashReceiptsChange() {
    setPaymentInfo({
      ...paymentInfo,
      cashReceipts: !paymentInfo.cashReceipts,
    });
  }

  // 구매조건 확인 및 결제진행 동의
  function onAgreementChange() {
    setPaymentInfo({
      ...paymentInfo,
      agreed: !paymentInfo.agreed,
    });
  }

  // 결제하기
  function submitPayment() {
    if (!paymentInfo.agreed) {
      alert("구매조건 확인 및 결제진행에 동의해주세요.");
      return;
    }
    console.log("orderInfo:", orderInfo);
    alert("결제가 완료되었습니다.");
  }

  return (
    <div className="bg-stone-100 text-zinc-800 flex flex-col font-semibold items-center p-6">
      <h1 className="text-2xl">결제하기</h1>
      <div className="w-full grid grid-cols-[minmax(_500px,_1fr)_350px] gap-4 mt-14">
        <div className="flex flex-col gap-4">
          <Card className="border-none rounded-none text-sm">
            <CardContent className="p-6">
              <h2 className="font-bold text-base mb-6">주문 상품 정보</h2>
              <div id="order_product_info" className="flex gap-4">
                <div
                  id="order_product_image"
                  className="w-[100px] h-[100px] overflow-hidden"
                >
                  <Image
                    src="/images/product_image.jpeg"
                    alt="product-image"
                    layout="fixed"
                    width={100}
                    height={100}
                    className="w-full h-auto block"
                  />
                </div>
                <div className="flex flex-col text-sm font-normal gap-1">
                  <div>{orderInfo.productName}</div>
                  <div className="text-zinc-500 text-xs">
                    [옵션: {orderInfo.productColor}/{orderInfo.productSize}] -
                    {orderInfo.productAmount}개
                  </div>
                  <div className="font-semibold">
                    {totalPriceBeforeCupon.toLocaleString("ko-KR")}원
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none rounded-none text-sm">
            <CardContent className="p-6">
              <h2 className="font-bold text-base mb-6">주문자 정보</h2>
              <div className="flex justify-between">
                <div>
                  <div id="user_name" className="font-semibold">
                    {orderInfo.ordererName}
                  </div>
                  <div
                    id="user_phone"
                    className="font-normal text-sm text-zinc-500"
                  >
                    {orderInfo.ordererPhone}
                  </div>
                  <div id="user_email" className="font-normal text-sm">
                    {orderInfo.ordererEmail}
                  </div>
                </div>
                {/* <Button variant="outline" className="rounded-sm">
                  수정
                </Button> */}
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
                      <Button
                        type="submit"
                        className="rounded-sm"
                        onClick={() => {
                          setOrderInfo({
                            ...orderInfo,
                            ordererName: orderer.name,
                            ordererPhone: orderer.phone,
                            ordererEmail: orderer.email,
                          });
                        }}
                      >
                        확인
                      </Button>
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
                    {orderInfo.shippingName}
                  </div>
                  <div
                    id="user_phone"
                    className="font-normal text-sm text-zinc-500"
                  >
                    {orderInfo.shippingPhone}
                  </div>
                  <div id="user_address" className="font-normal text-sm">
                    {orderInfo.shippingAddress}
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
                          value={shipping.name}
                          onChange={onShippingInfoChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center">
                        <Label htmlFor="phone">연락처</Label>
                        <Input
                          id="phone"
                          onChange={onShippingInfoChange}
                          value={shipping.phone}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center">
                        <Label htmlFor="address">주소</Label>
                        <Input
                          id="address"
                          onChange={onShippingInfoChange}
                          value={shipping.address}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        className="rounded-sm"
                        onClick={() => {
                          setOrderInfo({
                            ...orderInfo,
                            shippingName: shipping.name,
                            shippingPhone: shipping.phone,
                            shippingAddress: shipping.address,
                          });
                        }}
                      >
                        확인
                      </Button>
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
                    <SelectItem key={option.index} value={option.value}>
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
                  {/* 반복문으로 펼치기 */}
                  <SelectTrigger className="rounded-sm mb-4">
                    <SelectValue placeholder="쿠폰을 선택해주세요." />
                  </SelectTrigger>
                  <SelectContent>
                    {cupons.map((cupon) => (
                      <SelectItem key={cupon.name} value={cupon.name}>
                        {cupon.amount}
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
                  onClick={() => console.log(orderInfo)}
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
                  value={orderInfo.point.toString()}
                />
                <Button
                  className="bg-blue-600 rounded-sm"
                  onClick={onUseAllPoints}
                >
                  전액사용
                </Button>
              </div>
              <div>보유 포인트 {availablePoint.toLocaleString("ko-KR")}</div>
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
                  {totalPriceBeforeCupon.toLocaleString("ko-KR")}원
                </div>
                <div className="text-zinc-500 font-normal">쿠폰 할인</div>
                <div className="text-right text-zinc-700">
                  -{orderInfo.cupon.toLocaleString("ko-KR")}원
                </div>
                <div className="text-zinc-500 font-normal">포인트 사용</div>
                <div className="text-right text-zinc-700">
                  -{orderInfo.point.toLocaleString("ko-KR")}원
                </div>
                <div className="text-zinc-500 font-normal">배송비</div>
                <div className="text-right text-zinc-700">
                  +{orderInfo.shippingFee.toLocaleString("ko-KR")}원
                </div>
                <hr className="col-span-2 my-4" />
                <div>총 결제금액</div>
                <div className="text-blue-500 rounded-none text-right">
                  {totalPriceAfterCupon.toLocaleString("ko-KR")}원
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
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      key={method.index}
                      value={method.value}
                      id={method.value}
                    />
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
                  checked={paymentInfo.cashReceipts}
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
                    checked={paymentInfo.agreed}
                    onCheckedChange={onAgreementChange}
                  />
                  <label htmlFor="all_agreed">전체 동의</label>
                </div>
                <div className="flex items-center gap-2 text-zinc-800">
                  &nbsp;
                  <Checkbox
                    id="agreed"
                    checked={paymentInfo.agreed}
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
