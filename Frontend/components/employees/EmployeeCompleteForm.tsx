/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * EmployeeCompleteForm.tsx, April 29, 2026 nxplong
 */
import React from 'react';

interface EmployeeCompleteFormProps {
  displayMessage: string;
  handleOk: () => void;
}

/**
 * Component hiển thị giao diện thông báo hoàn tất tác vụ (ADM006).
 * 
 * @param props Các props chứa nội dung tin nhắn và hàm xử lý nút OK
 */
const EmployeeCompleteForm: React.FC<EmployeeCompleteFormProps> = ({
  displayMessage,
  handleOk,
}) => {
  return (
    <div>
      {/* Khung chứa thông báo - Đã loại bỏ class box-shadow để không hiện khung nền trắng */}
      <div className="notification-box">
        {/* Nội dung thông báo (Đăng ký/Cập nhật/Xóa thành công) */}
        <h1 className="msg-title">{displayMessage}</h1>
        
        {/* Nút OK để quay lại màn hình danh sách */}
        {/* Thêm class mt-12 để tạo khoảng cách (margin-top) với dòng chữ thông báo */}
        <div className="notification-box-btn mt-12">
          <button 
            type="button" 
            onClick={handleOk} 
            className="btn btn-primary btn-sm"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCompleteForm;
