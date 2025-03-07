package com.blasty.model;

import java.util.List;

import com.blasty.model.enums.ParkingStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "parkings")
public class Parking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private int capacity;

    @Column(nullable = false)
    private int occupiedSpaces;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ParkingStatus status;

    @Column
    private Double latitude;

    @Column
    private Double longitude;

    @OneToMany(mappedBy = "parking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Place> places;

    // Méthode pour calculer les places disponibles
    public int getAvailablePlaces() {
        return capacity - occupiedSpaces;
    }
}