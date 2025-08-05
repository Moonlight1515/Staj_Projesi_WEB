import React, { useState } from 'react';
import './App.css';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Student from './Components/Student';
import Teacher from './Components/Teacher';
import Class from './Components/Clas';

function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);

    // Rol Id’ye göre ilk sayfayı belirle
    switch (userData.roleId) {
      case 1: // Müdür/Admin
        setPage('student'); // ilk sayfa öğrenci olabilir
        break;
      case 2: // Öğrenci
        setPage('student');
        break;
      case 3: // Öğretmen
        setPage('teacher');
        break;
      default:
        setPage('home');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setPage('home');
  };

  return (
    <div className="App">
      {/* Menü sadece giriş yapıldıysa gözüksün */}
      <nav style={{ display: user ? 'flex' : 'none', gap: '15px', padding: '10px', backgroundColor: '#eee' }}>
        {/* Sadece Müdür rolü tüm butonları görebilsin */}
        {(user?.roleId === 1 || user?.roleId === 2) && (
          <button onClick={() => setPage('student')}>Öğrenci</button>
        )}
        {(user?.roleId === 1 || user?.roleId === 3) && (
          <button onClick={() => setPage('teacher')}>Öğretmen</button>
        )}
        {user?.roleId === 1 && (
          <button onClick={() => setPage('class')}>Sınıf</button>
        )}
        <button onClick={handleLogout}>Çıkış</button>
      </nav>

      <main>
        {page === 'home' && <Home setPage={setPage} />}
        {page === 'login' && <Login onLoginSuccess={handleLoginSuccess} />}
        {page === 'register' && <Register />}
        {page === 'student' && <Student />}
        {page === 'teacher' && <Teacher />}
        {page === 'class' && <Class />}
      </main>
    </div>
  );
}

export default App;
