import React from 'react';
import Logo from '../assets/Logo.png';

const Header = () => {
  return (
    <div className="hero">
      <div className="hero-logo">
        <img src={Logo} alt="Maanbumigu Makkal Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
      </div>
      <h1>மாண்புமிகு மக்கள் இயக்கம்</h1>
      <h2>Government Office Social Audit – Inspection Format</h2>
      <p>Maanbumigumakkal.com &nbsp;|&nbsp; support@maanbumigumakkal.com</p>
      <div className="badge-strip">
        <span className="badge">அரசு அலுவலக சமூக தணிக்கை</span>
        <span className="badge">Volunteer Form</span>
        <span className="badge">ஆய்வறிக்கை படிவம்</span>
        <span className="badge">RTI</span>
      </div>
    </div>
  );
};

export default Header;
