/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * employee.ts, April 21, 2026 nxplong
 */
import { z } from 'zod';
import { getMessage } from '../utils/messageHelper';
import { 
  KATAKANA_REGEX, 
  LOGIN_ID_REGEX, 
  TELEPHONE_REGEX, 
  ALPHA_NUMERIC_REGEX, 
  NUMERIC_REGEX 
} from '../constants/format';

/**
 * Factory function tạo Employee Schema dựa trên chế độ (Add/Edit).
 * 
 * @param isEditMode true nếu đang ở chế độ chỉnh sửa
 * @returns Zod Schema
 */
export const createEmployeeSchema = (isEditMode: boolean) => {
  return z.object({
    employeeLoginId: z.string()
      .min(1, getMessage('ER001', ['アカウント名']))
      .max(50, getMessage('ER006', ['アカウント名', '50']))
      .regex(LOGIN_ID_REGEX, getMessage('ER019')),

    departmentId: z.string()
      .min(1, getMessage('ER002', ['グループ'])),

    employeeName: z.string()
      .min(1, getMessage('ER001', ['氏名']))
      .max(100, getMessage('ER006', ['氏名', '100'])),

    employeeNameKana: z.string()
      .min(1, getMessage('ER001', ['カタカナ氏名']))
      .max(100, getMessage('ER006', ['カタカナ氏名', '100']))
      .regex(KATAKANA_REGEX, getMessage('ER009', ['カタカナ氏名'])),

    employeeBirthDate: z.string()
      .min(1, getMessage('ER001', ['生年月日'])),

    employeeEmail: z.string()
      .min(1, getMessage('ER001', ['メールアドレス']))
      .max(100, getMessage('ER006', ['メールアドレス', '100']))
      .email(getMessage('ER005', ['メールアドレス', 'Email'])),

    employeeTelephone: z.string()
      .min(1, getMessage('ER001', ['電話番号']))
      .max(50, getMessage('ER006', ['電話番号', '50']))
      .regex(TELEPHONE_REGEX, getMessage('ER008', ['電話番号'])),

    employeeLoginPassword: z.string().optional().superRefine((val, ctx) => {
      // Khi Add mode: bắt buộc
      if (!isEditMode && (!val || val.length === 0)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: getMessage('ER001', ['パスワード']),
        });
        return;
      }
      
      // Nếu có nhập (trong cả Add/Edit): check độ dài
      if (val && val.length > 0) {
        if (val.length < 8 || val.length > 50) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: getMessage('ER007', ['パスワード', '8', '50']),
          });
        }
      }
    }),

    employeeLoginPasswordConfirm: z.string().optional(),

    certificationId: z.string().optional().refine(val => !val || val === '' || NUMERIC_REGEX.test(val), {
      message: getMessage('ER018', ['資格']),
    }),
    certificationStartDate: z.string().optional(),
    certificationEndDate: z.string().optional(),
    score: z.string().optional().refine(val => !val || NUMERIC_REGEX.test(val), {
      message: getMessage('ER018', ['点数']),
    }),
  }).superRefine((data, ctx) => {
    // 1. Kiểm tra xác nhận mật khẩu
    // Trường hợp Add mode: Bắt buộc nhập confirm nếu có password
    if (!isEditMode && data.employeeLoginPassword && !data.employeeLoginPasswordConfirm) {
      ctx.addIssue({
        path: ['employeeLoginPasswordConfirm'],
        code: z.ZodIssueCode.custom,
        message: getMessage('ER001', ['パスワード（確認）']),
      });
    }

    // So khớp mật khẩu
    if (data.employeeLoginPassword !== data.employeeLoginPasswordConfirm) {
      if (data.employeeLoginPassword || data.employeeLoginPasswordConfirm) {
         ctx.addIssue({
          path: ['employeeLoginPasswordConfirm'],
          code: z.ZodIssueCode.custom,
          message: getMessage('ER017'),
        });
      }
    }

    // 2. Kiểm tra logic chứng chỉ nếu có chọn
    if (data.certificationId && data.certificationId !== '') {
      if (!data.certificationStartDate) {
        ctx.addIssue({
          path: ['certificationStartDate'],
          code: z.ZodIssueCode.custom,
          message: getMessage('ER001', ['資格交付日']),
        });
      }
      if (!data.certificationEndDate) {
        ctx.addIssue({
          path: ['certificationEndDate'],
          code: z.ZodIssueCode.custom,
          message: getMessage('ER001', ['失効日']),
        });
      }
      if (!data.score) {
        ctx.addIssue({
          path: ['score'],
          code: z.ZodIssueCode.custom,
          message: getMessage('ER001', ['点数']),
        });
      }
      
      // ER012: EndDate > StartDate
      if (data.certificationStartDate && data.certificationEndDate) {
        const start = new Date(data.certificationStartDate);
        const end = new Date(data.certificationEndDate);
        if (end <= start) {
          ctx.addIssue({
            path: ['certificationEndDate'],
            code: z.ZodIssueCode.custom,
            message: getMessage('ER012', ['資格交付日']),
          });
        }
      }
    }
  });
};
