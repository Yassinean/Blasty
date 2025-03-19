import { ParkingResponse } from "./parking.model";
import { PlaceResponse } from "./place.model";
import { VehicleResponse } from "./vehicle.model";

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export interface ReservationRequest {
  clientId: string;
  placeId: number;
  vehicleId: number;
  startDate: Date;
}

export interface ReservationResponse {
  id: number;
  clientId: number;
  clientName: string;
  placeId: number;
  placeNumber: string;
  vehicleId: number;
  vehicleImmatriculation: string;
  parkingId: number;
  parkingName: string;
  status: ReservationStatus;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  tarif: number;
}

export interface ReservationDetails extends ReservationResponse {
  place?: PlaceResponse;
  vehicle?: VehicleResponse;
  parking?: ParkingResponse;
}
