import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { TicketService } from "../../../core/services/ticket.service"
import { ToastService } from "../../../core/services/toast.service"
import { TicketResponse, TicketStatus } from "../../../core/models/ticket.model"

@Component({
  selector: "app-ticket-detail",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./ticket-detail.component.html",
})
export class TicketDetailComponent implements OnInit {
  ticket: TicketResponse | null = null
  isLoading = false
  processingAction = false
  ticketId: number | null = null

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id")
      if (id) {
        this.ticketId = +id
        this.loadTicket()
      } else {
        this.toastService.showToast("error", "ID de ticket non trouvé")
        this.goBackToTickets()
      }
    })
  }

  loadTicket(): void {
    if (!this.ticketId) return

    this.isLoading = true
    this.ticketService.getTicketById(this.ticketId).subscribe({
      next: (data) => {
        this.ticket = data
        this.isLoading = false
      },
      error: (error) => {
        this.toastService.showToast("error", "Erreur lors du chargement du ticket")
        console.error("Error loading ticket:", error)
        this.isLoading = false
        this.goBackToTickets()
      },
    })
  }

  validateTicket(): void {
    if (!this.ticket) return

    this.processingAction = true
    this.ticketService.validateTicket(this.ticket.ticketNumber).subscribe({
      next: (data) => {
        this.ticket = data
        this.toastService.showToast("success", "Ticket validé avec succès")
        this.processingAction = false
      },
      error: (error) => {
        this.toastService.showToast("error", error.error.message)
        console.error("Error validating ticket:", error)
        this.processingAction = false
      },
    })
  }

  deleteTicket(id:number){
    this.ticketService.deleteTicket(id).subscribe({
      next:() => {
        this.toastService.showToast('success', 'Ticket supprimé avec succès');
        this.loadTicket();
      },
      error: (error) => {
        console.error('Error deleting ticket:', error);
        this.toastService.showToast('error', 'Erreur lors de la suppression du ticket');
      },
    })
  }

  markAsUsed(): void {
    if (!this.ticket) return

    if (confirm("Êtes-vous sûr de vouloir marquer ce ticket comme utilisé ? Cette action est irréversible.")) {
      this.processingAction = true
      this.ticketService.markTicketAsUsed(this.ticket.ticketNumber).subscribe({
        next: () => {
          if (this.ticket) {
            this.ticket.isUsed = true
          }
          this.toastService.showToast("success", "Ticket marqué comme utilisé")
          this.processingAction = false
        },
        error: (error) => {
          this.toastService.showToast("error", "Erreur lors du marquage du ticket")
          console.error("Error marking ticket as used:", error)
          this.processingAction = false
        },
      })
    }
  }

  getTicketStatus(): string {
    if (!this.ticket) return ""
    return this.ticketService.getTicketStatus(this.ticket)
  }

  getStatusClass(status: string): string {
    switch (status) {
      case TicketStatus.ACTIVE:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case TicketStatus.USED:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case TicketStatus.EXPIRED:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case TicketStatus.ACTIVE:
        return "Actif"
      case TicketStatus.USED:
        return "Utilisé"
      case TicketStatus.EXPIRED:
        return "Expiré"
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

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "MAD" }).format(amount)
  }

  goBackToTickets(): void {
    this.router.navigate(["/client/dashboard/tickets"])
  }
}

