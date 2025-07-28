import React, { useState } from 'react';
import axios from 'axios';
import ApiData from './config.json';

function Register() {
  const [form, setForm] = useState({ userName: '', email: '', password: '' });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      console.log('Gönderilen veri:', form);
      const res = await axios.post(ApiData.API_URL + 'Auth/register', {
        UserName: form.userName,
        Email: form.email,
        PasswordHash: form.password
      });
      console.log('Sunucudan gelen yanıt:', res.data);
      alert('Kayıt başarılı, kullanıcı ID: ' + res.data.UserId);
    } catch (err) {
      console.error('Kayıt hatası detay:', err.response?.data || err.message);
      alert('Kayıt başarısız: ' + (err.response?.data?.Title || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <button type="submit">Kayıt Ol</button>
    </form>
  );
}

export default Register;
