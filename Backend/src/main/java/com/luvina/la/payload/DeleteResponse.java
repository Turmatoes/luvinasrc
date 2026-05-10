/*
 * Copyright(C) 2010 Luvina Software Company
 * 
 * DeleteResponse.java, May 10, 2026 nxplong
 */
package com.luvina.la.payload;

import java.util.List;
import java.util.ArrayList;
import com.luvina.la.config.Constants;

/**
 * DTO phản hồi cho hành động xóa nhân viên.
 */
public class DeleteResponse extends BaseResponse {
    private static final long serialVersionUID = 1L;

    public DeleteResponse() {
        super();
    }

    /**
     * Tạo response thành công cho việc xóa.
     * 
     * @param employeeId ID nhân viên vừa xóa
     * @return DeleteResponse
     */
    public static DeleteResponse success(Long employeeId) {
        DeleteResponse response = new DeleteResponse();
        response.setCode(Constants.CODE_SUCCESS);
        response.setEmployeeId(employeeId);

        BaseResponse message = new BaseResponse();
        message.setCode(Constants.CODE_MSG003);
        message.setParams(new ArrayList<>());

        response.setMessage(message);
        return response;
    }

    /**
     * Tạo response lỗi cho việc xóa.
     * 
     * @param errorCode Mã lỗi
     * @param params    Danh sách tham số
     * @return DeleteResponse
     */
    public static DeleteResponse error(String errorCode, List<String> params) {
        DeleteResponse response = new DeleteResponse();
        response.setCode(Constants.CODE_SYSTEM_ERROR);

        BaseResponse message = new BaseResponse();
        message.setCode(errorCode);
        message.setParams(params != null ? params : new ArrayList<>());

        response.setMessage(message);
        return response;
    }
}
