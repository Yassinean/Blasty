package com.blasty.model;

import java.util.List;

import com.blasty.model.enums.ParkingStatus;
import com.blasty.model.enums.PlaceStatus;
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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ParkingStatus status;

    @Column(nullable = false)
    private int width; // Largeur du parking en mètres

    @Column(nullable = false)
    private int length; // Longueur du parking en mètres

    private int occupiedSpaces;

    @OneToMany(mappedBy = "parking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Place> places;

    // Méthode pour calculer la surface du parking

    public double getSurface() {
        return width * length;
    }
    // Méthode pour calculer les places occupées

    // Méthode pour calculer les places disponibles
    public int getAvailablePlaces() {
        return capacity - occupiedSpaces;
    }
}
