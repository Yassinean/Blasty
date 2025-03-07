package com.blasty.model;

import jakarta.persistence.*;

import lombok.*;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@DiscriminatorValue("ADMIN")
public class Admin extends User {
    @Column(unique = true, nullable = true)
    private String email;
}