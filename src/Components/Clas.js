import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ApiData from '../config.json';

function Class() {
  const [classes, setClasses] = useState([]);
  const [name, setName] = useState('');

  const fetchClasses = async () => {
    try {
      const res = await axios.get(ApiData.API_URL+'Sinif');
      setClasses(res.data.data || []);
    } catch (e) {
      setClasses([]);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleAdd = async () => {
    if (!name.trim()) return alert("Sınıf adı girin");
    try {
      await axios.post(ApiData.API_URL+'Sinif', { name });
      setName('');
      fetchClasses();
    } catch {
      alert("Sınıf ekleme hatası");
    }
  };

  return (
    <div>
      <h2>Sınıflar</h2>
      <input
        type="text"
        placeholder="Sınıf adı"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={handleAdd}>Ekle</button>

      <ul>
        {classes.map(c => (
          <li key={c.id}>{c.name}</li>
        ))}
        {classes.length === 0 && <li>Kayıt yok</li>}
      </ul>
    </div>
  );
}

export default Class;