import '../css/AppleDesign.css';
import Input from "../common/Input";
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

function RegisterPage({ setUser }) {
  const { t } = useTranslation();
  const [typePerson, setTypePerson] = useState('Client');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    prenom: '', nom: '', dateDeNaissance: '', email: '', password: '', profession: '', companyName: '', siret: '',
  });
  const [errorMessages, setErrorMessages] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const type = typePerson === 'Client' ? 'client' : 'professional';

    try {
      const response = await fetch('http://localhost:5001/api/records/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type })
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.emailUsed) alert(t('email_used'));
        else alert(t('register_error'));
      } else {
        const successData = await response.json();
        localStorage.setItem("user", JSON.stringify(successData.user));
        localStorage.setItem("token", successData.token);
        setUser(successData.user);
        navigate('/');
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div style={{ background: '#F5F5F7', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '40px' }}>
        <h2 className="text-center" style={{ marginBottom: '30px' }}>{t('register_title')}</h2>

        <div style={{ display: 'flex', background: '#F5F5F7', padding: '4px', borderRadius: '12px', marginBottom: '30px' }}>
          <button
            onClick={() => setTypePerson('Client')}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '10px',
              background: typePerson === 'Client' ? 'white' : 'transparent',
              boxShadow: typePerson === 'Client' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {t('client_role')}
          </button>
          <button
            onClick={() => setTypePerson('Professional')}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '10px',
              background: typePerson === 'Professional' ? 'white' : 'transparent',
              boxShadow: typePerson === 'Professional' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {t('pro_role')}
          </button>
        </div>

        <form onSubmit={handleRegister}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label className="form-label">{t('firstname_label')}</label>
            <input className="form-input" type="text" name="prenom" required onChange={handleChange} value={formData.prenom} />
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label className="form-label">{t('lastname_label')}</label>
            <input className="form-input" type="text" name="nom" required onChange={handleChange} value={formData.nom} />
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label className="form-label">{t('birthdate_label')}</label>
            <input className="form-input" type="date" name="dateDeNaissance" required onChange={handleChange} value={formData.dateDeNaissance} />
          </div>

          {typePerson === 'Professional' && (
            <>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label className="form-label">{t('profession_label')}</label>
                <input className="form-input" type="text" name="profession" required onChange={handleChange} value={formData.profession} />
              </div>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label className="form-label">{t('company_label')}</label>
                <input className="form-input" type="text" name="companyName" required onChange={handleChange} value={formData.companyName} />
              </div>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label className="form-label">{t('siret_label')}</label>
                <input className="form-input" type="text" name="siret" required onChange={handleChange} value={formData.siret} />
              </div>
            </>
          )}

          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label className="form-label">{t('email_label')}</label>
            <input className="form-input" type="email" name="email" required onChange={handleChange} value={formData.email} />
          </div>
          <div className="form-group" style={{ marginBottom: '30px' }}>
            <label className="form-label">{t('password_label')}</label>
            <input className="form-input" type="password" name="password" required onChange={handleChange} value={formData.password} />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>{t('register_btn')}</button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p className="text-secondary"> {t('already_account')} <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>{t('login_link')}</Link></p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;