export interface ParkingOccupancyResponse {
  parkingId: number;
  parkingName: string;
  capacity: number;
  occupiedSpaces: number;
  availableSpaces: number;
}