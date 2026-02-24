import { useNavigate, Link } from 'react-router-dom';
import { IoSearch, IoPerson, IoLogIn, IoMenu, IoShieldCheckmark, IoGlobeOutline, IoCalendar, IoLanguage, IoLogOut, IoSettings } from 'react-icons/io5';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../css/AppleDesign.css';

function Header({ user }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <header className={scrolled ? 'header-scrolled' : ''} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      transition: 'all 0.3s ease',
      background: scrolled ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(0,0,0,0.1)' : 'none',
      padding: '15px 0'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Text Logo */}
        <div
          onClick={() => navigate('/')}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            background: '#1d1d1f',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <IoCalendar size={18} />
          </div>
          <span style={{ fontSize: '20px', fontWeight: '600', letterSpacing: '-0.5px', color: '#1d1d1f' }}>MyPlanning</span>
        </div>

        {/* Navigation */}
        <nav className="headerNav" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#1d1d1f', textDecoration: 'none', fontSize: '13px', fontWeight: '500', opacity: 0.8 }}>{t('home')}</Link>
          <Link to="/recherche" style={{ color: '#1d1d1f', textDecoration: 'none', fontSize: '13px', fontWeight: '500', opacity: 0.8 }}>{t('find_pro')}</Link>
          {user?.isAdmin && (
            <Link to="/admin" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <IoShieldCheckmark size={16} /> {t('admin')}
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className="headerActions" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>

          {/* Language Selector */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <IoGlobeOutline size={16} color="#86868b" />
            <select
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '13px',
                fontWeight: '500',
                color: '#1d1d1f',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="fr">FR</option>
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="de">DE</option>
              <option value="it">IT</option>
              <option value="pt">PT</option>
              <option value="ar">AR</option>
            </select>
          </div>

          {user ? (
            <button
              onClick={() => navigate('/profile')}
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <IoPerson size={16} />
              {t('my_space')}
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <IoLogIn size={16} />
              {t('login')}
            </button>
          )}
        </div>

      </div>
    </header>
  );
}

export default Header;