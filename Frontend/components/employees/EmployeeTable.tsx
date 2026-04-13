/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * EmployeeTable.tsx, April 13, 2026 nxplong
 */
'use client';

import Link from 'next/link';
import React from 'react';
import { EmployeeListResponse } from '@/types/employee';

export type SortDirection = 'asc' | 'desc';
export type SortKey = 'employeeName' | 'certificationName' | 'endDate';

interface Props {
  data: EmployeeListResponse;
  sort: Record<SortKey, SortDirection>;
  onSort: (key: SortKey) => void;
}

/**
 * Hàm hiển thị icon sắp xếp.
 * 
 * @param direction Hướng sắp xếp ('asc' hoặc 'desc')
 * @returns Icon hiển thị tương ứng
 */
function sortIcon(direction: SortDirection) {
  return direction === 'asc' ? '▲▽' : '△▼';
}

/**
 * Component hiển thị danh sách nhân viên.
 * 
 * @param data Dữ liệu danh sách nhân viên
 * @param sort Trạng thái sắp xếp
 * @param onSort Hàm xử lý khi sắp xếp
 * @returns Component hiển thị danh sách nhân viên
 */
export default function EmployeeTable({ data, sort, onSort }: Props) {
  return (
    <div className="row row-table">
      <div className="css-grid-table box-shadow">
        <div className="css-grid-table-header">
          <div>ID</div>
          <div
            role="button"
            tabIndex={0}
            onClick={() => onSort('employeeName')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onSort('employeeName');
            }}
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            氏名 {sortIcon(sort.employeeName)}
          </div>
          <div>生年月日</div>
          <div>グループ</div>
          <div>メールアドレス</div>
          <div>電話番号</div>
          <div
            role="button"
            tabIndex={0}
            onClick={() => onSort('certificationName')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onSort('certificationName');
            }}
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            日本語能力 {sortIcon(sort.certificationName)}
          </div>
          <div
            role="button"
            tabIndex={0}
            onClick={() => onSort('endDate')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onSort('endDate');
            }}
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            失効日 {sortIcon(sort.endDate)}
          </div>
          <div>点数</div>
        </div>
        <div className="css-grid-table-body">
          {data.employees.map((emp, idx) => (
            <React.Fragment key={`${emp.employeeId}-${idx}`}>
              <div className="bor-l-none text-center">
                <Link href={`/employees/ADM003?id=${emp.employeeId}`}>{emp.employeeId}</Link>
              </div>
              <div>{emp.employeeName}</div>
              <div>{emp.employeeBirthDate || ''}</div>
              <div>{emp.departmentName || ''}</div>
              <div>{emp.employeeEmail || ''}</div>
              <div>{emp.employeeTelephone || ''}</div>
              <div>{emp.certificationName || ''}</div>
              <div>{emp.endDate || ''}</div>
              <div>{emp.score ?? ''}</div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
