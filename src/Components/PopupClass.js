import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApiData from '../config.json';

function PopupClass({ type, classId, closePopup, onSuccess }) {
  const [name, setName] = useState('');

  useEffect(() => {
    if ((type === 'edit') && classId) {
      axios.get(`${ApiData.API_URL}Sinif/${classId}`)
        .then(res => {
          if (res.data) {
            setName(res.data.name || '');  // res.data doğrudan sınıf objesi
          }
        })
        .catch(() => alert('Sınıf bilgileri yüklenemedi'));
    } else if (type === 'add') {
      setName('');
    }
  }, [type, classId]);

  const handleSave = () => {
    if (!name.trim()) {
      alert('Lütfen sınıf adını giriniz');
      return;
    }

    const payload = { name };

    if (type === 'add') {
      axios.post(`${ApiData.API_URL}Sinif`, payload)
        .then(() => {
          alert('Sınıf eklendi');
          onSuccess();
          closePopup();
        })
        .catch(() => alert('Ekleme hatası'));
    } else if (type === 'edit') {
      axios.put(`${ApiData.API_URL}Sinif/${classId}`, payload)
        .then(() => {
          alert('Sınıf güncellendi');
          onSuccess();
          closePopup();
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

        <div style={{ textAlign: 'right' }}>
          <button
            onClick={closePopup}
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
