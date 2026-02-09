package ru.russify.russifyservice.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity(name = "role")
@Table(name = "role")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Role {

    @Id
    @GeneratedValue(strategy= GenerationType.SEQUENCE)
    @Column(name = "role_name", nullable = false, length = 100)
    private Long id;

    @Column(name = "role_name", nullable = false, length = 100)
    private String name;

    @OneToMany(mappedBy="role",  orphanRemoval = false)
    private Set<User> users;

}
