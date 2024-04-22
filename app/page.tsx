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
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { ModeToggle } from "@/components/modeToggle";

export default function Home() {
  const [isVisible, setIsVisible] = useState(true);
  const { toast } = useToast();
  const startWith010 = new RegExp(/^010/);
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;

  const formSchema = z.object({
    username: z.string().min(2, "이름은 2글자 이상이어야 합니다."),
    email: z.string().email("올바른 이메일을 입력해주세요."),
    phone: z
      .string()
      .length(11, "연락처는 11자리여야 합니다.")
      .regex(startWith010, "010으로 시작하는 11자리 숫자를 입력해주세요."),
    role: z.string().min(1, "역할을 선택해주세요."),
    password: isVisible
      ? z.string().optional()
      : z
          .string()
          .min(6, "비밀번호는 최소 6자리 이상이어야 합니다.")
          .regex(
            passwordRegex,
            "비밀번호는 최소 6자리 이상, 영문, 숫자, 특수문자를 포함해야 합니다."
          ),
    confirmPassword: isVisible
      ? z.string().optional()
      : z
          .string()
          .min(6, "비밀번호는 최소 6자리 이상이어야 합니다.")
          .regex(
            passwordRegex,
            "비밀번호는 최소 6자리 이상, 영문, 숫자, 특수문자를 포함해야 합니다."
          ),
  });
  // .superRefine((data) => data.password === data.confirmPassword);

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
  function onNext() {
    setIsVisible(!isVisible);
    console.log(form.getValues());
  }
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.password !== values.confirmPassword) {
      toast({
        variant: "destructive",
        title: "비밀번호가 일치하지 않습니다.",
        duration: 1000,
      });
      return;
    }
    console.log("계정 등록:", values);
    alert(JSON.stringify(values));
  }
  return (
    <div className="min-h-screen">
      <div className="absolute top-6 right-6">
        <ModeToggle />
      </div>
      <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <Card
          className="w-[380px] 
        // min-h-[500px] 
        flex flex-col"
        >
          <CardHeader>
            <CardTitle>계정을 생성합니다</CardTitle>
            <CardDescription>필수 정보를 입력해볼게요.</CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              {isVisible && (
                <motion.div
                  key={1}
                  // initial={{ opacity: 0 }}
                  // animate={{ opacity: 1 }}
                  // exit={{ opacity: 0 }}
                >
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onNext)}
                      className="space-y-3"
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
                      <Button type="submit">
                        <span className="flex items-center gap-2">
                          <span>다음 단계로</span>
                          <ArrowRightIcon width={16} />
                        </span>
                      </Button>
                    </form>
                  </Form>
                </motion.div>
              )}
              {!isVisible && (
                <motion.div
                  key={2}
                  // initial={{ opacity: 0 }}
                  // animate={{ opacity: 1 }}
                  // exit={{ opacity: 0 }}
                >
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-3"
                    >
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>비밀번호</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="password"
                                defaultValue={""}
                              />
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
                              <Input
                                {...field}
                                type="password"
                                defaultValue=""
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={undefined}
                        name={""}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>&nbsp;</FormLabel>
                            <FormControl>
                              <Input className="invisible" disabled />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={undefined}
                        name={""}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>&nbsp;</FormLabel>
                            <FormControl>
                              <Input className="invisible" disabled />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-end ">
                        <Button type="submit">계정 등록하기</Button>
                        <Button type="button" variant="link" onClick={onNext}>
                          이전 단계로
                        </Button>
                      </div>
                    </form>
                  </Form>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
          {/* <CardFooter>
          <Button>다음 단계로</Button>
        </CardFooter> */}
        </Card>
      </div>
    </div>
  );
}
