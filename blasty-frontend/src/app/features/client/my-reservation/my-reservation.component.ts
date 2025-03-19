import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { ReservationResponse, ReservationStatus } from "../../../core/models/reservation.model"
import { ReservationService } from "../../../core/services/reservation.service"
import { ToastService } from "../../../core/services/toast.service"

@Component({
  selector: "app-my-reservations",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./my-reservation.component.html",
})
export class MyReservationComponent implements OnInit {
  reservations: ReservationResponse[] = []
  isLoading = false
  cancellingReservation: number | null = null

  constructor(
    private reservationService: ReservationService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadReservations()
  }

  loadReservations(): void {
    this.isLoading = true
    this.reservationService.getMyReservations().subscribe({
      next: (data) => {
        console.log("Received reservation data:", data)
        // Transform the data if needed
        this.reservations = this.transformReservationData(data)
        this.isLoading = false
      },
      error: (error) => {
        this.toastService.showToast("error", "Erreur lors du chargement des réservations")
        console.error("Error loading reservations:", error)
        this.isLoading = false
      },
    })
  }

  // Add this method to transform API data if needed
  private transformReservationData(apiData: any[]): ReservationResponse[] {
    return apiData.map((item) => {
      // Ensure all required fields are present with default values if missing
      return {
        id: item.id || 0,
        clientId: item.clientId || 0,
        clientName: item.clientName || "Client inconnu",
        placeId: item.placeId || 0,
        placeNumber: item.placeNumber || "N/A",
        vehicleId: item.vehicleId || 0,
        vehicleImmatriculation: item.vehicleImmatriculation || "N/A",
        parkingId: item.parkingId || 0,
        parkingName: item.parkingName || "Parking inconnu",
        status: item.status || ReservationStatus.PENDING,
        startDate: item.startDate ? new Date(item.startDate) : new Date(),
        endDate: item.endDate ? new Date(item.endDate) : new Date(),
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
        tarif: item.tarif || 0,
      }
    })
  }

  cancelReservation(id: number): void {
    const reservation = this.reservations.find((r) => r.id === id)

    if (!reservation) {
      this.toastService.showToast("error", "Réservation introuvable")
      return
    }

    // Check if the reservation can be cancelled
    if (reservation.status === ReservationStatus.CONFIRMED || reservation.status === ReservationStatus.PENDING) {
      if (confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
        this.cancellingReservation = id
        this.reservationService.cancelReservation(id).subscribe({
          next: () => {
            this.toastService.showToast("success", "Réservation annulée avec succès")
            this.loadReservations()
            this.cancellingReservation = null
          },
          error: (error) => {
            let errorMessage = "Erreur lors de l'annulation de la réservation"

            // Handle specific error messages from the backend
            if (error.error && error.error.message) {
              errorMessage = error.error.message
            }

            this.toastService.showToast("error", errorMessage)
            console.error("Error cancelling reservation:", error)
            this.cancellingReservation = null
          },
        })
      }
    } else {
      this.toastService.showToast("error", "Cette réservation ne peut pas être annulée")
    }
  }

  getStatusClass(status: ReservationStatus): string {
    switch (status) {
      case ReservationStatus.PENDING:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case ReservationStatus.CONFIRMED:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case ReservationStatus.CANCELLED:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case ReservationStatus.COMPLETED:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  getStatusLabel(status: ReservationStatus): string {
    switch (status) {
      case ReservationStatus.PENDING:
        return "En attente"
      case ReservationStatus.CONFIRMED:
        return "Confirmée"
      case ReservationStatus.CANCELLED:
        return "Annulée"
      case ReservationStatus.COMPLETED:
        return "Terminée"
      default:
        return status
    }
  }

  formatDate(dateString: Date): string {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  canCancel(reservation: ReservationResponse): boolean {
    // Only allow cancellation for PENDING reservations
    // For CONFIRMED reservations, the backend will reject the cancellation
    return reservation.status === ReservationStatus.PENDING
  }
}

