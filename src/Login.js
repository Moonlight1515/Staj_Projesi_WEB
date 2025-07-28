import React, { useState } from 'react';
import axios from 'axios';
import ApiData from './config.json';

function Login() {
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
      alert('Hoşgeldin ' + (res.data.UserName || res.data.userName));
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
