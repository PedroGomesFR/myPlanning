import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../css/AppleDesign.css';
import '../css/MapView.css';

// Fix for default Leaflet icon issues in React
const icon = new URL('../../assets/marker-icon.png', import.meta.url).href;
const iconShadow = new URL('../../assets/marker-shadow.png', import.meta.url).href;

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Component to recenter map when user location changes
function ChangeView({ center }) {
    const map = useMap();
    map.setView(center);
    return null;
}

function MapView() {
    const navigate = useNavigate();
    const [professionals, setProfessionals] = useState([]);
    const [selectedPro, setSelectedPro] = useState(null);
    const [userLocation, setUserLocation] = useState({ lat: 48.8566, lng: 2.3522 }); // Default Paris
    const [filterCategory, setFilterCategory] = useState('all');

    useEffect(() => {
        loadProfessionals();
        getUserLocation();
    }, []);

    const loadProfessionals = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/records/professionals');
            if (response.ok) {
                const data = await response.json();
                // Filter pros with location
                const prosWithLocation = data.filter(p => p.latitude && p.longitude);
                setProfessionals(prosWithLocation);
            }
        } catch (error) {
            console.error('Error loading professionals:', error);
        }
    };

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.log('Geolocation error, using default:', error);
                }
            );
        }
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const renderStars = (rating) => {
        return (
            <div className="rating-stars-mini">
                {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} className={`star ${star <= Math.round(rating) ? 'filled' : ''}`}>⭐</span>
                ))}
            </div>
        );
    };

    const filteredProfessionals = professionals.filter(pro => {
        if (filterCategory === 'all') return true;
        return pro.profession === filterCategory;
    });

    const categories = [...new Set(professionals.map(p => p.profession))].filter(Boolean);

    return (
        <div className="map-view-page">
            {/* Sidebar */}
            <div className="map-sidebar">
                <div className="sidebar-header">
                    <h2>📍 Carte des Professionnels</h2>
                    <p className="text-secondary">
                        {filteredProfessionals.length} salon{filteredProfessionals.length > 1 ? 's' : ''} à proximité
                    </p>
                </div>

                {/* Filters */}
                <div className="category-filters">
                    <button
                        className={`filter-chip ${filterCategory === 'all' ? 'active' : ''}`}
                        onClick={() => setFilterCategory('all')}
                    >
                        Tous
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`filter-chip ${filterCategory === cat ? 'active' : ''}`}
                            onClick={() => setFilterCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="professionals-list">
                    {filteredProfessionals.map(pro => {
                        const distance = userLocation
                            ? calculateDistance(userLocation.lat, userLocation.lng, pro.latitude, pro.longitude)
                            : null;

                        return (
                            <div
                                key={pro._id}
                                className={`pro-card ${selectedPro?._id === pro._id ? 'selected' : ''}`}
                                onClick={() => setSelectedPro(pro)}
                            >
                                <div className="pro-photo">
                                    {pro.profilePhoto ? (
                                        <img src={`http://localhost:5001${pro.profilePhoto}`} alt={pro.companyName} />
                                    ) : (
                                        <div className="photo-placeholder">🏢</div>
                                    )}
                                </div>

                                <div className="pro-info">
                                    <h3>{pro.companyName || `${pro.prenom} ${pro.nom}`}</h3>
                                    <p className="pro-profession">{pro.profession}</p>

                                    {pro.averageRating > 0 && (
                                        <div className="pro-rating">
                                            {renderStars(pro.averageRating)}
                                            <span className="rating-value">{pro.averageRating.toFixed(1)}</span>
                                        </div>
                                    )}

                                    <div className="pro-meta">
                                        {distance && (
                                            <span className="meta-item">📍 {distance.toFixed(1)} km</span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/professional/${pro._id}`);
                                    }}
                                >
                                    Voir
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Map */}
            <div className="map-container">
                <MapContainer
                    center={[userLocation.lat, userLocation.lng]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <ChangeView center={[userLocation.lat, userLocation.lng]} />

                    {/* User Marker */}
                    <Marker position={[userLocation.lat, userLocation.lng]}>
                        <Popup>
                            <b>Vous êtes ici</b>
                        </Popup>
                    </Marker>

                    {/* Professionals Markers */}
                    {filteredProfessionals.map(pro => (
                        <Marker
                            key={pro._id}
                            position={[pro.latitude, pro.longitude]}
                            eventHandlers={{
                                click: () => {
                                    setSelectedPro(pro);
                                },
                            }}
                        >
                            <Popup>
                                <div style={{ width: '200px' }}>
                                    <h3 style={{ margin: '0 0 5px', fontSize: '14px' }}>{pro.companyName}</h3>
                                    <p style={{ margin: '0 0 5px', fontSize: '12px', color: '#666' }}>{pro.profession}</p>
                                    <button
                                        onClick={() => navigate(`/professional/${pro._id}`)}
                                        style={{
                                            background: 'var(--primary)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '5px 10px',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            fontSize: '12px',
                                            width: '100%'
                                        }}
                                    >
                                        Voir le profil
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {selectedPro && (
                    <div className="selected-pro-overlay card" style={{
                        position: 'absolute',
                        bottom: '20px',
                        right: '20px',
                        left: '20px',
                        maxWidth: '400px',
                        margin: '0 auto',
                        zIndex: 1000, // Above map
                        padding: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        animation: 'slideUp 0.3s ease-out'
                    }}>
                        <div style={{
                            width: '60px', height: '60px', borderRadius: '50%', background: '#eee', overflow: 'hidden', flexShrink: 0
                        }}>
                            {selectedPro.profilePhoto ? (
                                <img src={`http://localhost:5001${selectedPro.profilePhoto}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🏢</div>
                            )}
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: 0, fontSize: '16px' }}>{selectedPro.companyName}</h3>
                            <p style={{ margin: '2px 0', fontSize: '13px', color: '#666' }}>{selectedPro.address}</p>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                                <button className="btn btn-primary btn-sm" onClick={() => navigate(`/professional/${selectedPro._id}`)}>Voir profil</button>
                                <button className="btn btn-outline btn-sm" onClick={() => setSelectedPro(null)}>Fermer</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MapView;
