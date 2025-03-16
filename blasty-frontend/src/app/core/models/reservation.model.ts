import type { PlaceResponse } from "./place.model"
import { VehicleResponse } from "./vehicle.model"

export enum ReservationStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export interface ReservationRequest {
  clientId: string
  placeId: number
  vehicleId: number
  reservationDate: string // ISO string format
}

export interface ReservationResponse {
  id: number
  clientId: number
  clientName: string
  placeId: number
  placeNumber: string
  vehicleId: number
  vehiclePlateNumber: string
  parkingId: number
  parkingName: string
  status: ReservationStatus
  startDate: string // ISO string format
  endDate: string // ISO string format
  createdAt: string // ISO string format
  totalPrice: number
}

export interface ReservationDetails extends ReservationResponse {
  place?: PlaceResponse
  vehicle?: VehicleResponse
}

