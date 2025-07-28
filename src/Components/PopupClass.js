import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Popup.css';
import ApiData from '../config.json';

function PopupClass({ type, classId, closePopup }) {
  const [name, setName] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    axios.get("${ApiData.API_URL}Ogretmen")
      .then(res => setTeachers(res.data.data || []))
      .catch(() => alert("Öğretmen listesi alınamadı"));

    if (type === 'edit' && classId) {
      axios.get(`${ApiData.API_URL}Sinif/${classId}`)
        .then(res => {
          const data = res.data.data;
          setName(data.name);
          setTeacherId(data.ogretmenId);
        })
        .catch(() => alert("Sınıf bilgileri alınamadı"));
    } else if (type === 'add') {
      setName('');
      setTeacherId('');
    }
  }, [type, classId]);

  const handleConfirm = () => {
    if ((type === 'add' || type === 'edit') && (!name || !teacherId)) {
      alert("Tüm alanları doldurun.");
      return;
    }

    const payload = { name, ogretmenId: Number(teacherId) };

    if (type === 'add') {
      axios.post("${ApiData.API_URL}Sinif", payload)
        .then(() => alert("Sınıf eklendi"))
        .catch(() => alert("Ekleme hatası"));
    } else if (type === 'edit') {
      axios.put(`${ApiData.API_URL}Sinif/${classId}`, payload)
        .then(() => alert("Sınıf güncellendi"))
        .catch(() => alert("Güncelleme hatası"));
    } else if (type === 'delete') {
      axios.delete(`${ApiData.API_URL}Sinif/${classId}`)
        .then(() => alert("Sınıf silindi"))
        .catch(() => alert("Silme hatası"));
    }

    closePopup();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{type.toUpperCase()} Class</h3>

        {(type === 'add' || type === 'edit') && (
          <>
            <input
              type="text"
              placeholder="Sınıf Adı"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
            <select value={teacherId} onChange={e => setTeacherId(e.target.value)}>
              <option value="">Öğretmen Seçin</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </>
        )}

        {type === 'delete' && <p>Bu sınıfı silmek istediğinizden emin misiniz?</p>}

        <button onClick={handleConfirm}>Confirm</button>
        <button onClick={closePopup}>Cancel</button>
      </div>
    </div>
  );
}

export default PopupClass;
