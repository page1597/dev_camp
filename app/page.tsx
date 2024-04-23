"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { formSchema } from "@/validators/auth";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const [step, setStep] = useState<number>(0);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      role: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 폼 데이터가 변화할 때마다 콘솔창 출력
  console.log(form.watch());

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { password, confirmPassword } = values;
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "비밀번호가 일치하지 않습니다.",
        duration: 1000,
      });
      return;
    }
    alert(JSON.stringify(values, null, 4));
  }

  return (
    <main className="min-h-screen">
      <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <Card className="w-[380px]">
          <CardHeader>
            <CardTitle>계정을 생성합니다</CardTitle>
            <CardDescription>필수 정보를 입력해볼게요.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="relative space-y-3 overflow-x-hidden"
              >
                <motion.div
                  className="space-y-3"
                  animate={{ translateX: `${step * -100}%` }}
                  transition={{ ease: "easeInOut" }}
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>이름</FormLabel>
                        <FormControl>
                          <Input placeholder="홍길동" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>이메일</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="hello@sparta-devcamp.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>연락처</FormLabel>
                        <FormControl>
                          <Input placeholder="01000000000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>역할</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="역할을 선택해주세요." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="관리자">관리자</SelectItem>
                              <SelectItem value="일반사용자">
                                일반사용자
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  className="space-y-3 absolute top-0 left-0 right-0"
                  animate={{ translateX: `${(1 - step) * 100}%` }}
                  style={{ translateX: `${(1 - step) * 100}%` }}
                  transition={{ ease: "easeInOut" }}
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>비밀번호</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" defaultValue={""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>비밀번호 확인</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className={step === 1 ? "display" : "hidden"}
                  >
                    계정 등록하기
                  </Button>
                  <Button
                    type="button"
                    className={step === 0 ? "display" : "hidden"}
                    onClick={() => {
                      form.trigger(["phone", "email", "username", "role"]);

                      const phoneState = form.getFieldState("phone");
                      const emailState = form.getFieldState("email");
                      const usernameState = form.getFieldState("username");
                      const roleState = form.getFieldState("role");

                      if (!phoneState.isDirty || phoneState.invalid) return;
                      if (!emailState.isDirty || emailState.invalid) return;
                      if (!usernameState.isDirty || usernameState.invalid)
                        return;
                      if (!roleState.isDirty || roleState.invalid) return;

                      setStep(1);
                    }}
                  >
                    다음 단계로
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className={step === 1 ? "display" : "hidden"}
                    onClick={() => {
                      setStep(0);
                    }}
                  >
                    이전 단계로
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
