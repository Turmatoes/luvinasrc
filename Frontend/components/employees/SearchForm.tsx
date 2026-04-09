'use client';

import { useRouter } from 'next/navigation';

export default function SearchForm() {
  const router = useRouter();

  return (
    <div className="search-memb">
      <h1 className="title">会員名称で会員を検索します。検索条件無しの場合は全て表示されます。</h1>
      <form className="c-form">
        <ul className="d-flex">
          <li className="form-group row">
            <label className="col-form-label">氏名:</label>
            <div className="col-sm"><input type="text" /></div>
          </li>
          <li className="form-group row">
            <label className="col-form-label">グループ:</label>
            <div className="col-sm">
              <select>
                <option>全て</option>
                <option>Nhóm 1</option>
                <option>Nhóm 2</option>
              </select>
            </div>
          </li>
          <li className="form-group row">
            <div className="btn-group">
              <button type="button" className="btn btn-primary btn-sm">検索</button>
              <button type="button" onClick={() => router.push('/employees/edit')} className="btn btn-secondary btn-sm">新規追加</button>
            </div>
          </li>
        </ul>
      </form>
    </div>
  );
}
