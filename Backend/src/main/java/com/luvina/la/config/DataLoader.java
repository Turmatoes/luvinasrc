package com.luvina.la.config;

import com.luvina.la.entity.Department;
import com.luvina.la.entity.Employee;
import com.luvina.la.repository.DepartmentRepository;
import com.luvina.la.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDate;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!employeeRepository.findByEmployeeLoginId("admin").isPresent()) {
            // Create a default department
            Department dept1 = new Department();
            dept1.setDepartmentName("Phòng IT");
            dept1 = departmentRepository.save(dept1);

            Department dept2 = new Department();
            dept2.setDepartmentName("Phòng QAT");
            dept2 = departmentRepository.save(dept2);

            // Create admin user
            Employee admin = new Employee();
            admin.setEmployeeLoginId("admin");
            admin.setEmployeeLoginPassword(passwordEncoder.encode("123"));
            admin.setEmployeeName("Admin User");
            admin.setEmployeeEmail("admin@luvina.net");
            admin.setDepartment(dept1);
            admin.setEmployeeBirthDate(LocalDate.of(1990, 1, 1));
            
            employeeRepository.save(admin);

            // Create sample employees
            Employee emp1 = new Employee();
            emp1.setEmployeeLoginId("ntmhuong");
            emp1.setEmployeeLoginPassword(passwordEncoder.encode("123"));
            emp1.setEmployeeName("Nguyễn Thị Mai Hương");
            emp1.setEmployeeEmail("ntmhuong@luvina.net");
            emp1.setEmployeeTelephone("0914326386");
            emp1.setDepartment(dept2);
            emp1.setEmployeeBirthDate(LocalDate.of(1983, 7, 8));
            
            employeeRepository.save(emp1);

            Employee emp2 = new Employee();
            emp2.setEmployeeLoginId("xoalt");
            emp2.setEmployeeLoginPassword(passwordEncoder.encode("123"));
            emp2.setEmployeeName("Lê Thị Xoa");
            emp2.setEmployeeEmail("xoalt@luvina.net");
            emp2.setEmployeeTelephone("1234567894");
            emp2.setDepartment(dept1);
            emp2.setEmployeeBirthDate(LocalDate.of(1983, 7, 8));
            
            employeeRepository.save(emp2);

            System.out.println("Created default admin account (admin / 123) and sample employees");
        }
    }
}
