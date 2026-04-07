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
            Department dept = new Department();
            dept.setDepartmentName("Phòng IT");
            dept = departmentRepository.save(dept);

            // Create admin user
            Employee admin = new Employee();
            admin.setEmployeeLoginId("admin");
            admin.setEmployeeLoginPassword(passwordEncoder.encode("123"));
            admin.setEmployeeName("Admin User");
            admin.setEmployeeEmail("admin@luvina.net");
            admin.setDepartment(dept);
            admin.setEmployeeBirthDate(LocalDate.of(1990, 1, 1));
            
            employeeRepository.save(admin);
            System.out.println("Created default admin account (admin / 123)");
        }
    }
}
