export enum VehicleType {
  VOITURE = "VOITURE",
  MOTO = "MOTO",
  CAMION = "CAMIONNETTE",
}

export interface VehicleRequest {
  immatriculation: string
  type: VehicleType
  clientId: number
}

export interface VehicleResponse {
  id: number
  immatriculation: string
  type: VehicleType
  clientId: number
}

