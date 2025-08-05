import React, { useState } from 'react';
import axios from 'axios';
import ApiData from './config.json';
import './auth.css';

function Login({ onLoginSuccess }) {
  const [form, setForm] = useState({ userName: '', password: '' });

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const getRoleNameById = (roleId) => {
    switch (roleId) {
      case 1:
        return 'Müdür';
      case 2:
        return 'Öğrenci';
      case 3:
        return 'Öğretmen';
      default:
        return 'Kullanıcı';
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const res = await axios.post(ApiData.API_URL + 'Auth/login', {
        UserName: form.userName,
        PasswordHash: form.password
      });

      // Backend'den roleId ve role (rol adı) geliyor
      const roleId = res.data.roleId || 0;
      const roleName = res.data.role || getRoleNameById(roleId);

      const userData = {
        userName: res.data.userName || res.data.UserName,
        roleId: roleId,
        roleName: roleName
      };

      alert(`Hoşgeldin ${userData.userName}! Rolün: ${userData.roleName}`);
      onLoginSuccess(userData);

    } catch (err) {
      alert('Giriş başarısız: ' + (err.response?.data?.message || err.message));
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
