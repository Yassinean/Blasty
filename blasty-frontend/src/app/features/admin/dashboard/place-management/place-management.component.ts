import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Place } from '../../../../core/models/place.model';
import { PlaceService } from '../../../../core/services/place.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-place-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './place-management.component.html',
  styleUrls: ['./place-management.component.css'],
})
export class PlaceManagementComponent implements OnInit {
  places: Place[] = [];
  isModalOpen = false;
  isEditMode = false;
  placeForm: FormGroup;
  currentPlaceId: number | null = null;

  constructor(
    private placeService: PlaceService,
    private fb: FormBuilder
  ) {
    this.placeForm = this.fb.group({
      type: ['', [Validators.required]],
      tarifHoraire: [null, [Validators.required, Validators.min(0)]],
      parkingId: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadPlaces();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return token
      ? new HttpHeaders({ 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' })
      : new HttpHeaders();
  }

  loadPlaces(): void {
    const headers = this.getAuthHeaders();
    this.placeService.getAllPlaces().subscribe({
      next: (data) => this.places = data,
      error: (error) => console.error('Erreur lors du chargement des places', error),
    });
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
      parkingId: place.parkingId,
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

    const placeData = this.placeForm.value;
    this.isEditMode ? this.updatePlace(placeData) : this.createPlace(placeData);
  }

  private updatePlace(placeData: any): void {
    this.placeService.updatePlace(this.currentPlaceId!, placeData).subscribe({
      next: (updatedPlace) => {
        const index = this.places.findIndex((p) => p.id === this.currentPlaceId);
        if (index !== -1) this.places[index] = updatedPlace;
        this.closeModal();
      },
      error: (error) => console.error('Erreur lors de la mise à jour de la place', error),
    });
  }

  private createPlace(placeData: any): void {
    this.placeService.createPlace(placeData).subscribe({
      next: (newPlace) => {
        this.places.push(newPlace);
        this.closeModal();
      },
      error: (error) => console.error('Erreur lors de la création de la place', error),
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
        next: () => this.places = this.places.filter((p) => p.id !== id),
        error: (error) => console.error('Erreur lors de la suppression de la place', error),
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
