package com.blasty.model;

import com.blasty.model.enums.PlaceStatus;

import com.blasty.model.enums.TypePlace;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "places")
public class Place {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long numero;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypePlace type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlaceStatus etat;

    @Column
    private LocalDateTime reservedUntil;

    @Column(nullable = false)
    private double tarifHoraire;

    @ManyToOne
    @JoinColumn(name = "parking_id", nullable = false)
    private Parking parking;
}