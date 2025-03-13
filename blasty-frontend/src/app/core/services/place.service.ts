import { Injectable } from "@angular/core"
import { HttpClient, HttpParams } from "@angular/common/http"
import { Observable } from "rxjs"
import { PlaceRequest, PlaceResponse } from "../models/place.model"
import { Parking } from "../models/parking.model";

@Injectable({
  providedIn: "root",
})
export class PlaceService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Admin endpoints
  createPlace(parkingId: number, place: PlaceRequest): Observable<PlaceResponse> {
    return this.http.post<PlaceResponse>(`${this.apiUrl}/parkings/${parkingId}/places`, place)
  }

  updatePlace(id: number, place: PlaceRequest): Observable<PlaceResponse> {
    return this.http.put<PlaceResponse>(`${this.apiUrl}/places/${id}`, place)
  }

  deletePlace(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/places/${id}`)
  }

  getPlacesByParking(parking: Parking): Observable<PlaceResponse[]> {
    return this.http.get<PlaceResponse[]>(`${this.apiUrl}parkings/${parking.id}/places`)
  }

  // Client accessible endpoints
  getPlaceById(id: number): Observable<PlaceResponse> {
    return this.http.get<PlaceResponse>(`${this.apiUrl}/places/${id}`)
  }

  getAllPlaces(): Observable<PlaceResponse[]> {
    return this.http.get<PlaceResponse[]>(`${this.apiUrl}/places`)
  }

  // Availability check endpoints
  checkPlaceAvailability(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/places/${id}/availability`)
  }

  checkPlaceAvailabilityAtTime(id: number, dateTime: string): Observable<boolean> {
    const params = new HttpParams().set("dateTime", dateTime)
    return this.http.get<boolean>(`${this.apiUrl}/places/${id}/availability-at`, { params })
  }

  // Additional methods to match the backend functionality
  reservePlace(placeId: number, reservedUntil: string): Observable<PlaceResponse> {
    // This endpoint is not shown in the controller, but implied by the service
    return this.http.post<PlaceResponse>(`${this.apiUrl}/places/${placeId}/reserve`, { reservedUntil })
  }

  occupyPlace(placeId: number): Observable<PlaceResponse> {
    // This endpoint is not shown in the controller, but implied by the service
    return this.http.post<PlaceResponse>(`${this.apiUrl}/places/${placeId}/occupy`, {})
  }

  freePlace(placeId: number): Observable<PlaceResponse> {
    // This endpoint is not shown in the controller, but implied by the service
    return this.http.post<PlaceResponse>(`${this.apiUrl}/places/${placeId}/free`, {})
  }
}

