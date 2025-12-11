import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  nickname: z.string().min(2, '닉네임은 최소 2자 이상이어야 합니다.'),
  username: z.string().email('유효한 이메일 형식이어야 합니다.'),
  password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
  password2: z.string().min(8, '비밀번호 확인은 최소 8자 이상이어야 합니다.'),
  pinNumber: z.string().length(4, '핀번호는 4자리여야 합니다.'),
  phoneNumber: z
    .string()
    .regex(/^\d{3}-\d{3,4}-\d{4}$/, '유효한 전화번호 형식이어야 합니다.'),
});

export type SignupInput = z.infer<typeof signupSchema>;
