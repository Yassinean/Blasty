import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Place } from '../../../../core/models/place.model';
import { Parking } from '../../../../core/models/parking.model';
import { PlaceService } from '../../../../core/services/place.service';
import { ParkingService } from '../../../../core/services/parking.service';

@Component({
  selector: 'app-place-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './place-management.component.html',
})
export class PlaceManagementComponent implements OnInit {
  places: Place[] = [];
  filteredPlaces: Place[] = [];
  parkings: Parking[] = [];

  // Search and filter
  searchTerm: string = '';
  filterOption: string = 'all';
  filterParkingId: string | number = 'all' ;

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

  // Load parkings from the service
  loadParkings(): void {
    this.parkingService.getAllParkings().subscribe({
      next: (data) => (this.parkings = data),
      error: (error) => console.error('Erreur lors du chargement des parkings', error),
    });
  }

  // Load places from the service
  loadPlaces(): void {
    this.placeService.getAllPlaces().subscribe({
      next: (data) => {
        this.places = data;
        this.filterPlaces();
      },
      error: (error) => console.error('Erreur lors du chargement des places', error),
    });
  }

  // Get parking name by ID
  getParkingName(parkingId: number): string {
    const parking = this.parkings.find((p) => p.id === parkingId);
    return parking ? parking.name : `Parking #${parkingId}`;
  }

  // Filter places based on search term and filter option
  filterPlaces(): void {
    let result = this.places;

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(
        (place) =>
          place.type.toLowerCase().includes(term) ||
          this.getParkingName(place.parkingId).toLowerCase().includes(term)
      );
    }

    // Apply type filter
    if (this.filterOption !== 'all') {
      result = result.filter((place) => place.type === this.filterOption);
    }

    if (this.filterParkingId !== 'all') {
      result = result.filter((place) => place.parkingId === +this.filterParkingId);
    }

    this.filteredPlaces = result;
  }

  // Open modal for adding a new place
  openAddPlaceModal(): void {
    this.isEditMode = false;
    this.currentPlaceId = null;
    this.placeForm.reset();
    this.isModalOpen = true;
  }

  // Open modal for editing an existing place
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

  // Submit the place form (create or update)
  submitPlaceForm(): void {
    if (this.placeForm.invalid) {
      this.markFormAsTouched();
      return;
    }

    const placeData = {
      ...this.placeForm.value,
      parkingId: parseInt(this.placeForm.value.parkingId, 10), // Convert back to number
    };

    if (this.isEditMode) {
      this.updatePlace(placeData);
    } else {
      this.createPlace(placeData);
    }
  }

  // Update an existing place
  private updatePlace(placeData: any): void {
    this.placeService.updatePlace(this.currentPlaceId!, placeData).subscribe({
      next: (updatedPlace) => {
        const index = this.places.findIndex((p) => p.id === this.currentPlaceId);
        if (index !== -1) this.places[index] = updatedPlace;
        this.filterPlaces();
        this.closeModal();
      },
      error: (error) => console.error('Erreur lors de la mise à jour de la place', error),
    });
  }

  // Create a new place
  private createPlace(placeData: any): void {
    this.placeService.createPlace(placeData).subscribe({
      next: (newPlace) => {
        this.places.push(newPlace);
        this.filterPlaces();
        this.closeModal();
      },
      error: (error) => console.error('Erreur lors de la création de la place', error),
    });
  }

  // Close the modal and reset the form
  closeModal(): void {
    this.isModalOpen = false;
    this.placeForm.reset();
    this.isEditMode = false;
    this.currentPlaceId = null;
  }

  // Delete a place
  deletePlace(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette place ?')) {
      this.placeService.deletePlace(id).subscribe({
        next: () => {
          this.places = this.places.filter((p) => p.id !== id);
          this.filterPlaces();
        },
        error: (error) => console.error('Erreur lors de la suppression de la place', error),
      });
    }
  }

  // Mark all form fields as touched to show validation errors
  private markFormAsTouched(): void {
    Object.keys(this.placeForm.controls).forEach((key) => {
      this.placeForm.get(key)?.markAsTouched();
    });
  }

  // Check if a form field is invalid
  isFieldInvalid(fieldName: string): boolean {
    const field = this.placeForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  // Get the error message for a form field
  getErrorMessage(fieldName: string): string {
    const field = this.placeForm.get(fieldName);
    if (!field) return '';

    if (field.errors?.['required']) return 'Ce champ est obligatoire';
    if (field.errors?.['min']) return 'La valeur doit être supérieure à 0';
    return '';
  }
}