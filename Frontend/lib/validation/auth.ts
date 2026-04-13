/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * auth.ts, April 13, 2026 nxplong
 */
import { z } from 'zod';

/**
 * Schema validation cho form đăng nhập.
 * Sử dụng Zod để định nghĩa cấu trúc và ràng buộc dữ liệu.
 */
export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginForm = z.infer<typeof loginSchema>;

