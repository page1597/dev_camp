"use client";
import { Order } from "@/types/order";
import { User } from "@/types/user";
import { useEffect, useState } from "react";
import OrderForm from "./_orderForm";

export default function Page() {
  const [user, setUser] = useState<User>();
  const [orders, setOrders] = useState<Order[]>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await fetch("data/users.json");
        const orders = await fetch("data/orders.json");

        const usersJson = await users.json();
        const ordersJson = await orders.json();

        setUser(usersJson[0]);
        setOrders(ordersJson);
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="bg-stone-100">
      {user && orders && <OrderForm user={user} orders={orders} />}
    </main>
  );
}
