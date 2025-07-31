import React, { useState } from 'react';
import axios from 'axios';
import ApiData from './config.json';
import './auth.css';  // CSS dosyasını ekledik

function Login({ onLoginSuccess }) {
  const [form, setForm] = useState({ userName: '', password: '' });

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const res = await axios.post(ApiData.API_URL + 'Auth/login', {
        UserName: form.userName,
        PasswordHash: form.password
      });

      const userData = {
        userName: res.data.UserName || res.data.userName,
        role: res.data.role || 'student'
      };

      alert('Hoşgeldin ' + userData.userName);
      onLoginSuccess(userData);

    } catch (err) {
      alert('Giriş başarısız');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Login</h2>
      <input
        name="userName"
        placeholder="Kullanıcı Adı"
        value={form.userName}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Şifre"
        value={form.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Giriş Yap</button>
    </form>
  );
}

export default Login;
