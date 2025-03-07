import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Parking } from '../../../../core/models/parking.model';
import { ParkingOccupancyResponse } from '../../../../core/models/ParkingOccupancyResponse';
import { ParkingRevenueResponse } from '../../../../core/models/ParkingRevenueResponse';
import { ParkingService } from '../../../../core/services/parking.service';

interface Toast {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timeout?: any;
}

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
  parkingOccupancy: ParkingOccupancyResponse[] = [];
  parkingRevenue: ParkingRevenueResponse[] = [];
  
  // Search and filter
  searchTerm: string = '';
  filterOption: string = 'all';
  
  // Modal control
  isModalOpen = false;
  isEditMode = false;
  
  // Toast notifications
  toasts: Toast[] = [];
  toastIdCounter = 0;
  
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
      capacity:['' ,[Validators.minLength(3)]],
      availablePlaces: [null, [Validators.required, Validators.min(0)]],
      status: ['open', [Validators.required]], // Default status
      latitude: [null, [Validators.min(-90), Validators.max(90)]], // Optional
      longitude: [null, [Validators.min(-180), Validators.max(180)]] // Optional
    });
  }

  ngOnInit(): void {
    this.loadParkings();
    this.loadParkingOccupancy();
    this.loadParkingRevenue();
  }

  // Load all parkings
  loadParkings(): void {
    this.parkingService.getAllParkings().subscribe({
      next: (data) => {
        this.parkings = data;
        this.filterParkings();
        console.log("Liste des parkings:", data);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des parkings', error);
        this.showToast('error', 'Erreur lors du chargement des parkings');
      }
    });
  }

  // Load parking occupancy data
  loadParkingOccupancy(): void {
    this.parkingService.getParkingOccupancy().subscribe({
      next: (data) => {
        this.parkingOccupancy = data;
        console.log("Occupation des parkings:", data);
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'occupation des parkings', error);
        this.showToast('error', 'Erreur lors du chargement des données d\'occupation');
      }
    });
  }

  // Load parking revenue data
  loadParkingRevenue(): void {
    this.parkingService.getParkingRevenue().subscribe({
      next: (data) => {
        this.parkingRevenue = data;
        console.log("Revenus des parkings:", data);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des revenus des parkings', error);
        this.showToast('error', 'Erreur lors du chargement des données de revenus');
      }
    });
  }

  // Filter parkings based on search term and filter option
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
      result = result.filter(parking => parking.availablePlaces ?? 0  > 0);
    } else if (this.filterOption === 'full') {
      result = result.filter(parking => parking.availablePlaces === 0);
    }
    
    this.filteredParkings = result;
  }

  // Open modal for adding new parking
  openAddParkingModal(): void {
    this.isEditMode = false;
    this.currentParkingId = null;
    this.parkingForm.reset({ status: 'open' }); // Reset form with default status
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
      capacity: parking.capacity,
      availablePlaces: parking.availablePlaces,
      status: parking.status,
      latitude: parking.latitude,
      longitude: parking.longitude
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
          this.showToast('success', 'Parking mis à jour avec succès');
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour du parking', error);
          this.showToast('error', 'Erreur lors de la mise à jour du parking');
        }
      });
    } else {
      // Create new parking
      this.parkingService.createParking(parkingData).subscribe({
        next: (newParking) => {
          this.parkings.push(newParking);
          this.filterParkings();
          this.closeModal();
          this.showToast('success', 'Parking créé avec succès');
        },
        error: (error) => {
          console.error('Erreur lors de la création du parking', error);
          this.showToast('error', 'Erreur lors de la création du parking');
        }
      });
    }
  }

  // Close modal
  closeModal(): void {
    this.isModalOpen = false;
    this.parkingForm.reset({ status: 'open' }); // Reset form with default status
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
          this.showToast('success', 'Parking supprimé avec succès');
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du parking', error);
          this.showToast('error', 'Erreur lors de la suppression du parking');
        }
      });
    }
  }

  // Toast notification methods
  showToast(type: 'success' | 'error' | 'info' | 'warning', message: string, duration: number = 5000): void {
    const id = ++this.toastIdCounter;
    const toast: Toast = { id, type, message };
    
    // Add toast to the array
    this.toasts.push(toast);
    
    // Set timeout to remove the toast after duration
    toast.timeout = setTimeout(() => {
      this.removeToast(id);
    }, duration);
  }
  
  removeToast(id: number): void {
    const index = this.toasts.findIndex(t => t.id === id);
    if (index !== -1) {
      // Clear the timeout to prevent memory leaks
      clearTimeout(this.toasts[index].timeout);
      // Remove the toast from the array
      this.toasts.splice(index, 1);
    }
  }

  // Helper methods for UI
  getAvailabilityColorClass(parking: Parking): string {
    const availabilityPercentage = (parking.availablePlaces ?? 0 / parking.capacity) * 100;
    
    if (availabilityPercentage === 0) {
      return 'text-red-600 dark:text-red-400 font-medium';
    } else if (availabilityPercentage < 20) {
      return 'text-orange-600 dark:text-orange-400 font-medium';
    } else {
      return 'text-green-600 dark:text-green-400 font-medium';
    }
  }

  getProgressBarColorClass(parking: Parking): string {
    const availabilityPercentage = (parking.availablePlaces ?? 0 / parking.capacity) * 100;
    
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
    if (field.errors?.['max']) {
      return 'La valeur doit être inférieure ou égale à 90 pour la latitude et 180 pour la longitude';
    }
    return '';
  }
}