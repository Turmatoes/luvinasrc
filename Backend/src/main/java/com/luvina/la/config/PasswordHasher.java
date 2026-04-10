package com.luvina.la.config;

import com.luvina.la.entity.Employee;
import com.luvina.la.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Component
public class PasswordHasher implements CommandLineRunner {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Get all employees from database
        Iterable<Employee> iterable = employeeRepository.findAll();
        var employees = StreamSupport.stream(iterable.spliterator(), false)
                .collect(Collectors.toList());

        boolean hasChanges = false;
        // Check each employee's password
        for (Employee emp : employees) {
            if (emp.getEmployeeLoginPassword() != null) {
                // If password is not already hashed (doesn't start with BCrypt hash prefix)
                if (!emp.getEmployeeLoginPassword().startsWith("$2a$") &&
                        !emp.getEmployeeLoginPassword().startsWith("$2b$") &&
                        !emp.getEmployeeLoginPassword().startsWith("$2y$")) {

                    // Hash the plaintext password
                    String hashedPassword = passwordEncoder.encode(emp.getEmployeeLoginPassword());
                    emp.setEmployeeLoginPassword(hashedPassword);
                    employeeRepository.save(emp);
                    System.out.println("Hashed password for user: " + emp.getEmployeeLoginId());
                    hasChanges = true;
                }
            }
        }

        if (hasChanges) {
            System.out.println("Password hashing completed!");
        }
    }
}
