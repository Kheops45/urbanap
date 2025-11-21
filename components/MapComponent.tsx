import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { ParkingSpot } from '../types';
import L from 'leaflet';

// Fix Leaflet default icon issue using CDN URLs instead of local imports
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: iconUrl,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons for status
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="
      background-color: ${color};
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 10px ${color};
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -10]
  });
};

const greenIcon = createCustomIcon('#4ade80'); // Tailwind green-400
const redIcon = createCustomIcon('#f87171');   // Tailwind red-400
const blueIcon = createCustomIcon('#60a5fa');  // Tailwind blue-400

interface MapComponentProps {
  spots: ParkingSpot[];
}

const MapComponent: React.FC<MapComponentProps> = ({ spots }) => {
  const center: [number, number] = [47.9029, 1.9093]; // Orléans

  return (
    <MapContainer center={center} zoom={14} scrollWheelZoom={true} className="w-full h-full rounded-xl z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {spots.map((spot) => (
        <Marker 
          key={spot.id} 
          position={[spot.lat, spot.lng]}
          icon={
            spot.status === 'available' ? greenIcon :
            spot.status === 'occupied' ? redIcon : blueIcon
          }
        >
          <Popup className="glass-popup">
            <div className="p-1 text-slate-800">
              <h3 className="font-bold text-sm">{spot.address}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full text-white ${
                  spot.status === 'available' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {spot.status === 'available' ? 'Libre' : 'Occupé'}
                </span>
                {spot.status === 'occupied' && (
                  <span className="text-xs text-slate-500">
                    Dispo probable: {spot.probability}%
                  </span>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;