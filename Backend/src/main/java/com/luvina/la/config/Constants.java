/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * Constants.java, April 22, 2026 nxplong
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
        public static final String CODE_ER002 = "ER002";
        public static final String CODE_ER003 = "ER003";
        public static final String CODE_ER004 = "ER004";
        public static final String CODE_ER005 = "ER005";
        public static final String CODE_ER006 = "ER006";
        public static final String CODE_ER007 = "ER007";
        public static final String CODE_ER008 = "ER008";
        public static final String CODE_ER009 = "ER009";
        public static final String CODE_ER010 = "ER010";
        public static final String CODE_ER011 = "ER011";
        public static final String CODE_ER012 = "ER012";
        public static final String CODE_ER013 = "ER013";
        public static final String CODE_ER014 = "ER014";
        public static final String CODE_ER015 = "ER015";
        public static final String CODE_ER016 = "ER016";
        public static final String CODE_ER017 = "ER017";
        public static final String CODE_ER018 = "ER018";
        public static final String CODE_ER019 = "ER019";
        public static final String CODE_ER020 = "ER020";
        public static final String CODE_ER021 = "ER021";
        public static final String CODE_ER022 = "ER022";
        public static final String CODE_ER023 = "ER023";

        // Các mã thông báo thành công
        public static final String CODE_MSG001 = "MSG001";
        public static final String CODE_MSG002 = "MSG002";
        public static final String CODE_MSG003 = "MSG003";
        public static final String CODE_MSG004 = "MSG004";
        public static final String CODE_MSG005 = "MSG005";

        public static final int MAX_EMPLOYEE_NAME_LENGTH = 125;
        public static final int MAX_EMPLOYEE_NAME_KANA_LENGTH = 125;
        public static final int MAX_LOGIN_ID_LENGTH = 50;
        public static final int MAX_EMAIL_LENGTH = 125;
        public static final int MAX_TELEPHONE_LENGTH = 50;
        public static final int MIN_PASSWORD_LENGTH = 8;
        public static final int MAX_PASSWORD_LENGTH = 50;

        public static final String PARAM_EMPLOYEE_NAME = "氏名";
        public static final String PARAM_LOGIN_ID = "アカウント名";
        public static final String PARAM_NAME_KANA = "カタカナ氏名";
        public static final String PARAM_BIRTH_DATE = "生年月日";
        public static final String PARAM_EMAIL = "メールアドレス";
        public static final String PARAM_TELEPHONE = "電話番号";
        public static final String PARAM_PASSWORD = "パスワード";
        public static final String PARAM_PASSWORD_CONFIRM = "パスワード確認";
        public static final String PARAM_DEPARTMENT = "部署";
        public static final String PARAM_CERTIFICATION = "資格";
        public static final String PARAM_START_DATE = "資格交付日";
        public static final String PARAM_END_DATE = "失効日";
        public static final String PARAM_SCORE = "点数";

        public static final String PARAM_OFFSET = "オフセット";
        public static final String PARAM_LIMIT = "リミット";
}
