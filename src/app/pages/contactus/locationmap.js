// // components/LocationMap.js
// import React from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
// import L from 'leaflet';
// import 'leaflet-defaulticon-compatibility';

// const LocationMap = () => {
//   const center = [32.582520, 73.484340]; // Coordinates for Mandi Bahauddin

//   return (
//     <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg border">
//       <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
//         {/* OpenStreetMap Tiles */}
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />

//         {/* Marker */}
//         <Marker position={center}>
//           <Popup>
//             <strong>AUTOPARTS</strong><br />
//             Pakistan, Mandi Bahauddin.
//           </Popup>
//         </Marker>
//       </MapContainer>
//     </div>
//   );
// };

// export default LocationMap;
