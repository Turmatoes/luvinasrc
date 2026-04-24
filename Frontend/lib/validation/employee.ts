/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * employee.ts, April 21, 2026 nxplong
 */
import { z } from 'zod';
import { getMessage } from '../utils/messageHelper';
import { LABELS } from '../constants/messages';
import { 
  MAX_LOGIN_ID_LENGTH, 
  MAX_EMPLOYEE_NAME_LENGTH, 
  MAX_EMAIL_LENGTH, 
  MAX_TELEPHONE_LENGTH, 
  MIN_PASSWORD_LENGTH, 
  MAX_PASSWORD_LENGTH 
} from '../constants/config';
import { 
  KATAKANA_REGEX, 
  LOGIN_ID_REGEX, 
  TELEPHONE_REGEX, 
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
      .min(1, getMessage('ER001', [LABELS.ACCOUNT_NAME]))
      .max(MAX_LOGIN_ID_LENGTH, getMessage('ER006', [LABELS.ACCOUNT_NAME, String(MAX_LOGIN_ID_LENGTH)]))
      .regex(LOGIN_ID_REGEX, getMessage('ER019')),

    departmentId: z.string()
      .min(1, getMessage('ER002', [LABELS.GROUP])),

    employeeName: z.string()
      .min(1, getMessage('ER001', [LABELS.FULL_NAME]))
      .max(MAX_EMPLOYEE_NAME_LENGTH, getMessage('ER006', [LABELS.FULL_NAME, String(MAX_EMPLOYEE_NAME_LENGTH)])),

    employeeNameKana: z.string()
      .min(1, getMessage('ER001', [LABELS.KANA_NAME]))
      .max(MAX_EMPLOYEE_NAME_LENGTH, getMessage('ER006', [LABELS.KANA_NAME, String(MAX_EMPLOYEE_NAME_LENGTH)]))
      .regex(KATAKANA_REGEX, getMessage('ER009', [LABELS.KANA_NAME])),

    employeeBirthDate: z.string()
      .min(1, getMessage('ER001', [LABELS.BIRTH_DATE])),

    employeeEmail: z.string()
      .min(1, getMessage('ER001', [LABELS.EMAIL]))
      .max(MAX_EMAIL_LENGTH, getMessage('ER006', [LABELS.EMAIL, String(MAX_EMAIL_LENGTH)]))
      .email(getMessage('ER005', [LABELS.EMAIL, 'Email'])),

    employeeTelephone: z.string()
      .min(1, getMessage('ER001', [LABELS.TELEPHONE]))
      .max(MAX_TELEPHONE_LENGTH, getMessage('ER006', [LABELS.TELEPHONE, String(MAX_TELEPHONE_LENGTH)]))
      .regex(TELEPHONE_REGEX, getMessage('ER008', [LABELS.TELEPHONE])),

    employeeLoginPassword: z.string().optional().superRefine((val, ctx) => {
      // Khi Add mode: bắt buộc
      if (!isEditMode && (!val || val.length === 0)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: getMessage('ER001', [LABELS.PASSWORD]),
        });
        return;
      }
      
      // Nếu có nhập (trong cả Add/Edit): check độ dài
      if (val && val.length > 0) {
        if (val.length < MIN_PASSWORD_LENGTH || val.length > MAX_PASSWORD_LENGTH) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: getMessage('ER007', [LABELS.PASSWORD, String(MIN_PASSWORD_LENGTH), String(MAX_PASSWORD_LENGTH)]),
          });
        }
      }
    }),

    employeeLoginPasswordConfirm: z.string().optional(),

    certificationId: z.string().optional().refine(val => !val || val === '' || NUMERIC_REGEX.test(val), {
      message: getMessage('ER018', [LABELS.CERTIFICATION]),
    }),
    certificationStartDate: z.string().optional(),
    certificationEndDate: z.string().optional(),
    score: z.string().optional().refine(val => !val || NUMERIC_REGEX.test(val), {
      message: getMessage('ER018', [LABELS.SCORE]),
    }),
  }).superRefine((data, ctx) => {
    // 1. Kiểm tra xác nhận mật khẩu
    // Trường hợp Add mode: Bắt buộc nhập confirm nếu có password
    if (!isEditMode && data.employeeLoginPassword && !data.employeeLoginPasswordConfirm) {
      ctx.addIssue({
        path: ['employeeLoginPasswordConfirm'],
        code: z.ZodIssueCode.custom,
        message: getMessage('ER001', [LABELS.PASSWORD_CONFIRM]),
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
          message: getMessage('ER001', [LABELS.CERT_START_DATE]),
        });
      }
      if (!data.certificationEndDate) {
        ctx.addIssue({
          path: ['certificationEndDate'],
          code: z.ZodIssueCode.custom,
          message: getMessage('ER001', [LABELS.CERT_END_DATE]),
        });
      }
      if (!data.score) {
        ctx.addIssue({
          path: ['score'],
          code: z.ZodIssueCode.custom,
          message: getMessage('ER001', [LABELS.SCORE]),
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
            message: getMessage('ER012', [LABELS.CERT_START_DATE]),
          });
        }
      }
    }
  });
};
