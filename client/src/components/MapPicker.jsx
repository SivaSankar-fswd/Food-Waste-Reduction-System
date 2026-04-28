import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapPicker.css';

// Fix for default marker icon in Leaflet + React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ position, setPosition, setAddress }) {
    const map = useMap();

    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);
            reverseGeocode(lat, lng, setAddress);
        },
    });

    useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom());
        }
    }, [position, map]);

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

const reverseGeocode = async (lat, lng, setAddress) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=en`);
        const data = await response.json();
        if (data && data.display_name) {
            setAddress(data.display_name);
        }
    } catch (error) {
        console.error("Geocoding error:", error);
    }
};

function MapPicker({ onLocationSelect, initialAddress }) {
    const [position, setPosition] = useState([20.5937, 78.9629]); // Default to India
    const [address, setAddress] = useState(initialAddress || "");
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searching, setSearching] = useState(false);

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setPosition([latitude, longitude]);
                reverseGeocode(latitude, longitude, (addr) => {
                    setAddress(addr);
                    setLoading(false);
                });
            },
            (err) => {
                console.warn("Geolocation error:", err);
                alert("Failed to get your location. Please check permissions.");
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    };

    useEffect(() => {
        getCurrentLocation();
    }, []);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setSearching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&accept-language=en`);
            const data = await response.json();
            if (data && data.length > 0) {
                const { lat, lon, display_name } = data[0];
                const newPos = [parseFloat(lat), parseFloat(lon)];
                setPosition(newPos);
                setAddress(display_name);
            } else {
                alert("Location not found. Try being more specific.");
            }
        } catch (error) {
            console.error("Search error:", error);
            alert("Search failed. Please try again.");
        } finally {
            setSearching(false);
        }
    };

    const handleConfirm = () => {
        onLocationSelect(address, position);
    };

    return (
        <div className="map-picker-container">
            <div className="map-search-info">
                <div className="map-search-bar">
                    <input 
                        style={{ color: "black" }}
                        type="text" 
                        placeholder="Search for a location..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSearch();
                            }
                        }}
                        disabled={searching}
                    />
                    <button type="button" onClick={handleSearch} disabled={searching}>
                        {searching ? "..." : "🔍"}
                    </button>
                </div>

                <div className="address-and-gps">
                    <p className="selected-address">
                        {loading ? "Detecting location..." : (address || "Select a location above or click on map...")}
                    </p>
                    <button type="button" className="gps-btn" onClick={getCurrentLocation} title="Use GPS" disabled={loading}>
                        {loading ? "⌛" : "🎯"}
                    </button>
                </div>
            </div>
            <div className="map-wrapper">
                <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: '300px', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker position={position} setPosition={setPosition} setAddress={setAddress} />
                </MapContainer>
            </div>
            <button type="button" className="confirm-loc-btn" onClick={handleConfirm}>
                Confirm Location
            </button>
        </div>
    );
}

export default MapPicker;
