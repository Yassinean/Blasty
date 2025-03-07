package com.blasty.model;

import com.blasty.model.enums.VehiculeType;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String immatriculation;

    @Column(nullable = false)
    private VehiculeType type;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;
}
