import '../../components/css/RegisterPage.css';
import Input from "../common/Input";
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

function RegisterPage({ setUser }) {

    const [typePerson, setTypePerson] = useState('Client');

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        prenom: '',
        nom: '',
        dateDeNaissance: '',
        email: '',
        password: '',
        profession: '',
        companyName: '',
        siret: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
      const errorMessage = validate(name, value);
      setErrorMessages((prev) => ({ ...prev, [name]: errorMessage }));
    };
  
    const [errorMessages, setErrorMessages] = useState({
        prenom: '',
        nom: '',
        dateDeNaissance: '',
        email: '',
        password: '',
        profession: '',
        companyName: '',
        siret: '',
    });
  
    const validate = (name, value) => { 
      switch (name) {
        case 'prenom':
          if (!value) {
            return "prenom Obligatoire.";
          }
          if (value.length < 3) {
            return "le prenom doit contenir au moins 3 caractères.";
          }
          if (value.length > 20) {
            return "le prenom doit contenir au plus 20 caractères.";
          }
          return "";
        case 'nom':
          if (!value) {
            return "nom Obligatoire.";
          }
          if (value.length < 3) {
            return "le nom doit contenir au moins 3 caractères.";
          }
          if (value.length > 20) {
            return "le nom doit contenir au plus 20 caractères.";
          }
          return "";
        case 'dateDeNaissance':
          if (!value) {
            return "Date de naissance Obligatoire.";
          }
          const today = new Date();
          const birthDate = new Date(value);
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDifference = today.getMonth() - birthDate.getMonth();
          if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
              age--;
          }
          if (age < 18) {
            return "Vous devez avoir au moins 18 ans.";
          }
          return "";

        case 'email':
          if (!value) {
            setErrorMessages((prev) => ({ ...prev, email: "Email est obligatoire." }));
          } else {
            setErrorMessages((prev) => ({ ...prev, email: "" }));
          }
          return "";

        case 'password':
          if (!value) {
            setErrorMessages((prev) => ({ ...prev, password: "Password is required." }));
          } else {
            setErrorMessages((prev) => ({ ...prev, password: "" }));
          }
          return "";
      
        case 'profession':
          if (!value) {
            return "Profession obligatoire.";
          }
          return "";

        case 'companyName':
          if (!value) {
            return "Nom de l'entreprise obligatoire.";
          }
          return "";

        case 'siret':
          if (!value) {
            return "Siret obligatoire.";
          }
          return "";
      
        default:
          return ""; 
      }
    }

    const handleClientRegister = async (e) => {
      e.preventDefault();

        if (!formData.prenom || !formData.nom || !formData.dateDeNaissance || !formData.email || !formData.password) {
            alert(JSON.stringify(formData));
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/api/records/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...formData, type: 'client' })
            });
            
            if (!response.ok) {
                let data;
                try {
                    data = await response.json();
                } catch (e) {
                    data = { message: `Error ${response.status}: ${response.statusText}` };
                }
                console.log("Registration failed:", data);

                if (data.emailUsed) {
                    setErrorMessages((prev) => ({ ...prev, email: "Email déjà utilisé." }));
                }

            } else {
              const successData = await response.json();
              console.log("Registration successful:", successData);
              localStorage.setItem("user", JSON.stringify(successData.user));
              localStorage.setItem("token", successData.token);
              setUser(successData.user);
              navigate('/');
            }

        } catch (error) {
            console.error("Error during registration:", error);
            // alert("Une erreur s'est produite lors de l'inscription.");
            
        }
    };

    const handleProfessionaleRegister = async (e) => {
      e.preventDefault();

        if (!formData.prenom || !formData.nom || !formData.dateDeNaissance || !formData.email || !formData.password || !formData.profession || !formData.companyName || !formData.siret) {
            alert(JSON.stringify(formData));
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/api/records/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...formData, type: 'professional' })
            });
            
            if (!response.ok) {
                let data;
                try {
                    data = await response.json();
                } catch (e) {
                    data = { message: `Error ${response.status}: ${response.statusText}` };
                }
                console.log("Registration failed:", data);
                if (data.emailUsed) {
                    setErrorMessages((prev) => ({ ...prev, email: "Email déjà utilisé." }));
                }
            } else {
                const successData = await response.json();
              console.log("Registration successful:", successData);
              localStorage.setItem("user", JSON.stringify(successData.user));
              localStorage.setItem("token", successData.token);
              setUser(successData.user);
              navigate('/');
            }

        } catch (error) {
            console.error("Error during registration:", error);
            // alert("Une erreur s'est produite lors de l'inscription.");
            
        }
    };

  return (
    <div className="register-container-wrapper">
      <div className="register-container">
        <h2>Register</h2>


        <button value="Client" onClick={() => setTypePerson('Client')}>
          je suis un Client
        </button>

        <button value="Professional" onClick={() => setTypePerson('Professional')}>
          je suis un Professionnel
        </button>

        {typePerson === 'Client' ? (
          <form className='clientForm' id='clientForm' onSubmit={handleClientRegister}>
            <Input label="Prénom :" errorMessage={errorMessages.prenom} type="text" name="prenom" required={true} onChange={handleChange} value={formData.prenom} />
            <Input label="Nom :" errorMessage={errorMessages.nom} type="text" name="nom" required={true} onChange={handleChange} value={formData.nom} />
            <Input label="Date de naissance :" errorMessage={errorMessages.dateDeNaissance} type="date" name="dateDeNaissance" required={true} onChange={handleChange} value={formData.dateDeNaissance} />
            <Input label="Email :" errorMessage={errorMessages.email} type="email" name="email" required={true} onChange={handleChange} value={formData.email} />
            <Input label="Password :" errorMessage={errorMessages.password} type="password" name="password" required={true} onChange={handleChange} value={formData.password} />
            <button type="submit">Register</button>
          </form>
          ) : (
          <form className='professiannalForm' id='professiannalForm' onSubmit={handleProfessionaleRegister}>
            <Input label="Prénom :" errorMessage={errorMessages.prenom} type="text" name="prenom" required={true} onChange={handleChange} value={formData.prenom} />
            <Input label="Nom :" errorMessage={errorMessages.nom} type="text" name="nom" required={true} onChange={handleChange} value={formData.nom} />
            <Input label="Date de naissance :" errorMessage={errorMessages.dateDeNaissance} type="date" name="dateDeNaissance" required={true} onChange={handleChange} value={formData.dateDeNaissance} />
            <Input label="Profession: " type="text" name="profession" required={true} onChange={handleChange} value={formData.profession} />
            <Input label="Nom de l'entreprise: " type="text" name="companyName" required={true} onChange={handleChange} value={formData.companyName} />
            <Input label="Siret: " type="text" name="siret" required={true} onChange={handleChange} value={formData.siret} />
            <Input label="Email :" errorMessage={errorMessages.email} type="email" name="email" required={true} onChange={handleChange} value={formData.email} />
            <Input label="Password :" errorMessage={errorMessages.password} type="password" name="password" required={true} onChange={handleChange} value={formData.password} />
            <button type="submit">Register</button>
          </form>
        )}

        <div> 
          <p> Vous avez déjà un compte? &nbsp;
            <Link to="/login" className="registerLink">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;