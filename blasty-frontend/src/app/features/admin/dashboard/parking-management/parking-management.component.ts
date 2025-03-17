import { ToastService } from './../../../../core/services/toast.service';
import { Component, OnInit } from '@angular/core';
import {
  Parking,
  ParkingRequest,
  ParkingResponse,
  ParkingStatus,
} from '../../../../core/models/parking.model';
import { ParkingService } from '../../../../core/services/parking.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Toast } from '../../../../core/models/toast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parking-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './parking-management.component.html',
  styleUrls: ['./parking-management.component.css'],
})
export class ParkingManagementComponent implements OnInit {
  parkings: ParkingResponse[] = [];
  filteredParkings: ParkingResponse[] = [];
  parkingForm: FormGroup;
  isEditMode = false;
  currentParkingId: number | null = null;
  showModal = false;
  searchTerm = '';
  statusFilter = 'ALL';
  loading = false;
  isModalOpen = false;

  // Toast notifications
  toasts: Toast[] = [];
  toastIdCounter = 0;

  constructor(
    private parkingService: ParkingService,
    private toastService: ToastService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.parkingForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', [Validators.required]],
      capacity: ['', [Validators.required, Validators.min(1)]],
      width: ['', [Validators.required, Validators.min(1)]],
      length: ['', [Validators.required, Validators.min(1)]],
      status: [ParkingStatus.OPEN, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadParkings();
  }

  loadParkings(): void {
    this.loading = true;
    this.parkingService.getAllParkings().subscribe({
      next: (data) => {
        this.parkings = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading parkings:', error);
        this.toastService.showToast('error', 'Erreur lors du chargement des parkings');
        this.loading = false;
      },
    });
  }

  openModal(parking?: ParkingResponse): void {
    if (parking) {
      this.isEditMode = true;
      this.currentParkingId = parking.id;
      this.parkingForm.patchValue({
        name: parking.name,
        address: parking.address,
        capacity: parking.capacity,
        width: parking.width,
        length: parking.length,
        status: parking.status,
      });
    } else {
      this.isEditMode = false;
      this.currentParkingId = null;
      this.parkingForm.reset({
        status: ParkingStatus.OPEN,
      });
    }
    this.showModal = true;
  }

  saveParking(): void {
    if (this.parkingForm.invalid) {
      this.parkingForm.markAllAsTouched();
      return;
    }

    const parkingData: ParkingRequest = this.parkingForm.value;

    if (this.isEditMode && this.currentParkingId) {
      this.updateParking(this.currentParkingId, parkingData);
    } else {
      this.createParking(parkingData);
    }
  }

  createParking(parkingData: ParkingRequest): void {
    this.loading = true;
    this.parkingService.createParking(parkingData).subscribe({
      next: (response) => {
        this.toastService.showToast('success', 'Parking créé avec succès');
        this.loadParkings();
        this.closeModal();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error creating parking:', error);
        this.toastService.showToast(
          'error',
          this.getErrorMessage(error) || 'Erreur lors de la création du parking'
        );
        this.loading = false;
      },
    });
  }

  updateParking(id: number, parkingData: ParkingRequest): void {
    this.loading = true;
    this.parkingService.updateParking(id, parkingData).subscribe({
      next: (response) => {
        this.toastService.showToast('success', 'Parking mis à jour avec succès');
        this.loadParkings();
        this.closeModal();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error updating parking:', error);
        this.toastService.showToast(
          'error',
          this.getErrorMessage(error) ||
            'Erreur lors de la mise à jour du parking'
        );
        this.loading = false;
      },
    });
  }

  deleteParking(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce parking ?')) {
      this.loading = true;
      this.parkingService.deleteParking(id).subscribe({
        next: () => {
          this.toastService.showToast('success', 'Parking supprimé avec succès');
          this.loadParkings();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error deleting parking:', error);
          this.toastService.showToast('error', 'Erreur lors de la suppression du parking');
          this.loading = false;
        },
      });
    }
  }

  applyFilters(): void {
    let filtered = [...this.parkings];

    // Apply search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (parking) =>
          parking.name.toLowerCase().includes(search) ||
          parking.address.toLowerCase().includes(search)
      );
    }

    // Apply status filter
    if (this.statusFilter !== 'ALL') {
      filtered = filtered.filter(
        (parking) => parking.status === this.statusFilter
      );
    }

    this.filteredParkings = filtered;
  }

  onSearchChange(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  onStatusFilterChange(event: Event): void {
    this.statusFilter = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  getStatusClass(status: ParkingStatus): string {
    switch (status) {
      case ParkingStatus.OPEN:
        return 'bg-green-100 text-green-800';
      case ParkingStatus.MAINTENANCE:
        return 'bg-yellow-100 text-yellow-800';
      case ParkingStatus.CLOSED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getAvailablePlaces(parkingId: number): void {
    this.parkingService.getAvailablePlaces(parkingId).subscribe({
      next: (availablePlaces) => {
        this.toastService.showToast('info', `Places disponibles: ${availablePlaces}`);
      },
      error: (error) => {
        console.error('Error getting available places:', error);
        this.toastService.showToast(
          'error',
          'Erreur lors de la récupération des places disponibles'
        );
      },
    });
  }

  // modal
  openAddParkingModal(): void {
    this.isEditMode = false;
    this.currentParkingId = null;
    this.parkingForm.reset({ status: 'open' }); // Reset form with default status
    this.isModalOpen = true;
  }

  // Open modal for editing existing parking
  openEditParkingModal(parking: Parking): void {
    this.isEditMode = true;
    this.currentParkingId = parking.id ?? null;

    // Populate form with existing parking data
    this.parkingForm.patchValue({
      name: parking.name,
      address: parking.address,
      capacity: parking.capacity,
      status: parking.status,
      width: parking.width,
      length: parking.length,
    });

    this.isModalOpen = true;
  }

  managePlaces(parkingId: string): void {
    const id = +parkingId; // Convert to number
    console.log('Parking ID:', id);
    if (isNaN(id)) {
      this.toastService.showToast('error', 'Invalid parking ID');
      return;
    }
    this.router.navigate([`/admin/dashboard/parkings/${id}/places`]);
  }

  // Submit parking form (create or update)
  submitParkingForm(): void {
    if (this.parkingForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.parkingForm.controls).forEach((key) => {
        const control = this.parkingForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const parkingData = this.parkingForm.value;

    if (this.isEditMode && this.currentParkingId) {
      // Update existing parking
      this.parkingService
        .updateParking(this.currentParkingId, parkingData)
        .subscribe({
          next: (updatedParking) => {
            // Replace the old parking with the updated one
            const index = this.parkings.findIndex(
              (p) => p.id === this.currentParkingId
            );
            if (index !== -1) {
              this.parkings[index] = updatedParking;
            }
            this.applyFilters();
            this.closeModal();
            this.toastService.showToast('success', 'Parking mis à jour avec succès');
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour du parking', error);
            this.toastService.showToast('error', 'Erreur lors de la mise à jour du parking');
          },
        });
    } else {
      // Create new parking
      this.parkingService.createParking(parkingData).subscribe({
        next: (newParking) => {
          this.parkings.push(newParking);
          this.applyFilters();
          this.closeModal();
          this.toastService.showToast('success', 'Parking créé avec succès');
        },
        error: (error) => {
          console.error('Erreur lors de la création du parking', error);
          this.toastService.showToast('error', 'Erreur lors de la création du parking');
        },
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

  // Helper method to extract error message from backend response
  getErrorMessage(error: any): string {
    if (error.error && typeof error.error === 'string') {
      return error.error;
    } else if (error.error && error.error.message) {
      return error.error.message;
    } else if (error.message) {
      return error.message;
    }
    return 'Une erreur est survenue';
  }

  // Form validation helpers
  get nameControl() {
    return this.parkingForm.get('name');
  }
  get addressControl() {
    return this.parkingForm.get('address');
  }
  get capacityControl() {
    return this.parkingForm.get('capacity');
  }
  get widthControl() {
    return this.parkingForm.get('width');
  }
  get lengthControl() {
    return this.parkingForm.get('length');
  }
  get statusControl() {
    return this.parkingForm.get('status');
  }

  // Helper methods for UI
  getAvailabilityColorClass(parking: Parking): string {
    const availabilityPercentage =
      ((parking.capacity - (parking.occupiedSpaces ?? 0)) / parking.capacity) *
      100;

    if (availabilityPercentage === 0) {
      return 'text-red-600 dark:text-red-400 font-medium';
    } else if (availabilityPercentage < 20) {
      return 'text-orange-600 dark:text-orange-400 font-medium';
    } else {
      return 'text-green-600 dark:text-green-400 font-medium';
    }
  }

  getProgressBarColorClass(parking: Parking): string {
    const availabilityPercentage =
      ((parking.capacity - (parking.occupiedSpaces ?? 0)) / parking.capacity) *
      100;

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
}
