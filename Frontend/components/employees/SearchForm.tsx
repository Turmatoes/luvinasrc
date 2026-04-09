'use client';

import { useRouter } from 'next/navigation';
import { DepartmentDTO } from '@/types/employee';

interface SearchFormProps {
  departments: DepartmentDTO[];
  selectedDepartmentId: number | null;
  employeeName: string;
  onDepartmentChange: (departmentId: number | null) => void;
  onEmployeeNameChange: (name: string) => void;
  onSearch: () => void;
}

export default function SearchForm({
  departments,
  selectedDepartmentId,
  employeeName,
  onDepartmentChange,
  onEmployeeNameChange,
  onSearch,
}: SearchFormProps) {
  const router = useRouter();

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onDepartmentChange(value === '' ? null : Number(value));
  };

  const handleSearch = () => {
    onSearch();
  };

  return (
    <div className="search-memb">
      <h1 className="title">会員名称で会員を検索します。検索条件無しの場合は全て表示されます。</h1>
      <form className="c-form" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
        <ul className="d-flex">
          <li className="form-group row">
            <label className="col-form-label">氏名:</label>
            <div className="col-sm">
              <input 
                type="text" 
                value={employeeName}
                onChange={(e) => onEmployeeNameChange(e.target.value)}
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
                type="button" 
                onClick={handleSearch}
                className="btn btn-primary btn-sm"
              >
                検索
              </button>
              <button 
                type="button" 
                onClick={() => router.push('/employees/edit')} 
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
