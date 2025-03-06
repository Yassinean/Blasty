import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Place } from '../../../../core/models/place.model';
import { Parking } from '../../../../core/models/parking.model';
import { PlaceService } from '../../../../core/services/place.service';
import { ParkingService } from '../../../../core/services/parking.service';

@Component({
  selector: 'app-place-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl:'./place-management.component.html',
})
export class PlaceManagementComponent implements OnInit {
  places: Place[] = [];
  filteredPlaces: Place[] = [];
  parkings: Parking[] = [];
  
  // Search and filter
  searchTerm: string = '';
  filterOption: string = 'all';
  
  // Modal control
  isModalOpen = false;
  isEditMode = false;
  placeForm: FormGroup;
  currentPlaceId: number | null = null;

  constructor(
    private placeService: PlaceService, 
    private parkingService: ParkingService,
    private fb: FormBuilder
  ) {
    this.placeForm = this.fb.group({
      type: ['', [Validators.required]],
      tarifHoraire: [null, [Validators.required, Validators.min(0)]],
      parkingId: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadParkings();
    this.loadPlaces();
  }

  loadParkings(): void {
    this.parkingService.getAllParkings().subscribe({
      next: (data) => {
        this.parkings = data;
      },
      error: (error) =>
        console.error('Erreur lors du chargement des parkings', error),
    });
  }

  loadPlaces(): void {
    this.placeService.getAllPlaces().subscribe({
      next: (data) => {
        this.places = data;
        this.filterPlaces();
      },
      error: (error) =>
        console.error('Erreur lors du chargement des places', error),
    });
  }
  
  getParkingName(parkingId: number): string {
    const parking = this.parkings.find(p => p.id === parkingId);
    return parking ? parking.name : `Parking #${parkingId}`;
  }
  
  filterPlaces(): void {
    let result = this.places;
    
    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(place => 
        place.type.toLowerCase().includes(term) || 
        this.getParkingName(place.parkingId).toLowerCase().includes(term)
      );
    }
    
    // Apply type filter
    if (this.filterOption !== 'all') {
      result = result.filter(place => place.type === this.filterOption);
    }
    
    this.filteredPlaces = result;
  }

  openAddPlaceModal(): void {
    this.isEditMode = false;
    this.currentPlaceId = null;
    this.placeForm.reset();
    this.isModalOpen = true;
  }

  openEditPlaceModal(place: Place): void {
    this.isEditMode = true;
    this.currentPlaceId = place.id;
    this.placeForm.patchValue({
      type: place.type,
      tarifHoraire: place.tarifHoraire,
      parkingId: place.parkingId.toString(), // Convert to string for the select element
    });
    this.isModalOpen = true;
  }

  submitPlaceForm(): void {
    if (this.placeForm.invalid) {
      Object.keys(this.placeForm.controls).forEach((key) => {
        const control = this.placeForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const placeData = {
      ...this.placeForm.value,
      parkingId: parseInt(this.placeForm.value.parkingId, 10) // Convert back to number
    };
    
    this.isEditMode ? this.updatePlace(placeData) : this.createPlace(placeData);
  }

  private updatePlace(placeData: any): void {
    this.placeService.updatePlace(this.currentPlaceId!, placeData).subscribe({
      next: (updatedPlace) => {
        const index = this.places.findIndex(
          (p) => p.id === this.currentPlaceId
        );
        if (index !== -1) this.places[index] = updatedPlace;
        this.filterPlaces();
        this.closeModal();
      },
      error: (error) =>
        console.error('Erreur lors de la mise à jour de la place', error),
    });
  }

  private createPlace(placeData: any): void {
    this.placeService.createPlace(placeData).subscribe({
      next: (newPlace) => {
        this.places.push(newPlace);
        this.filterPlaces();
        this.closeModal();
      },
      error: (error) =>
        console.error('Erreur lors de la création de la place', error),
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.placeForm.reset();
    this.isEditMode = false;
    this.currentPlaceId = null;
  }

  deletePlace(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette place ?')) {
      this.placeService.deletePlace(id).subscribe({
        next: () => {
          this.places = this.places.filter((p) => p.id !== id);
          this.filterPlaces();
        },
        error: (error) =>
          console.error('Erreur lors de la suppression de la place', error),
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.placeForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.placeForm.get(fieldName);
    if (!field) return '';
    if (field.errors?.['required']) return 'Ce champ est obligatoire';
    if (field.errors?.['min']) return 'La valeur doit être supérieure à 0';
    return '';
  }
}