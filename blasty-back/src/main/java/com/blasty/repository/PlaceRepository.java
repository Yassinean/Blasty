package com.blasty.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.blasty.model.Place;

public interface PlaceRepository extends JpaRepository<Place,Long>{

}
