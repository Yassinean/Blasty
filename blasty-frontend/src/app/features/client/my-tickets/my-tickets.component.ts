import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { AuthService } from "../../../core/services/auth.service"
import { ToastService } from "../../../core/services/toast.service"
import { TicketResponse, TicketStatus } from "../../../core/models/ticket.model"
import { TicketService } from "../../../core/services/ticket.service"

@Component({
  selector: "app-my-tickets",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./my-tickets.component.html",
})
export class MyTicketsComponent implements OnInit {
  tickets: TicketResponse[] = []
  filteredTickets: TicketResponse[] = []
  isLoading = false
  searchTerm = ""
  filterStatus = ""

  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadTickets()
  }

  loadTickets(): void {
    this.isLoading = true
    const currentUser = this.authService.getCurrentUser()

    if (!currentUser || !currentUser.id) {
      this.toastService.showToast("error", "Utilisateur non authentifié")
      this.isLoading = false
      return
    }

    this.ticketService.getMyTickets(currentUser.id).subscribe({
      next: (data) => {
        this.tickets = data
        this.filterTickets()
        this.isLoading = false
      },
      error: (error) => {
        this.toastService.showToast("error", "Erreur lors du chargement des tickets")
        console.error("Error loading tickets:", error)
        this.isLoading = false
      },
    })
  }

  filterTickets(): void {
    let filtered = [...this.tickets]

    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase()
      filtered = filtered.filter(
        (ticket) =>
          ticket.ticketNumber.toLowerCase().includes(search) ||
          ticket.parkingName.toLowerCase().includes(search) ||
          ticket.clientName.toLowerCase().includes(search),
      )
    }

    if (this.filterStatus) {
      filtered = filtered.filter((ticket) => this.getTicketStatus(ticket) === this.filterStatus)
    }

    this.filteredTickets = filtered
  }

  getTicketStatus(ticket: TicketResponse): string {
    return this.ticketService.getTicketStatus(ticket)
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

  refreshData(): void {
    this.loadTickets()
  }
}

