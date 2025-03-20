export interface TicketResponse {
    id: number
    ticketNumber: string
    reservationId: number
    clientName: string
    vehicleImmatriculation: string
    placeId: number
    placeNumber: number
    parkingName: string
    issueDate: string
    startDate: string
    endDate: string
    price: number
    durationHours: number
    isUsed: boolean
    accessCode: string
  }
  
  export enum TicketStatus {
    ACTIVE = "ACTIVE",
    USED = "USED",
    EXPIRED = "EXPIRED",
  }
  