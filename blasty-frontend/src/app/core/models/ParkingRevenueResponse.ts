export interface ParkingRevenueResponse {
  parkingId: number;
  parkingName: string;
  totalRevenue: number;
  period: Period;
}

enum Period {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
}
