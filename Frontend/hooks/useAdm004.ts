/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * useAdm004.ts, April 13, 2026 nxplong
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { employeeApi } from '@/lib/api/employee.api';
import { DepartmentDTO, CertificationDTO, EmployeeRequest } from '@/types/employee';
import { getMessage } from '@/lib/utils/messageHelper';
import { useRouter, useSearchParams } from 'next/navigation';

// Định nghĩa Schema Validation với Zod dựa trên đặc tả thiết kế (Images 1 & 2)
const employeeSchema = z.object({
  employeeId: z.number().optional(),
  employeeLoginId: z.string()
    .min(1, getMessage('ER001', ['アカウント名']))
    .max(50, getMessage('ER006', ['アカウント名']))
    .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, getMessage('ER019', ['アカウント名'])),
  employeeName: z.string()
    .min(1, getMessage('ER001', ['氏名']))
    .max(125, getMessage('ER006', ['氏名'])),
  employeeNameKana: z.string()
    .min(1, getMessage('ER001', ['カタカナ氏名']))
    .max(125, getMessage('ER006', ['カタカナ氏名']))
    .regex(/^[\u30A0-\u30FF]+$/, getMessage('ER009', ['カタカナ氏名'])),
  employeeBirthDate: z.string()
    .min(1, getMessage('ER001', ['生年月日']))
    .regex(/^\d{4}\/\d{2}\/\d{2}$/, getMessage('ER005', ['生年月日', 'yyyy/MM/dd'])),
  employeeEmail: z.string()
    .min(1, getMessage('ER001', ['メールアドレス']))
    .max(125, getMessage('ER006', ['メールアドレス']))
    .email(getMessage('ER005', ['メールアドレス', ''])),
  employeeTelephone: z.string()
    .min(1, getMessage('ER001', ['電話番号']))
    .max(50, getMessage('ER006', ['電話番号']))
    .regex(/^[0-9-]+$/, getMessage('ER008', ['電話番号'])),
  employeeLoginPassword: z.string().optional(),
  employeeLoginPasswordConfirm: z.string().optional(),
  departmentId: z.number({ message: getMessage('ER002', ['グループ']) })
    .min(1, getMessage('ER002', ['グループ'])),
  certifications: z.array(z.object({
    certificationId: z.number(),
    certificationStartDate: z.string(),
    certificationEndDate: z.string(),
    score: z.number()
  }))
}).superRefine((data, ctx) => {
  const isEdit = !!data.employeeId;
  const password = data.employeeLoginPassword;
  const confirm = data.employeeLoginPasswordConfirm;
  
  // 1. Kiểm tra Password
  if (!isEdit && (!password || password.length === 0)) {
     ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: getMessage('ER001', ['パスワード']),
        path: ['employeeLoginPassword']
     });
  } else if (password && (password.length < 8 || password.length > 50)) {
     ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: getMessage('ER007', ['パスワード', '8', '50']),
        path: ['employeeLoginPassword']
     });
  }

  // 2. Kiểm tra Password Confirm (Theo MockHTML)
  if (password !== confirm) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: getMessage('ER017'),
      path: ['employeeLoginPasswordConfirm']
    });
  }

  // 3. Kiểm tra logic Chứng chỉ (Nếu đã chọn certId > 0)
  const cert = data.certifications[0];
  if (cert && cert.certificationId && cert.certificationId > 0) {
    if (!cert.certificationStartDate) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: getMessage('ER001', ['資格交付日']), path: ['certifications', 0, 'certificationStartDate'] });
    } else if (!/^\d{4}\/\d{2}\/\d{2}$/.test(cert.certificationStartDate)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: getMessage('ER005', ['資格交付日', 'yyyy/MM/dd']), path: ['certifications', 0, 'certificationStartDate'] });
    }

    if (!cert.certificationEndDate) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: getMessage('ER001', ['失効日']), path: ['certifications', 0, 'certificationEndDate'] });
    } else if (!/^\d{4}\/\d{2}\/\d{2}$/.test(cert.certificationEndDate)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: getMessage('ER005', ['失効日', 'yyyy/MM/dd']), path: ['certifications', 0, 'certificationEndDate'] });
    }

    if (!cert.score || cert.score <= 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: getMessage('ER001', ['点数']), path: ['certifications', 0, 'score'] });
    }

    if (cert.certificationStartDate && cert.certificationEndDate) {
      if (new Date(cert.certificationEndDate) <= new Date(cert.certificationStartDate)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: getMessage('ER012'), path: ['certifications', 0, 'certificationEndDate'] });
      }
    }
  }
});

export type FormValues = z.infer<typeof employeeSchema>;

const STORAGE_KEY = 'adm004_form_data';

/**
 * Custom Hook useAdm004 quản lý logic cho màn hình Add/Edit Nhân viên.
 */
export function useAdm004() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const employeeId = searchParams.get('id');
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
  const [certifications, setCertifications] = useState<CertificationDTO[]>([]);
  const [errorVisible, setErrorVisible] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      employeeLoginId: '',
      employeeName: '',
      employeeNameKana: '',
      employeeBirthDate: '',
      employeeEmail: '',
      employeeTelephone: '',
      departmentId: 0,
      certifications: [{ certificationId: 0, certificationStartDate: '', certificationEndDate: '', score: 0 }]
    }
  });

  const { fields } = useFieldArray({
    control,
    name: "certifications"
  });

  // Theo dõi giá trị certificationId để handle logic enable/disable/clear
  const watchCertId = watch('certifications.0.certificationId');

  useEffect(() => {
    // Nếu chọn lại "選択してください" (0) thì xoá trắng các trường liên quan
    if (!watchCertId || watchCertId === 0) {
      setValue('certifications.0.certificationStartDate', '');
      setValue('certifications.0.certificationEndDate', '');
      setValue('certifications.0.score', 0);
    }
  }, [watchCertId, setValue]);

  // --- Logic Persistence ---
  useEffect(() => {
    const savedData = sessionStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        reset(parsed);
      } catch (e) {
        console.error('Failed to parse saved form data', e);
      }
    }
  }, [reset]);

  useEffect(() => {
    const subscription = watch((value) => {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // --- Data Fetching ---
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const [deptRes, certRes] = await Promise.all([
        employeeApi.getDepartments(),
        employeeApi.getCertifications()
      ]);
      setDepartments(deptRes);
      setCertifications(certRes);

      if (employeeId) {
        const empData = await employeeApi.getEmployee(Number(employeeId));
        if (!sessionStorage.getItem(STORAGE_KEY)) {
           reset(empData);
        }
      }
    } catch (err) {
      console.error('Failed to load initial data', err);
      setErrorVisible(getMessage('ER023'));
    } finally {
      setLoading(false);
    }
  }, [employeeId, reset]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setErrorVisible(null);
    try {
      // Xử lý logic chứng chỉ: Nếu không chọn thì gửi mảng rỗng hoặc xử lý filter
      const finalData = { ...data };
      if (!data.certifications[0]?.certificationId) {
        finalData.certifications = [];
      }

      if (employeeId) {
        await employeeApi.updateEmployee(finalData as EmployeeRequest);
      } else {
        await employeeApi.createEmployee(finalData as EmployeeRequest);
      }
      sessionStorage.removeItem(STORAGE_KEY);
      router.push('/employees/adm002');
    } catch (err: unknown) {
      console.error('Submit failed:', err);
      const errorCode = (err as { response?: { data?: { code?: string } } }).response?.data?.code || 'ER023';
      setErrorVisible(getMessage(errorCode));
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    handleSubmit,
    control,
    onSubmit,
    errors,
    departments,
    certifications,
    loading,
    errorVisible,
    fields,
    handleBack: () => router.back(),
    isEdit: !!employeeId,
    setValue,
    isCertSelected: !!watchCertId && watchCertId > 0
  };
}
