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
    private int width;

    @Column(nullable = false)
    private int length;

    private int occupiedSpaces;

    @OneToMany(mappedBy = "parking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Place> places;

    public double getSurface() {
        return width * length;
    }
    public int getAvailablePlaces() {
        return capacity - occupiedSpaces;
    }
}
