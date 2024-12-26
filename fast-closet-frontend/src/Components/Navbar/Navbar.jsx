import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isLoggedIn, username, handleLogout }) => {

  return (
    <nav className='flex justify-between'>
      <div>Logo</div>
      <div>
        <ul className='flex'>
          <Link to='/'><li>Home</li></Link>
          <Link to='/stores'><li>Stores</li></Link>
          <Link to='/about'><li>About</li></Link>
        </ul>
      </div>
      <div>
        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to='/login'>Login</Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar;