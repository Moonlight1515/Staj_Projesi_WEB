import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClassPopup from './PopupClass';
import './class.css';

function Class() {
  const [classes, setClasses] = useState([]);
  const [popupType, setPopupType] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const fetchClasses = async () => {
    try {
      const res = await axios.get('https://localhost:7004/api/Sinif'); // Gerekirse ApiData ile değiştir
      setClasses(res.data || []);
    } catch {
      setClasses([]);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [refreshFlag]);

  const handleClosePopup = () => {
    setPopupType(null);
    setSelectedClassId(null);
    setRefreshFlag(!refreshFlag);
  };

  return (
    <div
  className="page-background"
  style={{
    padding: 20,
    width: '100%',
    whiteSpace: 'nowrap',
    overflowX: 'auto',
    color: 'white',
    boxSizing: 'border-box'
  }}
>



      <h2>Sınıflar</h2>

      <button
        onClick={() => setPopupType('add')}
        style={{ ...buttonStyle, marginBottom: 20, backgroundColor: '#28a745' }}
      >
        Yeni Sınıf Ekle
      </button>

      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {classes.length === 0 ? (
          <li>Kayıt yok</li>
        ) : (
          classes.map((cls) => (
            <li
              key={cls.id}
              style={{
                marginBottom: 12,
                padding: 10,
                border: '1px solid #ddd',
                borderRadius: 4,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.4)',
              }}
            >
              <div>
                <strong>{cls.name}</strong> <br />
                Öğrenci Sayısı: {cls.ogrenciSayisi}
              </div>
              <button
                onClick={() => {
                  setSelectedClassId(cls.id);
                  setPopupType('edit');
                }}
                style={{ ...buttonStyle, backgroundColor: '#007bff' }}
              >
                Düzenle
              </button>
            </li>
          ))
        )}
      </ul>

      {popupType && (
        <ClassPopup type={popupType} classId={selectedClassId} closePopup={handleClosePopup} />
      )}
    </div>
  );
}

const buttonStyle = {
  padding: '6px 12px',
  borderRadius: 4,
  border: 'none',
  backgroundColor: '#007bff',
  color: 'white',
  cursor: 'pointer',
};

export default Class;
