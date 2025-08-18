import React, { useState } from 'react';
import axios from 'axios';
import ApiData from './config.json';  // API URL'nin olduğu dosya
import './auth.css';

function Register() {
  const [form, setForm] = useState({ userName: '', email: '', password: '', roleId: 2 }); // default öğrenci

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(ApiData.API_URL + 'Auth/register', {
        UserName: form.userName,
        Email: form.email,
        PasswordHash: form.password,
        RoleId: parseInt(form.roleId)  // RoleId'yi sayıya çevir
      });
      alert('Kayıt başarılı, kullanıcı ID: ' + res.data.UserId);
    } catch (err) {
      alert('Kayıt başarısız: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="home-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Kayıt Ol</h2>
        <input
          name="userName"
          placeholder="Kullanıcı Adı"
          value={form.userName}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
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
        <select name="roleId" value={form.roleId} onChange={handleChange} required>
          <option value={1}>Müdür</option>
          <option value={2}>Öğrenci</option>
          <option value={3}>Öğretmen</option>
        </select>
        <button type="submit">Kayıt Ol</button>
      </form>
    </div>
  );
}

export default Register;
