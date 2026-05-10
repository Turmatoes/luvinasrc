/*
 * Copyright(C) 2010 Luvina Software Company
 * 
 * AddResponse.java, May 10, 2026 nxplong
 */
package com.luvina.la.payload;

import java.util.List;
import java.util.ArrayList;
import com.luvina.la.config.Constants;

/**
 * DTO phản hồi cho hành động thêm mới nhân viên.
 */
public class AddResponse extends BaseResponse {
    private static final long serialVersionUID = 1L;

    public AddResponse() {
        super();
    }

    /**
     * Tạo response thành công cho việc thêm mới.
     * 
     * @param employeeId ID nhân viên vừa tạo
     * @return AddResponse
     */
    public static AddResponse success(Long employeeId) {
        AddResponse response = new AddResponse();
        response.setCode(Constants.CODE_SUCCESS);
        response.setEmployeeId(employeeId);

        BaseResponse message = new BaseResponse();
        message.setCode(Constants.CODE_MSG001);
        message.setParams(new ArrayList<>());

        response.setMessage(message);
        return response;
    }

    /**
     * Tạo response lỗi cho việc thêm mới.
     * 
     * @param errorCode Mã lỗi
     * @param params    Danh sách tham số
     * @return AddResponse
     */
    public static AddResponse error(String errorCode, List<String> params) {
        AddResponse response = new AddResponse();
        response.setCode(Constants.CODE_SYSTEM_ERROR);

        BaseResponse message = new BaseResponse();
        message.setCode(errorCode);
        message.setParams(params != null ? params : new ArrayList<>());

        response.setMessage(message);
        return response;
    }
}
