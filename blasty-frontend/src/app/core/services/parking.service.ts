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

@Injectable({
  providedIn: 'root'
})
export class ParkingService {
  private baseUrl = 'http://localhost:8080/api/parkings';

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

  getParkingOccupancy(): Observable<ParkingOccupancyResponse[]> {
    return this.http.get<ParkingOccupancyResponse[]>(`${this.baseUrl}/occupancy`);
  }

  getParkingRevenue(id:number ,period: string = 'month'): Observable<ParkingRevenueResponse[]> {
    const params = new HttpParams().set('period', period);
    return this.http.get<ParkingRevenueResponse[]>(`${this.baseUrl}/revenue`, { params });
  }

  // Client accessible endpoints
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