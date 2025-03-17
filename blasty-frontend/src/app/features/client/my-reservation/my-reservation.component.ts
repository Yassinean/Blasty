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
        this.reservations = data
        this.isLoading = false
      },
      error: (error) => {
        this.toastService.showError('error',"Erreur lors du chargement des réservations")
        console.error("Error loading reservations:", error)
        this.isLoading = false
      },
    })
    console.log('reesrvartion:',this.reservations);
    
  }

  cancelReservation(id: number): void {
    if (confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
      this.cancellingReservation = id
      this.reservationService.cancelReservation(id).subscribe({
        next: () => {
          this.toastService.showSuccess('success',"Réservation annulée avec succès")
          this.loadReservations()
          this.cancellingReservation = null
        },
        error: (error) => {
          this.toastService.showError('error',"Erreur lors de l'annulation de la réservation")
          console.error("Error cancelling reservation:", error)
          this.cancellingReservation = null
        },
      })
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

  formatDate(dateString: string): string {
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
    return reservation.status === ReservationStatus.PENDING || reservation.status === ReservationStatus.CONFIRMED
  }
}

