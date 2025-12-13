import '../../components/css/Header.css';
import { useNavigate, Link } from 'react-router-dom';


function Header({ user }) {
  const navigate = useNavigate();

  return (
    <header>

      <div className="headerTitle">
        <h1 onClick={() => navigate('/')}>MyPlanning</h1>
      </div>

      <nav className="headerNav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>

      <div className="headerActions">
        {user ? (
          <Link to="/profile">
            <button>Profile</button>
          </Link>
        ) : (
          <Link to="/login">
            <button>Login/Sign Up</button>
          </Link>
        )}
      </div>

    </header>
  );
}

export default Header;