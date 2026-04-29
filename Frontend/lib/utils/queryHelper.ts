/**
 * Copyright(C) 2010 Luvina Software Company
 *
 * queryHelper.ts, April 29, 2026 nxplong
 */

/**
 * Lọc các tham số URL để chỉ giữ lại các tham số liên quan đến tìm kiếm/sắp xếp của ADM002.
 * Tránh mang theo các tham số như 'id', 'mode' khi quay lại danh sách.
 * 
 * @param searchParams Đối tượng URLSearchParams hiện tại
 * @returns Chuỗi query string đã được lọc
 */
export function getAdm002QueryParams(searchParams: URLSearchParams): string {
  const params = new URLSearchParams(searchParams.toString());
  
  // Danh sách các tham số cần giữ lại cho ADM002
  const keepParams = ['name', 'dept', 'page', 'sortName', 'sortCert', 'sortDate'];
  
  // Tạo đối tượng mới chỉ chứa các tham số cần thiết
  const filteredParams = new URLSearchParams();
  keepParams.forEach(key => {
    const value = params.get(key);
    if (value !== null) {
      filteredParams.set(key, value);
    }
  });
  
  return filteredParams.toString();
}

/**
 * Tạo URL quay lại ADM002 với đầy đủ các tham số tìm kiếm/sắp xếp.
 * 
 * @param searchParams Đối tượng URLSearchParams hiện tại
 * @returns URL đầy đủ đến ADM002
 */
export function getAdm002ReturnUrl(searchParams: URLSearchParams): string {
  const queryString = getAdm002QueryParams(searchParams);
  return queryString ? `/employees/adm002?${queryString}` : '/employees/adm002';
}
