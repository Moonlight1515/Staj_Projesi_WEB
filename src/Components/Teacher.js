import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PopupTeacher from './PopupTeacher';
import PopupGrades from './PopupGrades';
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

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const [resTeachers, resBranslar] = await Promise.all([
        axios.get(ApiData.API_URL + 'Ogretmen'),
        axios.get(ApiData.API_URL + 'Branslar'),
      ]);

      setTeachers(resTeachers.data.data || []);
      setBranslar(resBranslar.data.data || []);
    } catch (error) {
      console.error('Veri çekme hatası:', error);
      setTeachers([]);
      setBranslar([]);
    }
    setLoading(false);
  };

  const searchByTC = async (tc) => {
    try {
      const res = await axios.get(`${ApiData.API_URL}Ogretmen/AraTc/${tc.trim()}`);
      if (res.data.status) {
        setTeachers(res.data.data);
      } else {
        setTeachers([]);
      }
    } catch (error) {
      setTeachers([]);
      console.error('Arama sırasında hata oluştu', error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [refreshFlag]);

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
      <h2 className="title-box">Öğretmenler</h2>

      <input
        type="text"
        placeholder="TC ile ara"
        value={searchTC}
        onChange={(e) => {
          const value =  e.target.value.replace(/\D/g, ''); ;
          setSearchTC(value);

          if (value.trim().length >= 3) {
            searchByTC(value);     
          } else {
            fetchTeachers();       
          }
        }}
        style={{ marginRight: 8, padding: '6px 8px', borderRadius: 4, border: '1px solid #ccc' }}
      />

      <button
        onClick={() => {
          setSearchTC('');
          setRefreshFlag(!refreshFlag);
        }}
        style={buttonStyle}
      >
        Temizle
      </button>

      <button
        onClick={() => setPopupType('add')}
        style={{ ...buttonStyle, marginLeft: 16, backgroundColor: '#28a745' }}
      >
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
                      <button
                        onClick={() => {
                          setSelectedTeacherId(t.id);
                          setPopupType('grades');
                        }}
                        style={{ ...buttonStyle, backgroundColor: '#ffc107' }}
                      >
                        Notlar
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}

      {popupType && popupType !== 'grades' && (
        <PopupTeacher
          type={popupType}
          teacherId={selectedTeacherId}
          closePopup={handleClosePopup}
          branslar={branslar}
        />
      )}

      {popupType === 'grades' && (
        <PopupGrades
          teacherId={selectedTeacherId}
          closePopup={handleClosePopup}
        />
      )}
    </div>
  );
}

export default Teacher;
