export interface Parking {
  id: number;
  name: string;
  address: string;
  capacity: number;
  availablePlaces?: number; // Nombre de places disponibles
  occupiedSpaces?: number; // Nombre de places occupées
  status?: 'OPEN' | 'CLOSED' | 'MAINTENANCE'; // Statut du parking
  latitude?: number; // Latitude pour la localisation
  longitude?: number; // Longitude pour la localisation
}