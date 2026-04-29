/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * EmployeeListForm.tsx, April 24, 2026 nxplong
 */
import React from 'react';
import SearchForm from '@/components/employees/SearchForm';
import EmployeeTable from '@/components/employees/EmployeeTable';
import Pagination from '@/components/employees/Pagination';
import { getMessage } from '@/lib/utils/messageHelper';
import { useAdm002 } from '@/hooks/useAdm002';

type EmployeeListFormProps = ReturnType<typeof useAdm002>;

/**
 * Component hiển thị form danh sách nhân viên (ADM002).
 */
export default function EmployeeListForm({
  data,
  departments,
  loading,
  departmentError,
  employeeError,
  employeeNameError,
  searchForm,
  filters,
  totalPages,
  pageNumbers,
  handleSearch,
  handlePageChange,
  handleSort,
  handleDepartmentChange,
  handleEmployeeNameChange,
  searchParams,
}: EmployeeListFormProps) {
  const employees = data?.employees ?? [];
  const tableData = data
    ? {
        ...data,
        employees,
      }
    : null;

  return (
    <>
      {/* Hiển thị lỗi chung (phòng ban hoặc nhân viên) */}
      {(departmentError || employeeError) && (
        <div className="alert alert-danger" role="alert">
          {departmentError || employeeError}
        </div>
      )}

      {/* Form tìm kiếm */}
      <SearchForm
        departments={departments}
        selectedDepartmentId={searchForm.departmentId}
        employeeName={searchForm.employeeName}
        employeeNameError={employeeNameError}
        onDepartmentChange={handleDepartmentChange}
        onEmployeeNameChange={handleEmployeeNameChange}
        onSearch={handleSearch}
        currentQueryString={searchParams.toString()}
      />

      {/* Trạng thái Loading */}
      {loading && <div className="text-center py-4">ローディング中...</div>}

      {/* Thông báo không tìm thấy dữ liệu */}
      {!loading && data && employees.length === 0 && (
        <div className="alert alert-info" role="alert">
          {getMessage('MSG005')}
        </div>
      )}

      {/* Hiển thị bảng dữ liệu và phân trang */}
      {!loading && tableData && employees.length > 0 && (
        <>
          <EmployeeTable 
            data={tableData} 
            sort={filters.sort} 
            onSort={handleSort} 
            currentQueryString={searchParams.toString()}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={filters.currentPage}
              totalPages={totalPages}
              pageNumbers={pageNumbers}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </>
  );
}
