package com.luvina.la.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Lớp HomeController xử lý các yêu cầu liên quan đến trang chủ.
 * 
 * @author nxplong
 */
@RestController
public class HomeController {

    /**
     * Phương thức trả về thông báo chào mừng.
     * 
     * @return Thông báo chào mừng
     */
    @RequestMapping("/")
    public String index() {
        return "Welcome to Employee service a";
    }

}
