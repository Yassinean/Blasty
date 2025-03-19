import { Component, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../../core/services/toast.service';
import {
  ReservationResponse,
  ReservationStatus,
} from '../../../../core/models/reservation.model';
import { ReservationService } from '../../../../core/services/reservation.service';

@Component({
  selector: 'app-reservation-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservation-management.component.html',
})
export class ReservationManagementComponent implements OnInit {
  reservations: ReservationResponse[] = [];
  filteredReservations: ReservationResponse[] = [];
  isLoading = false;
  searchTerm = '';
  filterStatus = '';
  sortField = 'createdAt';
  sortDirection = 'desc';

  // For action processing
  processingReservationId: number | null = null;

  constructor(
    private reservationService: ReservationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  // Add this method to transform API data if needed
  private transformReservationData(apiData: any[]): ReservationResponse[] {
    return apiData.map((item) => {
      // Ensure all required fields are present with default values if missing
      return {
        id: item.id || 0,
        clientId: item.clientId || 0,
        clientName: item.clientName || 'Client inconnu',
        placeId: item.placeId || 0,
        placeNumber: item.placeNumber || 'N/A',
        vehicleId: item.vehicleId || 0,
        vehicleImmatriculation: item.vehicleImmatriculation || 'N/A',
        parkingId: item.parkingId || 0,
        parkingName: item.parkingName || 'Parking inconnu',
        status: item.status || ReservationStatus.PENDING,
        startDate: item.startDate ? new Date(item.startDate) : new Date(),
        endDate: item.endDate ? new Date(item.endDate) : new Date(),
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
        tarif: item.tarif || 0,
      };
    });
  }

  loadReservations(): void {
    this.isLoading = true;
    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        console.log('Reservation data : ', data);
        this.reservations = this.transformReservationData(data);
        this.filterAndSortReservations();
        this.isLoading = false;
      },
      error: (error) => {
        this.toastService.showToast(
          'error',
          'Erreur lors du chargement des réservations'
        );
        console.error('Error loading reservations:', error);
        this.isLoading = false;
      },
    });
  }

  filterAndSortReservations(): void {
    // First apply filters
    let filtered = [...this.reservations];

    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (reservation) =>
          reservation.clientName.toLowerCase().includes(search) ||
          reservation.parkingName.toLowerCase().includes(search) ||
          reservation.placeNumber.toLowerCase().includes(search) ||
          reservation.vehicleImmatriculation.toLowerCase().includes(search)
      );
    }

    if (this.filterStatus) {
      filtered = filtered.filter(
        (reservation) => reservation.status === this.filterStatus
      );
    }

    // Then sort
    filtered.sort((a, b) => {
      let valueA: any;
      let valueB: any;

      // Extract the values to compare based on the sort field
      switch (this.sortField) {
        case 'createdAt':
          valueA = new Date(a.createdAt).getTime();
          valueB = new Date(b.createdAt).getTime();
          break;
        case 'startDate':
          valueA = new Date(a.startDate).getTime();
          valueB = new Date(b.startDate).getTime();
          break;
        case 'clientName':
          valueA = a.clientName.toLowerCase();
          valueB = b.clientName.toLowerCase();
          break;
        case 'parkingName':
          valueA = a.parkingName.toLowerCase();
          valueB = b.parkingName.toLowerCase();
          break;
        case 'status':
          valueA = a.status;
          valueB = b.status;
          break;
        case 'tarif':
          valueA = a.tarif;
          valueB = b.tarif;
          break;
        default:
          valueA = a.id;
          valueB = b.id;
      }

      // Apply sort direction
      const direction = this.sortDirection === 'asc' ? 1 : -1;

      if (valueA < valueB) return -1 * direction;
      if (valueA > valueB) return 1 * direction;
      return 0;
    });

    this.filteredReservations = filtered;
  }

  confirmReservation(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir confirmer cette réservation ?')) {
      this.processingReservationId = id;
      this.reservationService.confirmReservation(id).subscribe({
        next: () => {
          this.toastService.showToast(
            'success',
            'Réservation confirmée avec succès'
          );
          this.loadReservations();
          this.processingReservationId = null;
        },
        error: (error) => {
          this.toastService.showToast(
            'error',
            'Erreur lors de la confirmation de la réservation'
          );
          console.error('Error confirming reservation:', error);
          this.processingReservationId = null;
        },
      });
    }
  }

  completeReservation(id: number): void {
    if (
      confirm(
        'Êtes-vous sûr de vouloir marquer cette réservation comme terminée ?'
      )
    ) {
      this.processingReservationId = id;
      this.reservationService.completeReservation(id).subscribe({
        next: () => {
          this.toastService.showToast(
            'success',
            'Réservation terminée avec succès'
          );
          this.loadReservations();
          this.processingReservationId = null;
        },
        error: (error) => {
          this.toastService.showToast(
            'error',
            'Erreur lors de la complétion de la réservation'
          );
          console.error('Error completing reservation:', error);
          this.processingReservationId = null;
        },
      });
    }
  }

  deleteReservation(id: number): void {
    if (
      confirm(
        'Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible.'
      )
    ) {
      this.processingReservationId = id;
      this.reservationService.deleteReservation(id).subscribe({
        next: () => {
          this.toastService.showToast(
            'success',
            'Réservation supprimée avec succès'
          );
          this.loadReservations();
          this.processingReservationId = null;
        },
        error: (error) => {
          this.toastService.showToast(
            'error',
            'Erreur lors de la suppression de la réservation'
          );
          console.error('Error deleting reservation:', error);
          this.processingReservationId = null;
        },
      });
    }
  }

  // Helper methods
  getStatusClass(status: ReservationStatus): string {
    switch (status) {
      case ReservationStatus.PENDING:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case ReservationStatus.CONFIRMED:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case ReservationStatus.CANCELLED:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case ReservationStatus.COMPLETED:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  }

  getStatusLabel(status: ReservationStatus): string {
    switch (status) {
      case ReservationStatus.PENDING:
        return 'En attente';
      case ReservationStatus.CONFIRMED:
        return 'Confirmée';
      case ReservationStatus.CANCELLED:
        return 'Annulée';
      case ReservationStatus.COMPLETED:
        return 'Terminée';
      default:
        return status;
    }
  }

  formatDate(dateString: Date): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
    }).format(amount);
  }

  // Sorting methods
  setSortField(field: string): void {
    if (this.sortField === field) {
      // Toggle direction if clicking on the same field
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set new field and default to ascending
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.filterAndSortReservations();
  }

  getSortIcon(field: string): string {
    if (this.sortField !== field) return '';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  refreshData(): void {
    this.loadReservations();
  }

  // Action availability checks
  canConfirm(reservation: ReservationResponse): boolean {
    return reservation.status === ReservationStatus.PENDING;
  }

  canComplete(reservation: ReservationResponse): boolean {
    return reservation.status === ReservationStatus.CONFIRMED;
  }

  canDelete(reservation: ReservationResponse): boolean {
    return reservation.status === ReservationStatus.COMPLETED || reservation.status === ReservationStatus.CANCELLED;
  }
}
