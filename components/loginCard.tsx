"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { logInFormSchema } from "@/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { LockOpen } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Modal from "./modal/modal";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { openLoginAfterSignUp, userState } from "@/recoil/atoms";

export default function LoginCard() {
  const { toast } = useToast();
  const [user] = useRecoilState(userState);
  const [isOpenLoginAfterSignUp, setIsOpenLoginAfterSignUp] =
    useRecoilState(openLoginAfterSignUp);
  const logInForm = useForm<z.infer<typeof logInFormSchema>>({
    resolver: zodResolver(logInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onLogIn(values: z.infer<typeof logInFormSchema>) {
    const { email, password } = values;
    if (email !== user.email) {
      toast({
        variant: "destructive",
        title: "이메일이 존재하지 않습니다.",
        duration: 1000,
      });
      return;
    } else if (password !== user.password) {
      toast({
        variant: "destructive",
        title: "비밀번호가 일치하지 않습니다.",
        duration: 1000,
      });
      return;
    } else {
      alert("로그인 되었습니다.");
    }
  }
  const [showing, setShowing] = useState<boolean>(false);

  useEffect(() => {
    // 회원가입 하고 바로 여기로 연결되었을 때만 애니메이션 실행
    // 바로 누른 경우 isOpenLoginAfterSignUp이 false이다.
    // if (isOpenLoginAfterSignUp) {
    // false -> true
    setShowing(true);
    // }
  }, []);

  return (
    <Modal>
      <Card className="overflow-hidden flex flex-row border-none">
        <motion.div
          animate={{
            translateX: `${isOpenLoginAfterSignUp ? (showing ? 100 : 50) : 0}%`,
          }}
          transition={{ ease: "easeInOut" }}
          className="w-full h-full relative z-0"
        >
          <Image src="/images/sight.jpg" alt="background" layout="fill" />
        </motion.div>
        <motion.div
          animate={{
            translateX: `${
              isOpenLoginAfterSignUp ? (showing ? -100 : 50) : 0
            }%`,
          }}
          transition={{ ease: "easeInOut" }}
          className="w-full h-full relative z-0 flex items-center bg-white"
        >
          <CardContent className="p-0 m-0 w-full">
            <Form {...logInForm}>
              <form
                onSubmit={logInForm.handleSubmit(onLogIn)}
                className="space-y-8 px-8"
              >
                <CardHeader className="font-semibold font-sans text-lg text-center">
                  Log In
                </CardHeader>
                <FormField
                  control={logInForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <span className="flex items-center justify-between">
                        <FormLabel>E-mail</FormLabel>
                        <FormMessage className="text-xs" />
                      </span>
                      <FormControl>
                        <Input {...field} className="rounded-sm" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={logInForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <span className="flex items-center justify-between">
                        <FormLabel>password</FormLabel>
                        <FormMessage className="text-xs" />
                      </span>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="absolute inset-x-0 flex justify-between px-6">
                  <span />
                  <Button
                    type="submit"
                    className="p-2 right-0 rounded-full bg-stone-800"
                  >
                    <LockOpen width={24} height={24} />
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </motion.div>
      </Card>
    </Modal>
  );
}
