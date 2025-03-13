export enum ParkingStatus {
  OPEN = 'OPEN',
  MAINTENANCE = 'MAINTENANCE',
  CLOSED = 'CLOSED'
}

export interface Parking {
  id?: number;
  name: string;
  address: string;
  capacity: number;
  width: number;
  length: number;
  status: ParkingStatus;
  occupiedSpaces?: number;
}

export interface ParkingRequest {
  name: string;
  address: string;
  capacity: number;
  width: number;
  length: number;
  status: ParkingStatus;
}

export interface ParkingResponse {
  id: number;
  name: string;
  address: string;
  capacity: number;
  width: number;
  length: number;
  status: ParkingStatus;
  occupiedSpaces: number;
}

export interface ParkingOccupancyResponse {
  parkingId: number;
  parkingName: string;
  totalCapacity: number;
  occupiedSpaces: number;
  occupancyRate: number;
}

export interface ParkingRevenueResponse {
  parkingId: number;
  parkingName: string;
  totalRevenue: number;
  period: string;
}