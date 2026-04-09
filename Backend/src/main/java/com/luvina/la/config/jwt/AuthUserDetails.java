package com.luvina.la.config.jwt;

import com.luvina.la.entity.Employee;
import java.util.Collection;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

/**
 * Lớp AuthUserDetails là một lớp triển khai UserDetails của Spring Security.
 * Lớp này chứa thông tin chi tiết về người dùng (Employee) và các quyền hạn
 * (authorities) của họ.
 */
@Data
@AllArgsConstructor
public class AuthUserDetails implements UserDetails {

    Employee employee;
    private Collection<GrantedAuthority> authorities;

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.authorities;
    }

    @Override
    public String getPassword() {
        return employee.getEmployeeLoginPassword();
    }

    @Override
    public String getUsername() {
        return employee.getEmployeeLoginId();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
