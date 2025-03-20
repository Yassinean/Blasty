import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable, of } from "rxjs"
import { catchError } from "rxjs/operators"
import { VehicleRequest, VehicleResponse } from "../models/vehicle.model"
import { AuthService } from "./auth.service"
import { environment } from "../../environment/environment"

@Injectable({
  providedIn: "root",
})
export class VehicleService {
  private apiUrl = `${environment.apiURL}/vehicles`

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  // Get the current client's vehicle
  getMyVehicle(): Observable<VehicleResponse | null> {
    const currentUser = this.authService.getCurrentUser()
    if (!currentUser || !currentUser.id) {
      return of(null)
    }

    return this.http.get<VehicleResponse>(`${this.apiUrl}/${currentUser.id}`).pipe(
      catchError((error) => {
        // If 404, the user doesn't have a vehicle yet
        if (error.status === 404) {
          return of(null)
        }
        throw error
      }),
    )
  }

  // Create a vehicle for the current client
  createVehicle(vehicle: VehicleRequest): Observable<VehicleResponse> {
    const currentUser = this.authService.getCurrentUser()
    if (!currentUser || !currentUser.id) {
      throw new Error("User not authenticated")
    }

    return this.http.post<VehicleResponse>(`${this.apiUrl}/${currentUser.id}`, vehicle)
  }

  // Update the current client's vehicle
  updateVehicle(vehicle: VehicleRequest): Observable<VehicleResponse> {
    const currentUser = this.authService.getCurrentUser()
    if (!currentUser || !currentUser.id) {
      throw new Error("User not authenticated")
    }

    return this.http.put<VehicleResponse>(`${this.apiUrl}/${currentUser.id}`, vehicle)
  }

  // Delete the current client's vehicle
  deleteVehicle(): Observable<void> {
    const currentUser = this.authService.getCurrentUser()
    if (!currentUser || !currentUser.id) {
      throw new Error("User not authenticated")
    }

    return this.http.delete<void>(`${this.apiUrl}/${currentUser.id}`)
  }
}

