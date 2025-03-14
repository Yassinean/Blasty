export interface ParkingRevenueResponse {
  parkingId: number;
  parkingName: string;
  totalRevenue: number;
  period: Period;
}

enum Period {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}
