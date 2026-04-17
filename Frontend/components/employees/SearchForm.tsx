/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * SearchForm.tsx, April 13, 2026 nxplong
 */
'use client';

import { useRouter } from 'next/navigation';
import { DepartmentDTO } from '@/types/employee';
import { MAX_FULLNAME_LENGTH } from '@/lib/constants/config';

/**
 * Interface cho props của SearchForm.
 */
interface SearchFormProps {
  departments: DepartmentDTO[];
  selectedDepartmentId: number | null;
  employeeName: string;
  onDepartmentChange: (departmentId: number | null) => void;
  onEmployeeNameChange: (name: string) => void;
  onSearch: (name: string, departmentId: number | null) => void;
}



/**
 * Component hiển thị form tìm kiếm nhân viên.
 * 
 * @param departments Danh sách phòng ban
 * @param selectedDepartmentId ID phòng ban được chọn
 * @param employeeName Tên nhân viên
 * @param onDepartmentChange Hàm xử lý khi thay đổi phòng ban
 * @param onEmployeeNameChange Hàm xử lý khi thay đổi tên nhân viên
 * @param onSearch Hàm xử lý khi tìm kiếm
 * @returns Component hiển thị form tìm kiếm
 */
export default function SearchForm({
  departments,
  selectedDepartmentId,
  employeeName,
  onDepartmentChange,
  onEmployeeNameChange,
  onSearch,
}: SearchFormProps) {
  const router = useRouter();

  const handleFullnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Giới hạn ký tự nhập vào
    if (value.length <= MAX_FULLNAME_LENGTH) {
      onEmployeeNameChange(value);
    }
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onDepartmentChange(value === '' ? null : Number(value));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(employeeName, selectedDepartmentId);
  };

  return (
    <div className="search-memb">
      <h1 className="title">会員名称で会員を検索します。検索条件無しの場合は全て表示されます。</h1>
      <form className="c-form" onSubmit={handleSearch}>
        <ul className="d-flex">
          <li className="form-group row">
            <label className="col-form-label">氏名:</label>
            <div className="col-sm">
              <input
                type="text"
                value={employeeName}
                onChange={handleFullnameChange}
                maxLength={MAX_FULLNAME_LENGTH}
                placeholder="従業員名を入力..."
              />
            </div>
          </li>
          <li className="form-group row">
            <label className="col-form-label">グループ:</label>
            <div className="col-sm">
              <select
                value={selectedDepartmentId ?? ''}
                onChange={handleDepartmentChange}
              >
                <option value="">全て</option>
                {departments.map((dept) => (
                  <option key={dept.departmentId} value={dept.departmentId}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
            </div>
          </li>
          <li className="form-group row">
            <div className="btn-group">
              <button
                type="submit"
                className="btn btn-primary btn-sm"
              >
                検索
              </button>
              <button
                type="button"
                onClick={() => router.push('/employees/adm004')}
                className="btn btn-secondary btn-sm"
              >
                新規追加
              </button>
            </div>
          </li>
        </ul>
      </form>
    </div>
  );
}
