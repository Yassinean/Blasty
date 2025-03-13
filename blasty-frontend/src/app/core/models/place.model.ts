export interface Place {
  id?: number
  numero: string
  type: PlaceType
  tarifHoraire: number
  etat: PlaceStatus
  reservedUntil?: string
  parkingId?: number
}

export interface PlaceRequest {
  numero: string
  type: string
  tarifHoraire: number
}

export interface PlaceResponse {
  id: number
  numero: string
  type: string
  tarifHoraire: number
  etat: PlaceStatus
  reservedUntil?: string
  parkingId: number
  parkingName?: string
}

export enum PlaceStatus {
  DISPONIBLE = "DISPONIBLE",
  RESERVEE = "RESERVEE",
  OCCUPEE = "OCCUPEE",
}

export enum PlaceType {
  STANDARD = 'STANDARD',
  HANDICAP = 'HANDICAPE',
  VIP = 'VIP'
}

