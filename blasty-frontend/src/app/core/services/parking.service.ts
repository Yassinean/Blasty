import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Parking } from '../models/parking.model';
import { ParkingOccupancyResponse } from '../models/ParkingOccupancyResponse';
import { ParkingRevenueResponse } from '../models/ParkingRevenueResponse';

@Injectable({
  providedIn: 'root',
})
export class ParkingService {
  private baseUrl = 'http://localhost:8080/api/parkings';

  constructor(private http: HttpClient) {}

  getAllParkings(): Observable<Parking[]> {
    return this.http.get<Parking[]>(this.baseUrl);
  }

  getParkingById(id: number): Observable<Parking> {
    return this.http.get<Parking>(`${this.baseUrl}/${id}`);
  }

  createParking(parking: Parking): Observable<Parking> {
    return this.http.post<Parking>(this.baseUrl, parking);
  }

  updateParking(id: number, parking: Parking): Observable<Parking> {
    return this.http.put<Parking>(`${this.baseUrl}/${id}`, parking);
  }

  deleteParking(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Récupérer les places disponibles pour un parking
  getAvailablePlaces(id: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/${id}/available-places`);
  }

  // Récupérer l'occupation des parkings
  getParkingOccupancy(): Observable<ParkingOccupancyResponse[]> {
    return this.http.get<ParkingOccupancyResponse[]>(
      `${this.baseUrl}/occupancy`
    );
  }

  // Récupérer les revenus des parkings
  getParkingRevenue(
    period: string = 'month'
  ): Observable<ParkingRevenueResponse[]> {
    return this.http.get<ParkingRevenueResponse[]>(
      `${this.baseUrl}/revenue?period=${period}`
    );
  }
}
