import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PlaceResponse } from '../../../core/models/place.model';
import { PlaceService } from '../../../core/services/place.service';
import { ParkingService } from '../../../core/services/parking.service';
import { ParkingResponse } from '../../../core/models/parking.model';
import { ToastService } from '../../../core/services/toast.service';
import {
  VehicleResponse,
  VehicleType,
} from '../../../core/models/vehicle.model';
import { VehicleService } from '../../../core/services/vehicle.service';
import { AuthService } from '../../../core/services/auth.service';
import { ReservationService } from '../../../core/services/reservation.service';
import { ReservationRequest } from '../../../core/models/reservation.model';

@Component({
  selector: 'app-parking-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './parking-detail.component.html',
})
export class ParkingDetailComponent implements OnInit {
  parkingId: number | null = null;
  parking: ParkingResponse | null = null;
  places: PlaceResponse[] = [];
  filteredPlaces: PlaceResponse[] = [];
  isLoading = false;
  filterType = '';
  filterStatus = '';
  selectedPlace: PlaceResponse | null = null;
  showBookingModal = false;
  vehicle: VehicleResponse | null = null;
  loadingVehicle = false;

  // Reservation form
  reservationForm: FormGroup;
  submittingReservation = false;

  // Date and time pickers
  minDate: string;
  maxDate: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private parkingService: ParkingService,
    private placeService: PlaceService,
    private toastService: ToastService,
    private vehicleService: VehicleService,
    private reservationService: ReservationService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    // Initialize reservation form
    this.reservationForm = this.fb.group({
      reservationDate: ['', Validators.required],
      startDate: ['', Validators.required],
    });

    // Set min and max dates for reservation
    const now = new Date();
    this.minDate = now.toISOString().split('T')[0];

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // Max 30 days in advance
    this.maxDate = maxDate.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.parkingId = +id;
        this.loadParking();
        this.loadUserVehicle();
      } else {
        this.toastService.showToast('error', 'ID de parking non trouvé');
        this.goBackToDashboard();
      }
    });
  }

  loadParking(): void {
    if (!this.parkingId) return;

    this.isLoading = true;
    this.parkingService.getParkingById(this.parkingId).subscribe({
      next: (data) => {
        this.parking = data;
        this.loadPlaces();
      },
      error: (error) => {
        this.toastService.showToast(
          'error',
          'Erreur lors du chargement du parking'
        );
        console.error('Error loading parking:', error);
        this.isLoading = false;
        this.goBackToDashboard();
      },
    });
  }

  // Update the loadPlaces method to properly handle the API response
  loadPlaces(): void {
    if (!this.parkingId) return;

    this.placeService.getPlacesByParkingId(this.parkingId).subscribe({
      next: (data) => {
        console.log('Places data received:', data); // Debug log
        this.places = data;
        this.filteredPlaces = [...this.places]; // Initialize filtered places with all places
        this.isLoading = false;
      },
      error: (error) => {
        this.toastService.showToast(
          'error',
          'Erreur lors du chargement des places'
        );
        console.error('Error loading places:', error);
        this.isLoading = false;
      },
    });
  }

  loadUserVehicle(): void {
    this.loadingVehicle = true;
    this.vehicleService.getMyVehicle().subscribe({
      next: (vehicle) => {
        this.vehicle = vehicle;
        this.loadingVehicle = false;
      },
      error: (error) => {
        this.toastService.showToast(
          'error',
          'Erreur lors du chargement de vos véhicules'
        );
        console.error('Error loading vehicles:', error);
        this.loadingVehicle = false;
      },
    });
  }

  // Update the filterPlaces method to ensure it's working correctly
  filterPlaces(): void {
    console.log('Filtering places. Total places:', this.places.length);
    console.log('Filter type:', this.filterType);
    console.log('Filter status:', this.filterStatus);

    let filtered = [...this.places];

    if (this.filterType) {
      filtered = filtered.filter((place) => place.type === this.filterType);
    }

    if (this.filterStatus) {
      filtered = filtered.filter((place) => place.etat === this.filterStatus);
    }

    console.log('Filtered places count:', filtered.length);
    this.filteredPlaces = filtered;
  }

  // Update the selectPlace method to use the correct status property
  selectPlace(place: PlaceResponse): void {
    console.log('Selected place:', place);
    if (place.etat === 'DISPONIBLE') {
      this.selectedPlace = place;

      // Check if user has a vehicle
      if (!this.vehicle) {
        this.toastService.showToast(
          'info',
          'Vous devez enregistrer un véhicule avant de pouvoir réserver une place'
        );
        this.router.navigate(['/client/dashboard/vehicle']);
        return;
      }

      // Check vehicle compatibility with place
      if (!this.isVehicleCompatible()) {
        this.toastService.showToast(
          'error',
          `Votre véhicule (${this.getVehicleTypeLabel(
            this.vehicle.type
          )}) n'est pas compatible avec cette place (${this.getTypeLabel(
            place.type
          )})`
        );
        return;
      }

      this.showBookingModal = true;

      // Reset form
      this.reservationForm.reset();

      // Set default time to current time + 1 hour (rounded to nearest hour)
      const now = new Date();
      now.setHours(now.getHours() + 1);
      now.setMinutes(0);
      now.setSeconds(0);

      const timeString = now.toTimeString().substring(0, 5); // Format: HH:MM

      this.reservationForm.patchValue({
        reservationDate: this.minDate,
        startDate: timeString,
      });
    } else {
      this.toastService.showToast('info', "Cette place n'est pas disponible");
    }
  }

  bookPlace(): void {
    if (this.reservationForm.invalid || !this.selectedPlace || !this.vehicle) {
      this.toastService.showToast(
        'error',
        'Veuillez remplir tous les champs requis'
      );
      return;
    }

    this.submittingReservation = true;

    // Get current user ID
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      this.toastService.showToast(
        'error',
        'Vous devez être connecté pour réserver une place'
      );
      this.submittingReservation = false;
      return;
    }

    // Combine date and time
    const reservationDateTime = this.reservationForm.get('startDate')?.value;

    // Create reservation request
    const request: ReservationRequest = {
      clientId: currentUser.id,
      placeId: this.selectedPlace.id,
      vehicleId: this.vehicle.id,
      startDate: reservationDateTime, // Ensure startDate is set
    };

    this.reservationService.createReservation(request).subscribe({
      next: (response) => {
        this.toastService.showToast('success', 'Réservation créée avec succès');
        this.submittingReservation = false;
        this.showBookingModal = false;
        this.router.navigate(['/client/dashboard/reservations']);
      },
      error: (error) => {
        let errorMessage = 'Erreur lors de la création de la réservation';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.toastService.showToast(
          'error',
          'Erreur au niveau de réservation , vérifiez les entrées du formulaire'
        );
        this.submittingReservation = false;
      },
    });
  }

  closeBookingModal(): void {
    this.showBookingModal = false;
    this.selectedPlace = null;
  }

  goBackToDashboard(): void {
    this.router.navigate(['/client/dashboard']);
  }

  getVehicleLabel(): string {
    if (!this.vehicle) return '';
    return `${this.vehicle.type}(${this.vehicle.immatriculation})`;
  }

  getVehicleTypeLabel(type: VehicleType): string {
    switch (type) {
      case VehicleType.VOITURE:
        return 'Voiture';
      case VehicleType.MOTO:
        return 'Moto';
      case VehicleType.CAMION:
        return 'Camionnette';
      default:
        return type;
    }
  }

  isVehicleCompatible(): boolean {
    if (!this.selectedPlace || !this.vehicle) return false;

    // Check compatibility based on place type and vehicle type
    switch (this.selectedPlace.type) {
      case 'STANDARD':
        return this.vehicle.type === VehicleType.VOITURE;
      case 'HANDICAPE':
        return this.vehicle.type === VehicleType.VOITURE;
      case 'VIP':
        return true; // VIP places can accommodate all vehicle types
      default:
        return true;
    }
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'STANDARD':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'HANDICAPE':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'VIP':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'DISPONIBLE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'RESERVEE':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'OCCUPEE':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'STANDARD':
        return 'Standard';
      case 'HANDICAPE':
        return 'Handicapé';
      case 'VIP':
        return 'VIP';
      default:
        return type;
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'DISPONIBLE':
        return 'Disponible';
      case 'RESERVEE':
        return 'Réservée';
      case 'OCCUPEE':
        return 'Occupée';
      default:
        return status;
    }
  }

  getPlaceIcon(type: string): string {
    switch (type) {
      case 'HANDICAPE':
        return `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6">
            <circle cx="12" cy="12" r="10" />
            <path d="M9 12h6" />
            <path d="M12 9v6" />
          </svg>
        `;
      case 'VIP':
        return `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        `;
      default:
        return `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 3v18" />
          </svg>
        `;
    }
  }
}
