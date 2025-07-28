// src/App.js
import React, { useState } from 'react';
import './App.css';
import Login from './Login';
import Register from './Register';
import Student from './Components/Student';
import Teacher from './Components/Teacher';
import Class from './Components/Clas';

function App() {
  const [page, setPage] = useState('login');

  return (
    <div className="App">
      <nav className="nav-bar">
        <button onClick={() => setPage('login')}>Login</button>
        <button onClick={() => setPage('register')}>Register</button>
        <button onClick={() => setPage('student')}>Öğrenciler</button>
        <button onClick={() => setPage('teacher')}>Öğretmenler</button>
        <button onClick={() => setPage('class')}>Sınıflar</button>
      </nav>

      <main>
        {page === 'login' && <Login />}
        {page === 'register' && <Register />}
        {page === 'student' && <Student />}
        {page === 'teacher' && <Teacher />}
        {page === 'class'   && <Class />}
      </main>
    </div>
  );
}

export default App;