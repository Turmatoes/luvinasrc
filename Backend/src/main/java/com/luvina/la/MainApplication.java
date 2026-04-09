/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * MainApplication.java, April 9, 2026 nxplong
 */

package com.luvina.la;

import com.luvina.la.config.Constants;
import com.luvina.la.config.DefaultProfileUtil;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Arrays;
import java.util.Collection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.Environment;
import org.springframework.util.StringUtils;

@SpringBootApplication
/**
 * Lớp ứng dụng chính (Main Application).
 * Khởi tạo ứng dụng Spring Boot và cấu hình profile dev/prod.
 * 
 * @author nxplong
 */
public class MainApplication implements InitializingBean {

    private static final Logger log = LoggerFactory.getLogger(MainApplication.class);

    private final Environment env;

    /**
     * Constructor khởi tạo MainApplication.
     *
     * @param env Biến môi trường Spring
     */
    public MainApplication(Environment env) {
        this.env = env;
    }

    /**
     * Kiểm tra cấu hình profile của ứng dụng sau khi khởi tạo.
     * Nếu cả dev và prod profile được kích hoạt, sẽ ghi lỗi.
     *
     * @throws Exception Nếu có lỗi trong quá trình khởi tạo
     */
    @Override
    public void afterPropertiesSet() throws Exception {
        Collection<String> activeProfiles = Arrays.asList(env.getActiveProfiles());
        if (activeProfiles.contains(Constants.SPRING_PROFILE_DEVELOPMENT)
                && activeProfiles.contains(Constants.SPRING_PROFILE_PRODUCTION)) {
            log.error("You have misconfigured your application! It should not run "
                    + "with both the 'dev' and 'prod' profiles at the same time.");
        }
    }

    /**
     * Phương thức main - điểm khởi động ứng dụng Spring Boot.
     *
     * @param args Các tham số dòng lệnh
     */
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(MainApplication.class);
        DefaultProfileUtil.addDefaultProfile(app);
        Environment env = app.run(args).getEnvironment();
        logApplicationStartup(env);
    }

    /**
     * Ghi nhật ký thông tin khởi động ứng dụng.
     * Hiển thị các URL truy cập, profile đang chạy.
     *
     * @param env Biến môi trường Spring
     */
    private static void logApplicationStartup(Environment env) {
        String protocol = "http";
        String serverPort = env.getProperty("server.port");
        String contextPath = env.getProperty("server.servlet.context-path");
        if (!StringUtils.hasText(contextPath)) {
            contextPath = "/";
        }
        String hostAddress = "localhost";
        try {
            hostAddress = InetAddress.getLocalHost().getHostAddress();
        } catch (UnknownHostException e) {
            log.warn("The host name could not be determined, using `localhost` as fallback");
        }
        String[] profile = env.getActiveProfiles();
        if (profile.length == 0) {
            profile = env.getDefaultProfiles();
        }

        String textBlock = """
                
                ----------------------------------------------------------
                Application '{}' is running! Access URLs:
                Local: \t\t{}://localhost:{}{}
                External: \t{}://{}:{}{}
                Profile(s): {}
                ----------------------------------------------------------
                
                """;

        log.info(textBlock, env.getProperty("spring.application.name"),
                protocol, serverPort, contextPath,
                protocol, hostAddress, serverPort, contextPath, profile);
    }
}
