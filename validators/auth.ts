import { z } from "zod";
const startWith010 = new RegExp(/^010/);
const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;

export const formSchema = z.object({
  username: z.string().min(2, "이름은 2글자 이상이어야 합니다."),
  email: z.string().email("올바른 이메일을 입력해주세요."),
  phone: z
    .string()
    .length(11, "연락처는 11자리여야 합니다.")
    .regex(startWith010, "010으로 시작하는 11자리 숫자를 입력해주세요."),
  role: z.string().min(1, "역할을 선택해주세요."),
  password: z
    .string()
    .min(6, "비밀번호는 최소 6자리 이상이어야 합니다.")
    .regex(
      passwordRegex,
      "비밀번호는 최소 6자리 이상, 영문, 숫자, 특수문자를 포함해야 합니다."
    ),
  confirmPassword: z
    .string()
    .min(6, "비밀번호는 최소 6자리 이상이어야 합니다.")
    .regex(
      passwordRegex,
      "비밀번호는 최소 6자리 이상, 영문, 숫자, 특수문자를 포함해야 합니다."
    ),
  //   password: z.string(),
  //   confirmPassword: z.string(),
});
