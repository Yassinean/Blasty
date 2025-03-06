export interface Place {
  id: number;
  type: TypePlace;
  tarifHoraire: number;
  parkingId: number;
  isOccupied?: boolean;
}

export enum TypePlace {
  STANDARD = 'STANDARD',
  VIP = 'VIP',
  HANDICAPE = 'HANDICAPE',
}