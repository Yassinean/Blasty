package com.blasty.model;

import com.blasty.model.enums.PlaceStatus;

import com.blasty.model.enums.TypePlace;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;

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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypePlace type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlaceStatus etat;

    @Column(nullable = false)
    private double tarifHoraire;

    @ManyToOne
    @JoinColumn(name = "parking_id", nullable = false)
    private Parking parking;
}