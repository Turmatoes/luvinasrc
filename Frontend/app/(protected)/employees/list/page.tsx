'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEmployee } from '@/hooks/useEmployee';
import SearchForm from '@/components/employees/SearchForm';
import EmployeeTable from '@/components/employees/EmployeeTable';
import Pagination from '@/components/employees/Pagination';
import { getMessage } from '@/lib/utils/messageHelper';

/**
 * Trang danh sách nhân viên.
 * Thực hiện theo mô hình: UI -> Hook.
 * Tầng UI hoàn toàn sạch bóng logic và lệnh gọi API trực tiếp.
 */
export default function EmployeeListPage() {
  // Xác thực người dùng
  useAuth();

  // Sử dụng custom hook để lấy toàn bộ dữ liệu và các hàm xử lý
  const {
    data,
    departments,
    loading,
    departmentError,
    employeeError,
    filters,
    totalPages,
    handleSearch,
    handlePageChange,
    handleSort,
    handleDepartmentChange,
    handleEmployeeNameChange,
  } = useEmployee();

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
        selectedDepartmentId={filters.departmentId}
        employeeName={filters.employeeName}
        onDepartmentChange={handleDepartmentChange}
        onEmployeeNameChange={handleEmployeeNameChange}
        onSearch={handleSearch}
      />

      {/* Trạng thái Loading */}
      {loading && <div className="text-center py-4">Đang tải...</div>}

      {/* Thông báo không tìm thấy dữ liệu */}
      {!loading && data && data.employees.length === 0 && (
        <div className="alert alert-info" role="alert">
          {getMessage('MSG005')}
        </div>
      )}

      {/* Hiển thị bảng dữ liệu và phân trang */}
      {!loading && data && data.employees.length > 0 && (
        <>
          <EmployeeTable data={data} sort={filters.sort} onSort={handleSort} />
          
          {totalPages > 1 && (
            <Pagination 
              currentPage={filters.currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </>
  );
}
