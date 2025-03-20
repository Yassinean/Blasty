import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import type { TicketResponse } from "../models/ticket.model"

@Injectable({
  providedIn: "root",
})
export class TicketService {
  private apiUrl = "http://localhost:8080/api"

  constructor(private http: HttpClient) {}

  // Generate a ticket for a reservation
  generateTicket(reservationId: number): Observable<TicketResponse> {
    return this.http.post<TicketResponse>(`${this.apiUrl}/tickets/generate/${reservationId}`, {})
  }

  // Get a ticket by ID
  getTicketById(id: number): Observable<TicketResponse> {
    return this.http.get<TicketResponse>(`${this.apiUrl}/tickets/${id}`)
  }

  // Get a ticket by ticket number
  getTicketByNumber(ticketNumber: string): Observable<TicketResponse> {
    return this.http.get<TicketResponse>(`${this.apiUrl}/tickets/number/${ticketNumber}`)
  }

  // Get all tickets for the current client
  getMyTickets(clientId: string): Observable<TicketResponse[]> {
    return this.http.get<TicketResponse[]>(`${this.apiUrl}/tickets/client/${clientId}`)
  }

  // Validate a ticket
  validateTicket(ticketNumber: string): Observable<TicketResponse> {
    return this.http.post<TicketResponse>(`${this.apiUrl}/tickets/validate/${ticketNumber}`, {})
  }

  // Mark a ticket as used
  markTicketAsUsed(ticketNumber: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/tickets/use/${ticketNumber}`, {})
  }

  // Helper method to determine ticket status
  getTicketStatus(ticket: TicketResponse): string {
    if (ticket.isUsed) {
      return "USED"
    }

    const now = new Date()
    const endDate = new Date(ticket.endDate)

    if (endDate < now) {
      return "EXPIRED"
    }

    return "ACTIVE"
  }
}

