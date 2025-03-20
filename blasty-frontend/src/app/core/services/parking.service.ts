import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Parking, 
  ParkingRequest, 
  ParkingResponse, 
  ParkingOccupancyResponse, 
  ParkingRevenueResponse 
} from '../models/parking.model';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {
  private baseUrl = `${environment.apiURL}/parkings`;

  constructor(private http: HttpClient) { }

  // Admin endpoints
  createParking(request: ParkingRequest): Observable<ParkingResponse> {
    return this.http.post<ParkingResponse>(this.baseUrl, request);
  }

  updateParking(id: number, request: ParkingRequest): Observable<ParkingResponse> {
    return this.http.put<ParkingResponse>(`${this.baseUrl}/${id}`, request);
  }

  deleteParking(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getParkingOccupancy(id: number): Observable<ParkingOccupancyResponse> {
    return this.http.get<ParkingOccupancyResponse>(`${this.baseUrl}/parkings/${id}/occupancy`)
  }

  // Get occupancy data for all parkings
  getAllParkingsOccupancy(): Observable<ParkingOccupancyResponse[]> {
    return this.http.get<ParkingOccupancyResponse[]>(`${this.baseUrl}/occupancy`)
  }

  // Get revenue data for a specific parking
  getParkingRevenue(id: number, period:string = "month"): Observable<ParkingRevenueResponse> {
    return this.http.get<ParkingRevenueResponse>(`${this.baseUrl}/${id}/revenue?period=${period}`)
  }

  // Get revenue data for all parkings
  getAllParkingsRevenue(period = "month"): Observable<ParkingRevenueResponse[]> {
    return this.http.get<ParkingRevenueResponse[]>(`${this.baseUrl}/revenue?period=${period}`)
  }

  getParkingById(id: number): Observable<ParkingResponse> {
    return this.http.get<ParkingResponse>(`${this.baseUrl}/${id}`);
  }

  getAllParkings(): Observable<ParkingResponse[]> {
    return this.http.get<ParkingResponse[]>(this.baseUrl);
  }

  getAvailablePlaces(id: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/${id}/available-places`);
  }
}