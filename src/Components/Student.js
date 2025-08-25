import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PopupStudent from './PopupStudent';
import ApiData from '../config.json';

function Student() {
  const [students, setStudents] = useState([]);
  const [siniflar, setSiniflar] = useState([]);
  const [popupType, setPopupType] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [searchTC, setSearchTC] = useState('');

  const sabitSiniflar = [
    { id: 19, name: '9/A' }, { id: 20, name: '9/B' }, { id: 21, name: '9/C' },
    { id: 22, name: '10/A' }, { id: 23, name: '10/B' }, { id: 24, name: '10/C' },
    { id: 25, name: '11/A' }, { id: 26, name: '11/B' }, { id: 27, name: '11/C' },
    { id: 28, name: '12/A' }, { id: 29, name: '12/B' }, { id: 30, name: '12/C' },
  ];

  const fetchStudents = async () => {
    try {
      const res = await axios.get(ApiData.API_URL + 'Ogrenci');
      setStudents(res.data.data || []);
    } catch (error) {
      setStudents([]);
      console.error('Öğrenciler alınamadı', error);
    }
  };

  const fetchSiniflar = async () => {
    try {
      const res = await axios.get(ApiData.API_URL + 'Sinif');
      setSiniflar(res.data.data || []);
    } catch (error) {
      setSiniflar([]);
      console.error('Sınıflar alınamadı', error);
    }
  };

  const searchByTC = async (tc) => {
    try {
      const res = await axios.get(`${ApiData.API_URL}Ogrenci/AraTc/${tc.trim()}`);
      if (res.data.status) {
        setStudents(res.data.data);
      } else {
        setStudents([]);
      }
    } catch (error) {
      setStudents([]);
      console.error('Arama sırasında hata oluştu', error);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchSiniflar();
  }, [refreshFlag]);

  const handleClosePopup = () => {
    setPopupType(null);
    setSelectedStudentId(null);
    setRefreshFlag(prev => !prev);
  };

  const getSinifName = (id) => {
    if (!id) return '';
    const sinif = siniflar.find(s => s.id.toString() === id.toString()) ||
                  sabitSiniflar.find(s => s.id.toString() === id.toString());
    return sinif ? sinif.name : '';
  };

  return (
    <div className="page-background" style={{ padding: 20, color: 'white' }}>
      <h2 className="title-box">Öğrenciler</h2>

      <input
        type="text"
        placeholder="TC ile ara"
        value={searchTC}
        onChange={e => {
          const value= e.target.value.replace(/\D/g, ''); ;
          setSearchTC(value);

          if (value.trim().length >= 3) {
            searchByTC(value);   
          } else {
            fetchStudents();     
          }
        }}
        style={{ marginRight: 8, padding: 6, borderRadius: 4 }}
      />

      <button onClick={() => { setSearchTC(''); fetchStudents(); }} style={buttonStyle}>
        Temizle
      </button>

      <button
        onClick={() => setPopupType('add')}
        style={{ ...buttonStyle, marginLeft: 16, backgroundColor: '#28a745' }}
      >
        Öğrenci Ekle
      </button>

      <table
        border="1"
        cellPadding="5"
        style={{ marginTop: 10, borderCollapse: 'collapse', width: '100%', backgroundColor: 'rgba(0,0,0,0.4)', color: 'white' }}
      >
        <thead>
          <tr>
            <th>Ad</th>
            <th>Soyad</th>
            <th>TC</th>
            <th>Telefon</th>
            <th>Cinsiyet</th>
            <th>Doğum Tarihi</th>
            <th>Sınıf</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center' }}>Kayıt bulunamadı</td>
            </tr>
          ) : (
            students.map(s => (
              <tr key={s.id}>
                <td>{s.firstName}</td>
                <td>{s.surname}</td>
                <td>{s.tc}</td>
                <td>{s.phone}</td>
                <td>{s.gender}</td>
                <td>{s.dateOfBirth ? new Date(s.dateOfBirth).toLocaleDateString() : '-'}</td>
                <td>{getSinifName(s.sinifId)}</td>
                <td>
                  <button onClick={() => { setSelectedStudentId(s.id); setPopupType('edit'); }} style={buttonStyle}>
                    Düzenle
                  </button>
                  <button onClick={() => { setSelectedStudentId(s.id); setPopupType('delete'); }} style={{ ...buttonStyle, backgroundColor: '#dc3545' }}>
                    Sil
                  </button>
                  <button onClick={() => { setSelectedStudentId(s.id); setPopupType('grades'); }} style={{ ...buttonStyle, backgroundColor: '#ffc107' }}>
                    Notları Görüntüle
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {popupType && (
        <PopupStudent
          type={popupType}
          studentId={selectedStudentId}
          closePopup={handleClosePopup}
          siniflar={siniflar}
        />
      )}
    </div>
  );
}

const buttonStyle = {
  padding: '6px 12px',
  marginRight: 8,
  borderRadius: 4,
  border: 'none',
  backgroundColor: '#007bff',
  color: 'white',
  cursor: 'pointer',
};

export default Student;
