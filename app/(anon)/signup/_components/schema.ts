import { z } from 'zod';

export const signupSchema = z
  .object({
    name: z.string().min(1, '이름을 입력해주세요.'),
    nickname: z
      .string()
      .min(2, '닉네임은 최소 2자 이상')
      .max(12, '닉네임은 최대 12자까지 가능합니다.'),
    username: z.string().email('올바른 이메일 형식이 아닙니다.'),
    password: z
      .string()
      .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
      .regex(/[A-Z]/, '대문자를 포함해야 합니다.')
      .regex(/[a-z]/, '소문자를 포함해야 합니다.')
      .regex(/[0-9]/, '숫자를 포함해야 합니다.')
      .regex(/[^a-zA-Z0-9]/, '특수문자를 포함해야 합니다.'),
    password2: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
    pinNumber: z
      .string()
      .length(4, '핀번호는 4자리여야 합니다.')
      .regex(/^\d{4}$/, '숫자만 입력해주세요.'),
    phoneNumber: z
      .string()
      .min(10, '전화번호를 입력해주세요.')
      .max(13, '전화번호 형식이 잘못되었습니다.')
      .regex(/^\d{2,3}-\d{3,4}-\d{4}$/, '올바른 전화번호 형식이 아닙니다.'),
  })
  .refine((data) => data.password === data.password2, {
    path: ['password2'],
    message: '비밀번호가 일치하지 않습니다.',
  });

export type SignupInput = z.infer<typeof signupSchema>;
