import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { getEnglishLocation } from '../utils/locationHelper';


let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function FoodMap({ foods }) {
    // Filter foods that have coordinates
    const mapFoods = foods.filter(f => f.latitude && f.longitude);

    if (mapFoods.length === 0) {
        return <div className="no-results">No location data available for these donations.</div>;
    }

    const center = [mapFoods[0].latitude, mapFoods[0].longitude];

    return (
        <div className="food-map-container" style={{ height: '500px', width: '100%', borderRadius: '12px', overflow: 'hidden', marginTop: '20px', border: '2px solid #eee' }}>
            <MapContainer center={center} zoom={12} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {mapFoods.map(food => (
                    <Marker key={food.id} position={[food.latitude, food.longitude]}>
                        <Popup>
                            <div style={{ padding: '5px' }}>
                                <h6 style={{ margin: '0 0 5px 0' }}>{food.food_name}</h6>
                                <p style={{ margin: '0', fontSize: '0.8rem' }}><b>Qty:</b> {food.quantity}</p>
                                <p style={{ margin: '0', fontSize: '0.8rem' }}><b>Loc:</b> {getEnglishLocation(food.location)}</p>
                                <button 
                                    style={{ marginTop: '10px', background: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                                    onClick={() => window.location.href = `tel:${food.contact}`}
                                >
                                    Call Donor
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}

export default FoodMap;
