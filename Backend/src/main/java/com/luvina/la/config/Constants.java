/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * Constants.java, April 17, 2026 nxplong
 */
package com.luvina.la.config;

/**
 * Lớp Constants lưu trữ cấu hình tĩnh của hệ thống.
 * 
 * @author nxplong
 */
public class Constants {

        private Constants() {
        }

        public static final String SPRING_PROFILE_DEVELOPMENT = "dev";
        public static final String SPRING_PROFILE_PRODUCTION = "prod";
        public static final boolean IS_CROSS_ALLOW = true;

        public static final String JWT_SECRET = "Luvina-Academe";
        public static final long JWT_EXPIRATION = 160 * 60 * 60; // 7 day

        public static final String[] ENDPOINTS_PUBLIC = new String[] {
                        "/",
                        "/api/login",
                        "/api/test/**",
                        "/error/**"
        };

        public static final String[] ENDPOINTS_WITH_ROLE = new String[] {
                        "/user/**"
        };

        public static final String[] ATTRIBUTIES_TO_TOKEN = new String[] {
                        "employeeId",
                        "employeeName",
                        "employeeLoginId",
                        "employeeEmail"
        };

        // Các mã định danh HTTP Code
        public static final String CODE_SUCCESS = "200";
        public static final String CODE_SYSTEM_ERROR = "500";
        public static final String CODE_NOT_FOUND = "404";
        public static final String CODE_UNAUTHORIZED = "401";

        // Các mã định danh lỗi hệ thống
        public static final String CODE_ER001 = "ER001";
        public static final String CODE_ER013 = "ER013";
        public static final String CODE_ER014 = "ER014";
        public static final String CODE_ER015 = "ER015";
        public static final String CODE_ER016 = "ER016";
        public static final String CODE_ER021 = "ER021";
        public static final String CODE_ER022 = "ER022";
        public static final String CODE_ER023 = "ER023";
}
