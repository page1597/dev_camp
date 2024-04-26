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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { signUpFormSchema, logInFormSchema } from "@/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretLeftIcon, CaretRightIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { Check, LockOpen } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Home() {
  const [step, setStep] = useState<number>(0);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const { toast } = useToast();

  const signUpForm = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      role: "",
      password: "",
      confirmPassword: "",
      logInEmail: "",
      logInPassword: "",
    },
  });
  const logInForm = useForm<z.infer<typeof logInFormSchema>>({
    resolver: zodResolver(logInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof signUpFormSchema>) {
    const { password, confirmPassword, email } = values;
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "비밀번호가 일치하지 않습니다.",
        duration: 1000,
      });
      return;
    }
    // 폼 제출 시 처리
    alert(JSON.stringify(values, null, 4));
    setIsSignUp(true);
  }

  function onLogIn(values: z.infer<typeof logInFormSchema>) {
    const { email, password } = values;
    if (email !== signUpForm.getValues("email")) {
      toast({
        variant: "destructive",
        title: "이메일이 존재하지 않습니다.",
        duration: 1000,
      });
      return;
    } else if (password !== signUpForm.getValues("password")) {
      toast({
        variant: "destructive",
        title: "비밀번호가 일치하지 않습니다.",
        duration: 1000,
      });
      return;
    } else {
      // toast({ variant: "default", title: "로그인 되었습니다." });
      alert("로그인 되었습니다.");
    }
  }

  return (
    <main className="h-screen bg-stone-200 flex flex-col justify-center items-center">
      {/* <Button onClick={() => setIsSignUp(!isSignUp)}>button</Button> */}
      <Card className="h-4/5 w-10/12 rounded-2xl overflow-hidden flex flex-row border-none">
        <motion.div
          animate={{ translateX: `${isSignUp ? 100 : 0}%` }}
          transition={{ ease: "easeInOut" }}
          className="w-full flex justify-center items-center"
        >
          <CardContent className="p-0 m-0 w-full">
            <div className="w-full">
              {!isSignUp ? (
                <Form {...signUpForm}>
                  <form
                    onSubmit={signUpForm.handleSubmit(onSubmit)}
                    className="relative space-y-8"
                  >
                    <CardHeader className="font-semibold font-sans text-lg text-center">
                      Create Account
                    </CardHeader>

                    <motion.div
                      className="space-y-4 px-8"
                      animate={{ translateX: `${step * -100}%` }}
                      transition={{ ease: "easeInOut" }}
                    >
                      <FormField
                        control={signUpForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <span className="flex items-center justify-between">
                              <FormLabel>name</FormLabel>
                              <FormMessage className="text-xs" />
                            </span>
                            <FormControl>
                              <Input {...field} className="rounded-sm" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signUpForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <span className="flex items-center justify-between">
                              <FormLabel>E-mail</FormLabel>
                              <FormMessage className="text-xs" />
                            </span>
                            <FormControl>
                              <Input
                                placeholder="hello@sparta-devcamp.com"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signUpForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <span className="flex items-center justify-between">
                              <FormLabel>phone</FormLabel>
                              <FormMessage className="text-xs " />
                            </span>
                            <FormControl>
                              <Input placeholder="01000000000" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signUpForm.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <span className="flex items-center justify-between">
                              <FormLabel>role</FormLabel>
                              <FormMessage className="text-xs " />
                            </span>
                            <FormControl>
                              <Select onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="역할을 선택해주세요." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">admin</SelectItem>
                                  <SelectItem value="user">user</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    <motion.div
                      className="space-y-4 absolute top-10 left-0 right-0 px-8"
                      animate={{ translateX: `${(1 - step) * 100}%` }}
                      style={{ translateX: `${(1 - step) * 100}%` }}
                      transition={{ ease: "easeInOut" }}
                    >
                      <>
                        <FormField
                          control={signUpForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>password</FormLabel>
                              <FormControl>
                                <Input {...field} type="password" />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signUpForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>confirm password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </>
                    </motion.div>

                    <div className="absolute inset-x-0 flex justify-between px-6">
                      <Button
                        type="button"
                        variant="outline"
                        className={`${
                          step === 0 ? "display" : "hidden"
                        } px-2 rounded-full ml-auto`}
                        onClick={() => {
                          // 별도의 함수로 빼서 작성하기
                          signUpForm.trigger([
                            "phone",
                            "email",
                            "username",
                            "role",
                          ]);

                          const phoneState = signUpForm.getFieldState("phone");
                          const emailState = signUpForm.getFieldState("email");
                          const usernameState =
                            signUpForm.getFieldState("username");
                          const roleState = signUpForm.getFieldState("role");

                          if (!phoneState.isDirty || phoneState.invalid) return;
                          if (!emailState.isDirty || emailState.invalid) return;
                          if (!usernameState.isDirty || usernameState.invalid)
                            return;
                          if (!roleState.isDirty || roleState.invalid) return;

                          setStep(1);
                        }}
                      >
                        <CaretRightIcon width={24} height={24} />
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className={`${
                          step === 1 ? "display" : "hidden"
                        } px-2 rounded-full`}
                        onClick={() => {
                          setStep(0);
                        }}
                      >
                        <CaretLeftIcon width={24} height={24} />
                      </Button>

                      <Button
                        type="submit"
                        className={`${
                          step === 1 ? "display" : "hidden"
                        } p-2 right-0 rounded-full bg-stone-800`}
                      >
                        <Check width={24} height={24} />
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <Form {...logInForm}>
                  <form
                    onSubmit={logInForm.handleSubmit(onLogIn)}
                    className="space-y-8 px-8 -mt-14"
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
              )}
            </div>
          </CardContent>
        </motion.div>
        <motion.div
          animate={{ translateX: `${isSignUp ? -100 : 0}%` }}
          transition={{ ease: "easeInOut" }}
          className="w-full h-full relative"
        >
          <Image
            src="/images/sight.jpg"
            alt="background"
            layout="fill"
            // objectFit="cover"
          />
        </motion.div>
      </Card>
    </main>
  );
}
