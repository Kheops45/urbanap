export interface ParkingSpot {
  id: string;
  lat: number;
  lng: number;
  status: 'available' | 'occupied' | 'reserved';
  address: string;
  probability: number; // Probability of becoming free in next 15 mins (mock ML)
  lastUpdated: Date;
}

export interface ParkingStats {
  total: number;
  available: number;
  occupied: number;
  occupancyRate: number;
}

export interface MapViewport {
  center: [number, number];
  zoom: number;
}

export enum ViewMode {
  MAP = 'MAP',
  LIST = 'LIST',
  ANALYTICS = 'ANALYTICS'
}