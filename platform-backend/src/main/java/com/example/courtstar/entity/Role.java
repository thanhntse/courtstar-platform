package com.example.courtstar.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.Set;

@Entity
@Data
@Table(name = "role")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Role {
    @Id
    @Size(max = 15)
    @Column(name = "name", length = 15, nullable = false)
    String name;

    @Column(name = "description")
    String description;

    @OneToMany(mappedBy = "role", cascade = CascadeType.ALL)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JsonIgnore
    List<Account> accounts;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    Set<Permission> permissions;
}
