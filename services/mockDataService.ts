import { ParkingSpot } from '../types';

// Orleans center coordinates
const CENTER_LAT = 47.9029;
const CENTER_LNG = 1.9093;

const generateRandomSpot = (id: number): ParkingSpot => {
  // Random offset to create spots around the center
  const latOffset = (Math.random() - 0.5) * 0.02;
  const lngOffset = (Math.random() - 0.5) * 0.03;
  
  const statusRoll = Math.random();
  let status: 'available' | 'occupied' | 'reserved' = 'occupied';
  
  if (statusRoll > 0.6) status = 'available';
  else if (statusRoll > 0.9) status = 'reserved';

  return {
    id: `spot-${id}`,
    lat: CENTER_LAT + latOffset,
    lng: CENTER_LNG + lngOffset,
    status: status,
    address: `Rue simulée ${id}, 45000 Orléans`,
    probability: Math.floor(Math.random() * 100),
    lastUpdated: new Date()
  };
};

export const generateInitialSpots = (count: number = 50): ParkingSpot[] => {
  return Array.from({ length: count }, (_, i) => generateRandomSpot(i + 1));
};

export const updateSpotStatuses = (currentSpots: ParkingSpot[]): ParkingSpot[] => {
  return currentSpots.map(spot => {
    // 10% chance to change status per update
    if (Math.random() > 0.9) {
       const statusRoll = Math.random();
       let newStatus: 'available' | 'occupied' | 'reserved' = 'occupied';
       if (statusRoll > 0.6) newStatus = 'available';
       
       return {
         ...spot,
         status: newStatus,
         lastUpdated: new Date(),
         probability: Math.floor(Math.random() * 100)
       };
    }
    return spot;
  });
};