'use client';

import Link from 'next/link';
import React from 'react';
import { EmployeeListResponse } from '@/types/employee';

interface Props {
  data: EmployeeListResponse;
}

export default function EmployeeTable({ data }: Props) {
  return (
    <div className="row row-table">
      <div className="css-grid-table box-shadow">
        <div className="css-grid-table-header">
          <div>ID</div>
          <div>氏名 ▲▽</div>
          <div>生年月日</div>
          <div>グループ</div>
          <div>メールアドレス</div>
          <div>電話番号</div>
          <div>日本語能力 ▲▽</div>
          <div>失効日 ▼△</div>
          <div>点数</div>
        </div>
        <div className="css-grid-table-body">
          {data.employees.map((emp, idx) => (
            <React.Fragment key={`${emp.employeeId}-${idx}`}>
              <div className="bor-l-none text-center">
                <Link href={`/employees/detail?id=${emp.employeeId}`}>{emp.employeeId}</Link>
              </div>
              <div>{emp.employeeName}</div>
              <div>{emp.employeeBirthDate || 'N/A'}</div>
              <div>{emp.departmentName || 'N/A'}</div>
              <div>{emp.employeeEmail || 'N/A'}</div>
              <div>{emp.employeeTelephone || 'N/A'}</div>
              <div>{emp.certificationName || 'N/A'}</div>
              <div>{emp.endDate || 'N/A'}</div>
              <div>{emp.score ?? 'N/A'}</div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
