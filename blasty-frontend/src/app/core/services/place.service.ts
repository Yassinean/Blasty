import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, catchError, of } from "rxjs";
import { PlaceRequest, PlaceResponse } from "../models/place.model";
import { Parking } from "../models/parking.model";
import { environment } from "../../environment/environment";

@Injectable({
  providedIn: "root",
})
export class PlaceService {
  private apiUrl = `${environment.apiURL}`;

  constructor(private http: HttpClient) {}

  // Admin endpoints
  createPlace(parkingId: number, place: PlaceRequest): Observable<PlaceResponse> {
    return this.http
      .post<PlaceResponse>(`${this.apiUrl}/parkings/${parkingId}/places`, place)
      .pipe(catchError(this.handleError<PlaceResponse>("createPlace")));
  }

  updatePlace(id: number, place: PlaceRequest): Observable<PlaceResponse> {
    return this.http
      .put<PlaceResponse>(`${this.apiUrl}/places/${id}`, place)
      .pipe(catchError(this.handleError<PlaceResponse>("updatePlace")));
  }

  deletePlace(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/places/${id}`)
      .pipe(catchError(this.handleError<void>("deletePlace")));
  }

  getPlacesByParkingId(parkingId: number): Observable<PlaceResponse[]> {
    console.log(`Fetching places for parking ID: ${parkingId}`)
    return this.http.get<PlaceResponse[]>(`${this.apiUrl}/parkings/${parkingId}/places`)
  }

  getPlacesByParking(parking: Parking): Observable<PlaceResponse[]> {
    if (!parking || !parking.id) {
      throw new Error("Invalid parking object")
    }
    return this.getPlacesByParkingId(parking.id)
  }

  // Client accessible endpoints
  getPlaceById(id: number): Observable<PlaceResponse> {
    return this.http
      .get<PlaceResponse>(`${this.apiUrl}/places/${id}`)
      .pipe(catchError(this.handleError<PlaceResponse>("getPlaceById")));
  }

  getAllPlaces(): Observable<PlaceResponse[]> {
    return this.http
      .get<PlaceResponse[]>(`${this.apiUrl}/places`)
      .pipe(catchError(this.handleError<PlaceResponse[]>("getAllPlaces")));
  }

  // Availability check endpoints
  checkPlaceAvailability(id: number): Observable<boolean> {
    return this.http
      .get<boolean>(`${this.apiUrl}/places/${id}/availability`)
      .pipe(catchError(this.handleError<boolean>("checkPlaceAvailability")));
  }

  checkPlaceAvailabilityAtTime(id: number, dateTime: string): Observable<boolean> {
    const params = new HttpParams().set("dateTime", dateTime);
    return this.http
      .get<boolean>(`${this.apiUrl}/places/${id}/availability-at`, { params })
      .pipe(catchError(this.handleError<boolean>("checkPlaceAvailabilityAtTime")));
  }

  // Additional methods to match the backend functionality
  reservePlace(placeId: number, reservedUntil: string): Observable<PlaceResponse> {
    return this.http
      .post<PlaceResponse>(`${this.apiUrl}/places/${placeId}/reserve`, { reservedUntil })
      .pipe(catchError(this.handleError<PlaceResponse>("reservePlace")));
  }

  // Generic error handler
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }
}