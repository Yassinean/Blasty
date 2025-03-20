import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { ReservationRequest, ReservationResponse } from "../models/reservation.model"
import { environment } from "../../environment/environment"

@Injectable({
  providedIn: "root",
})
export class ReservationService {
  private apiUrl = `${environment.apiURL}`

  constructor(private http: HttpClient) {}

  // Create a new reservation
  createReservation(reservation: ReservationRequest): Observable<ReservationResponse> {
    return this.http.post<ReservationResponse>(`${this.apiUrl}/reservations`, reservation)
  }

  // Get all reservations (admin only)
  getAllReservations(): Observable<ReservationResponse[]> {
    return this.http.get<ReservationResponse[]>(`${this.apiUrl}/reservations`)
  }

  // Get a specific reservation by ID
  getReservationById(id: number): Observable<ReservationResponse> {
    return this.http.get<ReservationResponse>(`${this.apiUrl}/reservations/${id}`)
  }

  // Get all reservations for the current client
  getMyReservations(): Observable<ReservationResponse[]> {
    return this.http.get<ReservationResponse[]>(`${this.apiUrl}/reservations/my-reservations`)
  }

  // Cancel a reservation
  cancelReservation(id: number): Observable<ReservationResponse> {
    return this.http.put<ReservationResponse>(`${this.apiUrl}/reservations/${id}/cancel`, {})
  }

  // Confirm a reservation (admin only)
  confirmReservation(id: number): Observable<ReservationResponse> {
    return this.http.put<ReservationResponse>(`${this.apiUrl}/reservations/${id}/confirm`, {})
  }

  // Complete a reservation (admin only)
  completeReservation(id: number): Observable<ReservationResponse> {
    return this.http.put<ReservationResponse>(`${this.apiUrl}/reservations/${id}/complete`, {})
  }

  // Delete a reservation (admin only)
  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reservations/${id}`)
  }
}

