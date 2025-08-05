import React, { useState } from 'react';
import axios from 'axios';
import ApiData from './config.json';
import SHA256 from 'crypto-js/sha256';  // hash kütüphanesi
import './auth.css';

function Register() {
  const [form, setForm] = useState({ userName: '', email: '', password: '', roleId: 3 }); // roleId default mesela 3 öğrenci

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Şifreyi hashle
    const hashedPassword = SHA256(form.password).toString();

    try {
      const res = await axios.post(ApiData.API_URL + 'Auth/register', {
        UserName: form.userName,
        Email: form.email,
        PasswordHash: hashedPassword,
        RoleId: parseInt(form.roleId, 10)  // Rol id'si sayı olmalı
      });

      alert('Kayıt başarılı, kullanıcı ID: ' + res.data.UserId);
    } catch (err) {
      alert('Kayıt başarısız');
    }
  };

  return (
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
      <select
        name="roleId"
        value={form.roleId}
        onChange={handleChange}
        required
      >
        <option value={1}>Müdür</option>
        <option value={2}>Öğretmen</option>
        <option value={3}>Öğrenci</option>
      </select>
      <button type="submit">Kayıt Ol</button>
    </form>
  );
}

export default Register;
