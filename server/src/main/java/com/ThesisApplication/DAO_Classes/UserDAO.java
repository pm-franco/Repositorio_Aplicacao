package com.ThesisApplication.DAO_Classes;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Entity
@Table(name = "user_table")
@EntityListeners(AuditingEntityListener.class)
public class UserDAO {

    @Id
    @Column(name = "email", nullable = false)
    private String email;
    @Column(name = "name", nullable = false)
    private String name;
    @Column(name = "password", nullable = false)
    private String password;
    @Column(name = "university", nullable = false)
    private String university;
    @Column(name = "role", nullable = false)
    private String role;

    @Transient
    private String newPw;

    @Transient
    private String newRole;

    public UserDAO(){}

    public UserDAO(String email, String password){
        this.email = email;
        this.password = password;
    }

    public UserDAO(String password, String role, String name) {
        this.password = password;
        this.role = role;
        this.name = name;
    }

    public UserDAO(String email, String name, String password, String university, String role) {
        this.email = email;
        this.name = name;
        this.password = password;
        this.university = university;
        this.role = role;
    }

    public UserDAO(String email, String name, String university, String role) {
        this.email = email;
        this.name = name;
        this.university = university;
        this.role = role;
    }

    public UserDAO(String email, String name, String password, String university, String role, String newPw) {
        this.email = email;
        this.name = name;
        this.password = password;
        this.university = university;
        this.role = role;
        this.newPw = newPw;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUniversity() {
        return university;
    }

    public void setUniversity(String university) {
        this.university = university;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getNewPw() {
        return newPw;
    }

    public void setNewPw(String newPw) {
        this.newPw = newPw;
    }

    public String getNewRole() {
        return newRole;
    }

    public void setNewRole(String newRole) {
        this.newRole = newRole;
    }
}
