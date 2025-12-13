import { useNavigate } from "react-router-dom";
import Planning from '../common/planning.jsx';

function ProfilePage({ user }) {
    
    const navigate = useNavigate();

    const name = user ? `${user.prenom} ${user.nom}` : "N/A";
    const email = user ? user.email : "Not logged in";
    const profession = user && user.profession ? user.profession : "N/A";
    const companyName = user && user.companyName ? user.companyName : "N/A";
    const siret = user && user.siret ? user.siret : "N/A";
    const dateOfBirth = user && user.dateDeNaissance ? user.dateDeNaissance : "N/A";

    const deconnection = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = '/home';
    }

    return (
        <>
            <div>
                <h1>Profile Page</h1>
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Date of Birth:</strong> {dateOfBirth}</p>
                <p><strong>Profession:</strong> {profession}</p>
                <p><strong>Company Name:</strong> {companyName}</p>
                <p><strong>SIRET:</strong> {siret}</p> 
            </div>

            <button onClick={deconnection}>Logout</button>

            <button onClick={() => navigate('/planning')}>Go to Planning</button>
        </>
    );
}

export default ProfilePage;