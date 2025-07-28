import React, { useState } from 'react';
import './App.css';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Student from './Components/Student';
import Teacher from './Components/Teacher';
import Class from './Components/Clas';

function App() {
  const [page, setPage] = useState('home'); // home, login, register, student, teacher, class
  const [user, setUser] = useState(null);   // Giriş yapan kullanıcının bilgisi

  // Login başarılı olursa çağrılacak fonksiyon
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    // Kullanıcının tipine göre page belirle
    if (userData.role === 'student') setPage('student');
    else if (userData.role === 'teacher') setPage('teacher');
    else if (userData.role === 'class') setPage('class');
    else setPage('home');
  };

  // Çıkış yapılacaksa kullanıcıyı temizle ve ana sayfaya dön
  const handleLogout = () => {
    setUser(null);
    setPage('home');
  };

  return (
    <div className="App">
      {/* Arka plan için css ile menu.png ekleyeceğiz */}
      <nav style={{ display: user ? 'flex' : 'none', gap: '15px', padding: '10px', backgroundColor: '#eee' }}>
        <button onClick={() => setPage('student')}>Öğrenci</button>
        <button onClick={() => setPage('teacher')}>Öğretmen</button>
        <button onClick={() => setPage('class')}>Sınıf</button>
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
