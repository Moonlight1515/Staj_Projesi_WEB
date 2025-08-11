import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PopupTeacher from './PopupTeacher';
import ApiData from '../config.json';
import './teacher.css';

function Teacher() {
  const [teachers, setTeachers] = useState([]);
  const [branslar, setBranslar] = useState([]);
  const [popupType, setPopupType] = useState(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [searchTC, setSearchTC] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [resTeachers, resBranslar] = await Promise.all([
          axios.get(ApiData.API_URL + 'Ogretmen'),
          axios.get(ApiData.API_URL + 'Branslar'),
        ]);

        console.log('Öğretmenler (API):', resTeachers.data.data);
        console.log('Branşlar (API):', resBranslar.data.data);

        setTeachers(resTeachers.data.data || []);
        setBranslar(resBranslar.data.data || []);
      } catch (error) {
        console.error('Veri çekme hatası:', error);
        setTeachers([]);
        setBranslar([]);
      }
      setLoading(false);
    };

    fetchData();
  }, [refreshFlag]);

  // TC ile arama fonksiyonu
  const searchByTC = async () => {
    if (!searchTC.trim()) {
      setRefreshFlag(!refreshFlag);
      return;
    }
    try {
      const res = await axios.get(`${ApiData.API_URL}Ogretmen/AraTc/${searchTC.trim()}`);
      if (res.data.status) {
        setTeachers([res.data.data]);
      } else {
        setTeachers([]);
        alert('TC ile eşleşen öğretmen bulunamadı');
      }
    } catch {
      setTeachers([]);
      alert('TC ile eşleşen öğretmen bulunamadı');
    }
  };

  const handleClosePopup = () => {
    setPopupType(null);
    setSelectedTeacherId(null);
    setRefreshFlag(!refreshFlag);
  };

  const buttonStyle = {
    padding: '6px 12px',
    marginRight: 8,
    borderRadius: 4,
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
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
        boxSizing: 'border-box',
      }}
    >
      <h2>Öğretmenler</h2>

      <input
        type="text"
        placeholder="TC ile ara"
        value={searchTC}
        onChange={(e) => setSearchTC(e.target.value)}
        style={{ marginRight: 8, padding: '6px 8px', borderRadius: 4, border: '1px solid #ccc' }}
      />
      <button onClick={searchByTC} style={buttonStyle}>
        Ara
      </button>
      <button
        onClick={() => {
          setSearchTC('');
          setRefreshFlag(!refreshFlag);
        }}
        style={buttonStyle}
      >
        Temizle
      </button>

      <button onClick={() => setPopupType('add')} style={{ ...buttonStyle, marginLeft: 16, backgroundColor: '#28a745' }}>
        Öğretmen Ekle
      </button>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <table
          border="1"
          cellPadding="5"
          style={{
            marginTop: 10,
            borderCollapse: 'collapse',
            width: '100%',
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}
        >
          <thead>
            <tr>
              <th>Ad</th>
              <th>Soyad</th>
              <th>TC</th>
              <th>Telefon</th>
              <th>Email</th>
              <th>Doğum Tarihi</th>
              <th>Branş</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {teachers.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>
                  Kayıt bulunamadı
                </td>
              </tr>
            ) : (
              teachers.map((t) => {
                const bransName = branslar.find((b) => b.id === Number(t.bransId))?.name || 'Bilinmiyor';

                return (
                  <tr key={t.id}>
                    <td>{t.name}</td>
                    <td>{t.surname}</td>
                    <td>{t.tc}</td>
                    <td>{t.phone}</td>
                    <td>{t.email}</td>
                    <td>{t.dateOfBirth ? new Date(t.dateOfBirth).toLocaleDateString() : '-'}</td>
                    <td>{bransName}</td>
                    <td>
                      <button
                        onClick={() => {
                          setSelectedTeacherId(t.id);
                          setPopupType('edit');
                        }}
                        style={buttonStyle}
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTeacherId(t.id);
                          setPopupType('delete');
                        }}
                        style={{ ...buttonStyle, backgroundColor: '#dc3545' }}
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}

      {popupType && (
        <PopupTeacher
          type={popupType}
          teacherId={selectedTeacherId}
          closePopup={handleClosePopup}
          branslar={branslar}
        />
      )}
    </div>
  );
}

export default Teacher;
