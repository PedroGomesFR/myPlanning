import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    IoGrid,
    IoCalendar,
    IoCut,
    IoStar,
    IoPerson,
    IoLogOut,
    IoBusiness,
    IoCall,
    IoLocation,
    IoTime,
    IoCamera
} from 'react-icons/io5';
import '../css/AppleDesign.css';
import DashboardOverview from './DashboardOverview';
import Planning from '../common/planning';
import ServiceManagement from '../pages/ServiceManagement';
import ReviewsPage from '../pages/ReviewsPage';

function ProfessionalDashboard({ user, setUser }) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [profileData, setProfileData] = useState({
        description: user?.description || '',
        address: user?.address || '',
        phone: user?.phone || '',
        openingHours: user?.openingHours || '',
        companyName: user?.companyName || '',
    });

    const menuItems = [
        { id: 'overview', label: 'Vue d\'ensemble', icon: <IoGrid size={18} /> },
        { id: 'planning', label: 'Planning', icon: <IoCalendar size={18} /> },
        { id: 'services', label: 'Prestations', icon: <IoCut size={18} /> },
        { id: 'reviews', label: 'Avis Clients', icon: <IoStar size={18} /> },
        { id: 'settings', label: 'Mon Profil', icon: <IoPerson size={18} /> },
    ];

    const deconnection = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = '/home';
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            // Geocoding logic
            let lat = null;
            let lon = null;

            if (profileData.address && profileData.address.length > 5) {
                try {
                    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(profileData.address)}&format=json&limit=1`);
                    const geoData = await geoRes.json();
                    if (geoData && geoData.length > 0) {
                        lat = geoData[0].lat;
                        lon = geoData[0].lon;
                    }
                } catch (geoError) {
                    console.error("Geocoding failed:", geoError);
                }
            }

            const token = localStorage.getItem('token');
            const bodyData = {
                ...profileData,
                latitude: lat,
                longitude: lon
            };

            const response = await fetch('http://localhost:5001/api/records/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(bodyData),
            });

            if (response.ok) {
                const resData = await response.json();
                alert('Profil mis à jour avec succès! (Localisation détectée)');

                // Merge response data to ensure we have the lat/lon if server processed it
                const updatedUser = {
                    ...user,
                    ...profileData,
                    latitude: lat || user.latitude,
                    longitude: lon || user.longitude
                };

                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Erreur lors de la mise à jour');
        }
    };

    const handlePhotoUpload = async (e, type) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const formData = new FormData();
        const token = localStorage.getItem('token');

        if (type === 'profile') {
            formData.append('profilePhoto', files[0]);
            try {
                const response = await fetch('http://localhost:5001/api/uploads/profile-photo', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData,
                });
                if (response.ok) {
                    const data = await response.json();
                    const updatedUser = { ...user, profilePhoto: data.photoUrl };
                    setUser(updatedUser);
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    alert('Photo de profil mise à jour!');
                }
            } catch (error) { console.error(error); }
        } else if (type === 'salon') {
            for (let file of files) { formData.append('salonPhotos', file); }
            try {
                const response = await fetch('http://localhost:5001/api/uploads/salon-photos', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData,
                });
                if (response.ok) {
                    const data = await response.json();
                    const updatedUser = { ...user, salonPhotos: [...(user.salonPhotos || []), ...data.photoUrls] };
                    setUser(updatedUser);
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    alert('Photos ajoutées!');
                }
            } catch (error) { console.error(error); }
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <DashboardOverview user={user} />;
            case 'planning':
                return <Planning />;
            case 'services':
                return <ServiceManagement user={user} />;
            case 'reviews':
                return <ReviewsPage user={user} professionalId={user._id || user.id} />;
            case 'settings':
                return (
                    <div className="card">
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <IoPerson color="#1d1d1f" /> Modifier mon profil
                        </h2>
                        <form onSubmit={handleProfileUpdate} style={{ marginTop: '20px' }}>
                            <div className="form-group">
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <IoBusiness /> Nom de l'entreprise
                                </label>
                                <input
                                    className="form-input"
                                    type="text"
                                    value={profileData.companyName}
                                    onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-2">
                                <div className="form-group">
                                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <IoCall /> Téléphone
                                    </label>
                                    <input
                                        className="form-input"
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <IoLocation /> Adresse
                                    </label>
                                    <input
                                        className="form-input"
                                        type="text"
                                        value={profileData.address}
                                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <IoTime /> Horaires affichés
                                </label>
                                <input
                                    className="form-input"
                                    type="text"
                                    value={profileData.openingHours}
                                    onChange={(e) => setProfileData({ ...profileData, openingHours: e.target.value })}
                                    placeholder="Ex: Lun-Ven 9h-18h"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-textarea"
                                    rows="4"
                                    value={profileData.description}
                                    onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="grid grid-2" style={{ marginBottom: '20px' }}>
                                <div>
                                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <IoCamera /> Photo de Profil
                                    </label>
                                    <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, 'profile')} />
                                </div>
                                <div>
                                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <IoCamera /> Photos du Salon
                                    </label>
                                    <input type="file" multiple accept="image/*" onChange={(e) => handlePhotoUpload(e, 'salon')} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" className="btn btn-primary">Enregistrer les modifications</button>
                                <button type="button" className="btn btn-secondary" onClick={() => navigate(`/professional/${user._id || user.id}`)}>
                                    Voir ma page publique
                                </button>
                            </div>
                        </form>
                    </div>
                );
            default:
                return <DashboardOverview user={user} />;
        }
    };

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <div className="dashboard-sidebar">
                <div style={{ marginBottom: '40px' }} className="desktop-only">
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 10px',
                        background: '#1d1d1f',
                        color: 'white',
                        borderRadius: '20px',
                        fontWeight: '600',
                        fontSize: '11px',
                        marginBottom: '10px'
                    }}>
                        <IoBusiness size={12} /> ESPACE PRO
                    </div>
                    <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0, letterSpacing: '-0.5px' }}>MyPlanning</h2>
                    <div style={{ fontSize: '13px', color: '#86868b', marginTop: '6px' }}>{user.companyName || 'Mon Salon'}</div>
                </div>

                {/* Mobile Header (simplified) */}
                <div className="mobile-only" style={{ marginBottom: '10px', textAlign: 'center' }}>
                    <strong>MyPlanning Pro</strong>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                padding: '12px 16px',
                                border: 'none',
                                borderRadius: '12px',
                                background: activeTab === item.id ? '#1d1d1f' : 'transparent',
                                color: activeTab === item.id ? 'white' : '#1d1d1f',
                                fontSize: '14px',
                                fontWeight: activeTab === item.id ? '600' : '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                textAlign: 'left',
                                gap: '12px',
                                justifyContent: 'flex-start' // Reset for mobile override in CSS if needed
                            }}
                        >
                            {item.icon}
                            {/* Label logic handled by CSS or kept simple */}
                            <span className="nav-label">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="logout-btn" style={{ borderTop: '1px solid #E5E5E5', paddingTop: '20px' }}>
                    <button
                        onClick={deconnection}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            padding: '12px 16px',
                            border: 'none',
                            background: 'transparent',
                            color: '#1d1d1f',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            gap: '10px'
                        }}
                    >
                        <IoLogOut />
                        Déconnexion
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="dashboard-content">
                <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default ProfessionalDashboard;
