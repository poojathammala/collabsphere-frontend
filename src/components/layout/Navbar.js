import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome, FiSearch, FiPlusCircle, FiUser,
  FiLogOut, FiMenu, FiX, FiLayers
} from 'react-icons/fi';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/feed', icon: <FiHome />, label: 'Feed' },
    { to: '/explore', icon: <FiSearch />, label: 'Explore' },
    { to: '/create', icon: <FiPlusCircle />, label: 'Post' },
    { to: '/collaborations', icon: <FiLayers />, label: 'Collabs' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link to="/feed" className={styles.logo}>
          <span className={styles.logoIcon}>◈</span>
          <span className={styles.logoText}>CollabSphere</span>
        </Link>

        {/* Desktop Nav */}
        <div className={styles.navLinks}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`${styles.navLink} ${isActive(link.to) ? styles.active : ''}`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className={styles.rightSide}>
          {/* User menu */}
          <div className={styles.userMenu} onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div className={styles.avatar}>
              {user?.avatarUrl
                ? <img src={user.avatarUrl} alt={user.fullName} />
                : <span>{user?.fullName?.[0]?.toUpperCase() || 'U'}</span>
              }
            </div>
            <span className={styles.userName}>{user?.fullName?.split(' ')[0]}</span>
          </div>

          {dropdownOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>
                <p className={styles.dropName}>{user?.fullName}</p>
                <p className={styles.dropEmail}>{user?.email}</p>
              </div>
              <Link to="/profile" className={styles.dropItem} onClick={() => setDropdownOpen(false)}>
                <FiUser /> My Profile
              </Link>
              <button className={`${styles.dropItem} ${styles.logoutBtn}`} onClick={handleLogout}>
                <FiLogOut /> Sign Out
              </button>
            </div>
          )}

          {/* Hamburger */}
          <button className={styles.hamburger} onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`${styles.mobileLink} ${isActive(link.to) ? styles.active : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.icon} {link.label}
            </Link>
          ))}
          <Link to="/profile" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>
            <FiUser /> Profile
          </Link>
          <button className={`${styles.mobileLink} ${styles.logoutBtn}`} onClick={handleLogout}>
            <FiLogOut /> Sign Out
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
