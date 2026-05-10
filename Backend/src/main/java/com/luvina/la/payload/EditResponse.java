/*
 * Copyright(C) 2010 Luvina Software Company
 * 
 * EditResponse.java, May 10, 2026 nxplong
 */
package com.luvina.la.payload;

import java.util.List;
import java.util.ArrayList;
import com.luvina.la.config.Constants;

/**
 * DTO phản hồi cho hành động chỉnh sửa nhân viên.
 */
public class EditResponse extends BaseResponse {
    private static final long serialVersionUID = 1L;

    public EditResponse() {
        super();
    }

    /**
     * Tạo response thành công cho việc chỉnh sửa.
     * 
     * @param employeeId ID nhân viên vừa cập nhật
     * @return EditResponse
     */
    public static EditResponse success(Long employeeId) {
        EditResponse response = new EditResponse();
        response.setCode(Constants.CODE_SUCCESS);
        response.setEmployeeId(employeeId);

        BaseResponse message = new BaseResponse();
        message.setCode(Constants.CODE_MSG002);
        message.setParams(new ArrayList<>());

        response.setMessage(message);
        return response;
    }

    /**
     * Tạo response lỗi cho việc chỉnh sửa.
     * 
     * @param errorCode Mã lỗi
     * @param params    Danh sách tham số
     * @return EditResponse
     */
    public static EditResponse error(String errorCode, List<String> params) {
        EditResponse response = new EditResponse();
        response.setCode(Constants.CODE_SYSTEM_ERROR);

        BaseResponse message = new BaseResponse();
        message.setCode(errorCode);
        message.setParams(params != null ? params : new ArrayList<>());

        response.setMessage(message);
        return response;
    }
}
