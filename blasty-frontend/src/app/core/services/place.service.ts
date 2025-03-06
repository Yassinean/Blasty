import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Place } from '../models/place.model';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  private baseUrl = 'http://localhost:8080/api/places';

  constructor(private http:HttpClient) { }

  getAllPlaces(): Observable<Place[]>{
    return this.http.get<Place[]>(this.baseUrl);
  }

  getPlaceById(id:number):Observable<Place>{
    return this.http.get<Place>(`${this.baseUrl}/${id}`);
  }

  createPlace(place:Place):Observable<Place>{
    return this.http.post<Place>(this.baseUrl, place);
  }

  updatePlace(id:number, place:Place):Observable<Place>{
    return this.http.put<Place>(`${this.baseUrl}/${id}`, place);
  }

  deletePlace(id:number):Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
