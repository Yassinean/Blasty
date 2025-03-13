import { loadPlaces } from './../../../store/place/place.action';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Place, PlaceStatus, PlaceType } from '../../../core/models/place.model';
import { PlaceService } from '../../../core/services/place.service';
import { Toast } from '../../../core/models/toast';

@Component({
  selector: 'app-client-places',
  templateUrl: './client-places.component.html',
  styleUrls: ['./client-places.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ClientPlacesComponent implements OnInit {
  places: Place[] = [];
  loading = true;
  error = false;

  // Reservation modal
  selectedPlace: Place | null = null;
  showReservationModal = false;
  reservationDateTime: string = '';
  reservationInProgress = false;

  // Toast notifications
  toasts: Toast[] = [];
  toastIdCounter = 0;
  PlaceStatus: PlaceStatus = PlaceStatus.DISPONIBLE;

  constructor(private placeService: PlaceService) {}

  ngOnInit(): void {
    this.loadPlaces();
  }

  loadPlaces(): void {
    this.loading = true;
    this.error = false;

    this.placeService.getAllPlaces().subscribe({
      next: (places) => {
        // this.places = places;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading places:', err);
        this.loading = false;
        this.error = true;
        this.showToast('error', 'Impossible de charger les places de parking');
      },
    });
  }

  getPlaceColor(place: Place): string {
    if (place.type === PlaceType.VIP) return 'bg-yellow-500';
    if (place.type === PlaceType.HANDICAP) return 'bg-purple-500';
    return 'bg-green-500';
  }

  openReservationModal(place: Place): void {
    this.selectedPlace = place;
    this.showReservationModal = true;

    // Set default reservation time to current time + 1 hour
    const now = new Date();
    now.setHours(now.getHours() + 1);
    this.reservationDateTime = now.toISOString().slice(0, 16);
  }

  closeReservationModal(): void {
    this.showReservationModal = false;
    setTimeout(() => {
      this.selectedPlace = null;
      this.reservationDateTime = '';
    }, 300); // Wait for animation to complete
  }

  reservePlace(): void {
    if (!this.selectedPlace || !this.reservationDateTime) return;

    this.reservationInProgress = true;
    const reservationDate:string = 'new Date(this.reservationDateTime)';

    this.placeService
      .reservePlace(this.selectedPlace.id ?? 0, reservationDate)
      .subscribe({
        next: () => {
          this.reservationInProgress = false;
          this.showToast('success', 'Place réservée avec succès');
          this.closeReservationModal();
          this.loadPlaces(); // Refresh places to update status
        },
        error: (err) => {
          console.error('Error reserving place:', err);
          this.reservationInProgress = false;
          this.showToast('error', 'Erreur lors de la réservation de la place');
        },
      });
  }

  // Toast notification methods
  showToast(
    type: 'success' | 'error' | 'info',
    message: string,
    duration: number = 5000
  ): void {
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
    const index = this.toasts.findIndex((t) => t.id === id);
    if (index !== -1) {
      // Clear the timeout to prevent memory leaks
      clearTimeout(this.toasts[index].timeout);
      // Remove the toast from the array
      this.toasts.splice(index, 1);
    }
  }
}
