import React from 'react';
import menuImg from './menu.png';
import './Home.css';

function Home({ setPage }) {
  return (
    <div
      className="home-container"
      style={{ backgroundImage: `url(${menuImg})` }}
    >
      <div className="overlay" />
      <div className="menu-content">
        <h1>Hoş Geldiniz</h1>
        <div className="button-group">
          <button className="btn" onClick={() => setPage('login')}>Giriş Yap</button>
          <button className="btn btn-secondary" onClick={() => setPage('register')}>Kayıt Ol</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
