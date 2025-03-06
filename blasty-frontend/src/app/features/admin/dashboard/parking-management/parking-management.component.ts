import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Parking } from '../../../../core/models/parking.model';
import { ParkingService } from '../../../../core/services/parking.service';


@Component({
  selector: 'app-parking-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './parking-management.component.html',
  styles: [`
    /* Add any component-specific styles here */
  `]
})
export class ParkingManagementComponent implements OnInit {
  parkings: Parking[] = [];
  filteredParkings: Parking[] = [];
  
  // Search and filter
  searchTerm: string = '';
  filterOption: string = 'all';
  
  // Modal control
  isModalOpen = false;
  isEditMode = false;
  
  // Parking form
  parkingForm: FormGroup;
  currentParkingId: number | null = null;

  constructor(
    private parkingService: ParkingService,
    private fb: FormBuilder
  ) {
    // Initialize the form
    this.parkingForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', [Validators.required]],
      totalCapacity: [null, [Validators.required, Validators.min(1)]],
      availablePlaces: [null, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadParkings();
  }

  loadParkings(): void {
    this.parkingService.getAllParkings().subscribe({
      next: (data) => {
        this.parkings = data;
        this.filterParkings();
        console.log("Liste des parkings:", data);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des parkings', error);
        // TODO: Add error handling toast or notification
      }
    });
  }

  filterParkings(): void {
    let result = this.parkings;
    
    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(parking => 
        parking.name.toLowerCase().includes(term) || 
        parking.address.toLowerCase().includes(term)
      );
    }
    
    // Apply availability filter
    if (this.filterOption === 'available') {
      result = result.filter(parking => parking.availablePlaces > 0);
    } else if (this.filterOption === 'full') {
      result = result.filter(parking => parking.availablePlaces === 0);
    }
    
    this.filteredParkings = result;
  }

  // Open modal for adding new parking
  openAddParkingModal(): void {
    this.isEditMode = false;
    this.currentParkingId = null;
    this.parkingForm.reset();
    this.isModalOpen = true;
  }

  // Open modal for editing existing parking
  openEditParkingModal(parking: Parking): void {
    this.isEditMode = true;
    this.currentParkingId = parking.id;
    
    // Populate form with existing parking data
    this.parkingForm.patchValue({
      name: parking.name,
      address: parking.address,
      totalCapacity: parking.totalCapacity,
      availablePlaces: parking.availablePlaces
    });
    
    this.isModalOpen = true;
  }

  // Submit parking form (create or update)
  submitParkingForm(): void {
    if (this.parkingForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.parkingForm.controls).forEach(key => {
        const control = this.parkingForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const parkingData = this.parkingForm.value;

    if (this.isEditMode && this.currentParkingId) {
      // Update existing parking
      this.parkingService.updateParking(this.currentParkingId, parkingData).subscribe({
        next: (updatedParking) => {
          // Replace the old parking with the updated one
          const index = this.parkings.findIndex(p => p.id === this.currentParkingId);
          if (index !== -1) {
            this.parkings[index] = updatedParking;
          }
          this.filterParkings();
          this.closeModal();
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour du parking', error);
          // TODO: Add error handling toast or notification
        }
      });
    } else {
      // Create new parking
      this.parkingService.createParking(parkingData).subscribe({
        next: (newParking) => {
          this.parkings.push(newParking);
          this.filterParkings();
          this.closeModal();
        },
        error: (error) => {
          console.error('Erreur lors de la création du parking', error);
          // TODO: Add error handling toast or notification
        }
      });
    }
  }

  // Close modal
  closeModal(): void {
    this.isModalOpen = false;
    this.parkingForm.reset();
    this.currentParkingId = null;
    this.isEditMode = false;
  }

  // Delete parking
  deleteParking(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce parking ?')) {
      this.parkingService.deleteParking(id).subscribe({
        next: () => {
          this.parkings = this.parkings.filter((p) => p.id !== id);
          this.filterParkings();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du parking', error);
          // TODO: Add error handling toast or notification
        }
      });
    }
  }

  // Helper methods for UI
  getAvailabilityColorClass(parking: Parking): string {
    const availabilityPercentage = (parking.availablePlaces / parking.totalCapacity) * 100;
    
    if (availabilityPercentage === 0) {
      return 'text-red-600 dark:text-red-400 font-medium';
    } else if (availabilityPercentage < 20) {
      return 'text-orange-600 dark:text-orange-400 font-medium';
    } else {
      return 'text-green-600 dark:text-green-400 font-medium';
    }
  }

  getProgressBarColorClass(parking: Parking): string {
    const availabilityPercentage = (parking.availablePlaces / parking.totalCapacity) * 100;
    
    if (availabilityPercentage === 0) {
      return 'bg-red-600';
    } else if (availabilityPercentage < 20) {
      return 'bg-orange-500';
    } else {
      return 'bg-green-500';
    }
  }

  // Validation helpers
  isFieldInvalid(fieldName: string): boolean {
    const field = this.parkingForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.parkingForm.get(fieldName);
    if (!field) return '';

    if (field.errors?.['required']) {
      return 'Ce champ est obligatoire';
    }
    if (field.errors?.['minlength']) {
      return 'Le nom doit contenir au moins 3 caractères';
    }
    if (field.errors?.['min']) {
      return 'La valeur doit être supérieure à 0';
    }
    return '';
  }
}