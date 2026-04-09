package com.luvina.la.config;

import com.luvina.la.entity.Department;
import com.luvina.la.entity.Employee;
import com.luvina.la.entity.Certification;
import com.luvina.la.entity.EmployeeCertification;
import com.luvina.la.repository.DepartmentRepository;
import com.luvina.la.repository.EmployeeRepository;
import com.luvina.la.repository.CertificationRepository;
import com.luvina.la.repository.EmployeeCertificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.math.BigDecimal;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private CertificationRepository certificationRepository;

    @Autowired
    private EmployeeCertificationRepository employeeCertificationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!employeeRepository.findByEmployeeLoginId("admin").isPresent()) {
            // Create departments
            Department dept1 = new Department();
            dept1.setDepartmentName("Phòng IT");
            dept1 = departmentRepository.save(dept1);

            Department dept2 = new Department();
            dept2.setDepartmentName("Phòng QAT");
            dept2 = departmentRepository.save(dept2);

            Department dept3 = new Department();
            dept3.setDepartmentName("Phòng Nhân Sự");
            dept3 = departmentRepository.save(dept3);

            Department dept4 = new Department();
            dept4.setDepartmentName("Phòng Kinh Doanh");
            dept4 = departmentRepository.save(dept4);

            // Create certifications (Japanese language levels)
            Certification cert1 = new Certification();
            cert1.setCertificationName("Trình độ tiếng nhật cấp 1");
            cert1.setCertificationLevel(1);
            cert1 = certificationRepository.save(cert1);

            Certification cert2 = new Certification();
            cert2.setCertificationName("Trình độ tiếng nhật cấp 2");
            cert2.setCertificationLevel(2);
            cert2 = certificationRepository.save(cert2);

            Certification cert3 = new Certification();
            cert3.setCertificationName("Trình độ tiếng nhật cấp 3");
            cert3.setCertificationLevel(3);
            cert3 = certificationRepository.save(cert3);

            Certification cert4 = new Certification();
            cert4.setCertificationName("Trình độ tiếng nhật cấp 4");
            cert4.setCertificationLevel(4);
            cert4 = certificationRepository.save(cert4);

            Certification cert5 = new Certification();
            cert5.setCertificationName("Trình độ tiếng nhật cấp 5");
            cert5.setCertificationLevel(5);
            cert5 = certificationRepository.save(cert5);

            // Create admin user (role = 1, will not appear in employee list)
            Employee admin = new Employee();
            admin.setEmployeeLoginId("admin");
            admin.setEmployeeLoginPassword(passwordEncoder.encode("123"));
            admin.setEmployeeName("Quản Trị Viên");
            admin.setEmployeeNameKana("クアンチビエン");
            admin.setEmployeeEmail("admin@luvina.net");
            admin.setDepartment(dept1);
            admin.setEmployeeBirthDate(LocalDate.of(1985, 3, 15));
            admin.setRole(1);
            admin = employeeRepository.save(admin);

            // Create 20 regular employees (role = 0, will appear in employee list)
            Employee[] employees = new Employee[20];
            String[][] empData = {
                {"emp001", "Nguyễn Thị Mai Hương", "グエンティマイフォン", "ntmhuong@luvina.net", "0914326386", "1983-07-08"},
                {"emp002", "Lê Thị Xoa", "レティソア", "xoalt@luvina.net", "0914326387", "1983-06-15"},
                {"emp003", "Đặng Thị Hân", "ダンティハン", "handt@luvina.net", "0914326388", "1985-05-20"},
                {"emp004", "Phạm Thanh Tâm", "ファムタインタム", "ptam@luvina.net", "0914326389", "1988-09-10"},
                {"emp005", "Trần Văn Hùng", "トランヴァンフン", "thung@luvina.net", "0914326390", "1987-02-14"},
                {"emp006", "Hoàng Minh Dũng", "ホアンミンズン", "mdung@luvina.net", "0914326391", "1990-11-25"},
                {"emp007", "Vũ Thanh Hương", "ブタインフォン", "thuong@luvina.net", "0914326392", "1986-04-08"},
                {"emp008", "Bùi Quốc Anh", "ブイクオックアン", "qanh@luvina.net", "0914326393", "1989-12-03"},
                {"emp009", "Phan Văn Tú", "ファンヴァンツ", "vtu@luvina.net", "0914326394", "1984-08-19"},
                {"emp010", "Cao Thanh Trí", "カオタインチ", "ttri@luvina.net", "0914326395", "1991-06-27"},
                {"emp011", "Dương Thị Linh", "ドゥオンティリン", "tlinh@luvina.net", "0914326396", "1988-01-12"},
                {"emp012", "Lý Minh Quân", "リミンクアン", "mquaan@luvina.net", "0914326397", "1987-10-05"},
                {"emp013", "Tạ Quỳnh Anh", "タクインアン", "qanhh@luvina.net", "0914326398", "1985-07-22"},
                {"emp014", "Ngô Thị Hương", "ゴティフォン", "thuong2@luvina.net", "0914326399", "1990-03-14"},
                {"emp015", "Đỗ Văn Khoa", "ドヴァンコア", "vkhoa@luvina.net", "0914326400", "1989-09-08"},
                {"emp016", "Hà Thị Bích", "ハティビック", "tbich@luvina.net", "0914326401", "1992-05-16"},
                {"emp017", "Đinh Văn Sơn", "ディンヴァンソン", "vson@luvina.net", "0914326402", "1986-12-30"},
                {"emp018", "Lâm Trọng Nghĩa", "ラムトロンニギア", "tnghia@luvina.net", "0914326403", "1988-11-18"},
                {"emp019", "Nông Thị Hồng", "ノンティホン", "thong@luvina.net", "0914326404", "1991-02-09"},
                {"emp020", "Võ Minh Đức", "ボミンドゥック", "mduc@luvina.net", "0914326405", "1989-07-26"}
            };

            Department[] depts = {dept1, dept2, dept3, dept4};
            
            for (int i = 0; i < 20; i++) {
                Employee emp = new Employee();
                emp.setEmployeeLoginId(empData[i][0]);
                emp.setEmployeeLoginPassword(passwordEncoder.encode("123"));
                emp.setEmployeeName(empData[i][1]);
                emp.setEmployeeNameKana(empData[i][2]);
                emp.setEmployeeEmail(empData[i][3]);
                emp.setEmployeeTelephone(empData[i][4]);
                emp.setEmployeeBirthDate(LocalDate.parse(empData[i][5]));
                emp.setDepartment(depts[i % 4]);
                emp.setRole(0);
                employees[i] = employeeRepository.save(emp);
            }

            // Add certifications for employees
            // Some employees have certifications, some don't
            Certification[] certs = {cert1, cert2, cert3, cert4, cert5};
            
            // Employees with certifications
            int[][] empCertData = {
                {0, 3, 2023, 1, 15, 2025, 1, 14, 290},   // emp001 - cert4
                {1, 3, 2023, 3, 20, 2025, 3, 19, 280},   // emp002 - cert4
                {2, 2, 2023, 6, 10, 2025, 6, 9, 310},    // emp003 - cert3
                {3, 4, 2022, 9, 5, 2024, 9, 4, 320},     // emp004 - cert5
                {4, 2, 2023, 2, 14, 2025, 2, 13, 275},   // emp005 - cert3
                {6, 1, 2024, 1, 20, 2026, 1, 19, 250},   // emp007 - cert2
                {7, 0, 2023, 4, 10, 2025, 4, 9, 265},    // emp008 - cert1
                {9, 3, 2023, 7, 1, 2025, 6, 30, 300},    // emp010 - cert4
                {10, 2, 2023, 5, 15, 2025, 5, 14, 285},  // emp011 - cert3
                {12, 1, 2024, 3, 1, 2026, 2, 28, 270},   // emp013 - cert2
                {14, 4, 2022, 8, 10, 2024, 8, 9, 315},   // emp015 - cert5
                {16, 0, 2023, 11, 5, 2025, 11, 4, 260},  // emp017 - cert1
                {18, 2, 2023, 10, 20, 2025, 10, 19, 295} // emp019 - cert3
            };

            for (int[] data : empCertData) {
                EmployeeCertification empCert = new EmployeeCertification();
                empCert.setEmployee(employees[data[0]]);
                empCert.setCertification(certs[data[1]]);
                empCert.setStartDate(LocalDate.of(data[2], data[3], data[4]));
                empCert.setEndDate(LocalDate.of(data[5], data[6], data[7]));
                empCert.setScore(new BigDecimal(data[8]));
                employeeCertificationRepository.save(empCert);
            }

            System.out.println("✓ Created admin account (admin/123) and 20 sample employees");
            System.out.println("✓ Added Japanese language certifications to 13 employees");
            System.out.println("✓ 7 employees without certifications");
        }
    }
}
