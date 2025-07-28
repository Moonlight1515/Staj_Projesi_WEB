import React, { useState } from 'react';
import axios from 'axios';
import ApiData from './config.json';

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

      console.log('Gelen veri:', res.data);

      // Burada sunucudan gelen kullanıcı tipi bilgisi olmalı
      // Örnek: res.data.role = 'student' | 'teacher' | 'class'
      const userData = {
        userName: res.data.UserName || res.data.userName,
        role: res.data.role || 'student' // default student, sunucuya göre uyarlayın
      };

      alert('Hoşgeldin ' + userData.userName);
      onLoginSuccess(userData);  // Ana komponenti bilgilendir

    } catch (err) {
      console.error(err);
      alert('Giriş başarısız');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
