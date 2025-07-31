import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PopupClass({ type, classId, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    axios.get('https://localhost:7004/api/Ogretmen')
      .then(res => {
        if (res.data) setTeachers(res.data.data || []);
      })
      .catch(() => alert('Öğretmenler yüklenemedi'));

    if (type === 'edit' && classId) {
      axios.get(`https://localhost:7004/api/Sinif/${classId}`)
        .then(res => {
          if (res.data) {
            setName(res.data.data.name || '');
            setTeacherId(res.data.data.ogretmenId || '');
          }
        })
        .catch(() => alert('Sınıf bilgileri yüklenemedi'));
    } else {
      setName('');
      setTeacherId('');
    }
  }, [type, classId]);

  const handleSave = () => {
    if (!name.trim() || !teacherId) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    const payload = { name, ogretmenId: Number(teacherId) };

    if (type === 'add') {
      axios.post('https://localhost:7004/api/Sinif', payload)
        .then(() => {
          alert('Sınıf eklendi');
          onSuccess();
          onClose();
        })
        .catch(() => alert('Ekleme hatası'));
    } else if (type === 'edit') {
      axios.put(`https://localhost:7004/api/Sinif/${classId}`, payload)
        .then(() => {
          alert('Sınıf güncellendi');
          onSuccess();
          onClose();
        })
        .catch(() => alert('Güncelleme hatası'));
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top:0, left:0, right:0, bottom:0,
      backgroundColor: 'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center'
    }}>
      <div style={{
        backgroundColor: 'white', padding: 20, borderRadius: 8, width: 320,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
      }}>
        <h3 style={{ color: 'white', backgroundColor: '#007bff', padding: '8px', borderRadius: '4px' }}>
          {type === 'add' ? 'Yeni Sınıf Ekle' : 'Sınıf Düzenle'}
        </h3>

        <div style={{ marginBottom: 12 }}>
          <label style={{ color: '#333' }}>Sınıf Adı:</label><br/>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ width: '100%', padding: 6, marginTop: 4 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ color: '#333' }}>Öğretmen Seç:</label><br/>
          <select
            value={teacherId}
            onChange={e => setTeacherId(e.target.value)}
            style={{ width: '100%', padding: 6, marginTop: 4 }}
          >
            <option value="">Seçiniz</option>
            {teachers.map(t => (
              <option key={t.id} value={t.id}>{t.name} {t.surname}</option>
            ))}
          </select>
        </div>

        <div style={{ textAlign: 'right' }}>
          <button
            onClick={onClose}
            style={{
              marginRight: 8,
              backgroundColor: '#6c757d',
              color: 'white',
              padding: '6px 12px',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '6px 12px',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

export default PopupClass;
