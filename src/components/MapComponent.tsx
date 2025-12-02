import React, { useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { PostcodeFeatureCollection } from '../services/arcgis';
import L from 'leaflet';

// Fix for default marker icon in Leaflet with Webpack/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
    data: PostcodeFeatureCollection | null;
}

const MapUpdater: React.FC<{ data: PostcodeFeatureCollection | null }> = ({ data }) => {
    const map = useMap();

    useEffect(() => {
        if (data && data.features.length > 0) {
            const geoJsonLayer = L.geoJSON(data);
            map.fitBounds(geoJsonLayer.getBounds());
        }
    }, [data, map]);

    return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ data }) => {
    const victoriaCenter: [number, number] = [-37.8136, 144.9631]; // Melbourne

    return (
        <MapContainer center={victoriaCenter} zoom={8} className="h-full w-full rounded-lg shadow-md z-0">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {data && (
                <GeoJSON
                    key={JSON.stringify(data)} // Force re-render when data changes
                    data={data}
                    style={() => ({
                        color: '#2563eb',
                        weight: 2,
                        opacity: 1,
                        fillColor: '#3b82f6',
                        fillOpacity: 0.3
                    })}
                    onEachFeature={(feature, layer) => {
                        if (feature.properties && feature.properties.postcode) {
                            layer.bindPopup(`Postcode: ${feature.properties.postcode}`);
                        }
                    }}
                />
            )}
            <MapUpdater data={data} />
        </MapContainer>
    );
};

export default MapComponent;
