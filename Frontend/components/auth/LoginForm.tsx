/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * LoginForm.tsx, April 13, 2026 nxplong
 */
'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiClient } from '@/lib/api/client';
import { storeToken } from '@/lib/auth/token';
import { loginSchema, LoginForm as LoginFormType } from '@/lib/validation/auth';

/**
 * Component hiển thị form đăng nhập.
 * 
 * @returns Component hiển thị form đăng nhập
 */
export default function LoginForm() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
  });

  /**
   * Xử lý khi submit form đăng nhập.
   * 
   * @param data Dữ liệu đăng nhập
   */
  const onSubmit = async (data: LoginFormType) => {
    try {
      const response = await apiClient.post<{ accessToken: string; tokenType: string }>('/login', data);
      storeToken(response.data.accessToken, response.data.tokenType);
      router.push('/employees/ADM002');
    } catch (error) {
      console.error('Login failed:', error);
      setError('root', {
        message: 'ログインに失敗しました。アカウント名またはパスワードを確認してください。',
      });
    }
  };

  return (
    <form className="login100-form validate-form" onSubmit={handleSubmit(onSubmit)}>
      {errors.root && (
        <span className="login100-form-title err">
          {errors.root.message}
        </span>
      )}
      {!errors.root && (
        <span className="login100-form-title">
          アカウント名およびパスワードを入力してください
        </span>
      )}

      <div className="wrap-input100 validate-input">
        <input
          className="input100"
          type="text"
          placeholder="アカウント名:"
          {...register('username')}
        />
        <span className="focus-input100"></span>
        <span className="symbol-input100">
          <i className="fa fa-envelope" aria-hidden="true"></i>
        </span>
      </div>
      {errors.username && <span className="login100-form-title err" style={{ fontSize: '12px', paddingBottom: '10px' }}>{errors.username.message}</span>}

      <div className="wrap-input100 validate-input">
        <input
          className="input100"
          type="password"
          placeholder="パスワード:"
          {...register('password')}
        />
        <span className="focus-input100"></span>
        <span className="symbol-input100">
          <i className="fa fa-lock" aria-hidden="true"></i>
        </span>
      </div>
      {errors.password && <span className="login100-form-title err" style={{ fontSize: '12px', paddingBottom: '10px' }}>{errors.password.message}</span>}

      <div className="container-login100-form-btn">
        <button type="submit" className="login100-form-btn">
          ログイン
        </button>
      </div>
    </form>
  );
}

