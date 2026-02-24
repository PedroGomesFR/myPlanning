import { useState, useEffect } from 'react';
import {
    IoCard,
    IoCalendar,
    IoStar,
    IoArrowForward,
    IoHelpCircle,
    IoCalendarNumber,
    IoAddCircle
} from 'react-icons/io5';
import '../css/AppleDesign.css';

function DashboardOverview({ user }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5001/api/bookings/stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="loading-spinner"></div>;

    return (
        <div className="dashboard-overview">
            <h1 style={{ marginBottom: '10px' }}>Bonjour, {user.prenom}</h1>
            <p className="text-secondary" style={{ marginBottom: '30px' }}>Voici un aperçu de votre activité.</p>

            {stats && (
                <div className="grid grid-3">
                    <div className="card">
                        <div className="text-secondary" style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <IoCard /> Chiffre d'Affaires
                        </div>
                        <div style={{ fontSize: '32px', fontWeight: '700', margin: '10px 0', color: 'var(--primary)' }}>
                            {stats.totalRevenue ? `${stats.totalRevenue}€` : '0€'}
                        </div>
                        <div className="text-secondary" style={{ fontSize: '13px' }}>Total gagné (terminés)</div>
                    </div>

                    <div className="card">
                        <div className="text-secondary" style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <IoCalendar /> Réservations
                        </div>
                        <div style={{ fontSize: '32px', fontWeight: '700', margin: '10px 0' }}>
                            {stats.confirmed + stats.pending}
                        </div>
                        <div style={{ fontSize: '13px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>{stats.pending} en attente</span> • <span style={{ color: 'var(--primary)' }}>{stats.confirmed} confirmées</span>
                        </div>
                    </div>

                    <div className="card">
                        <div className="text-secondary" style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <IoStar /> Avis Clients
                        </div>
                        <div style={{ fontSize: '32px', fontWeight: '700', margin: '10px 0' }}>
                            {user.averageRating ? user.averageRating.toFixed(1) : '-'} <span style={{ fontSize: '16px', fontWeight: 'normal' }}>/ 5</span>
                        </div>
                        <div className="text-secondary" style={{ fontSize: '13px' }}>Basé sur vos avis</div>
                    </div>
                </div>
            )}

            <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                <div className="card">
                    <h3>Actions Rapides</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                        <button className="btn btn-secondary" onClick={() => window.location.hash = '#planning'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <IoCalendarNumber /> Gérer mon planning
                        </button>
                        <button className="btn btn-secondary" onClick={() => window.location.hash = '#services'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <IoAddCircle /> Ajouter une prestation
                        </button>
                    </div>
                </div>

                <div className="card" style={{ background: '#1d1d1f', color: 'white' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <IoHelpCircle /> Besoin d'aide ?
                    </h3>
                    <p style={{ opacity: 0.9, fontSize: '14px', margin: '10px 0' }}>Consultez notre guide pour améliorer votre page.</p>
                    <button className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        Voir le guide <IoArrowForward />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DashboardOverview;
