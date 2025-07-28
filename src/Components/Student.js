import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PopupStudent from './PopupStudent';
import ApiData from '../config.json';
import Button from 'react-bootstrap/Button';


function Student() {
  const [students, setStudents] = useState([]);
  const [popupType, setPopupType] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [searchTC, setSearchTC] = useState('');

  const fetchStudents = async () => {
    try {
      const res = await axios.get(ApiData.API_URL + 'Ogrenci');
      setStudents(res.data.data || []);
    } catch {
      setStudents([]);
    }
  };

  const searchByTC = async () => {
    if (!searchTC.trim()) {
      fetchStudents();
      return;
    }

    try {
      const res = await axios.get(`${ApiData.API_URL}Ogrenci/AraTc/${searchTC.trim()}`);
      if (res.data.status) {
        setStudents([res.data.data]);
      } else {
        setStudents([]);
        alert('TC ile eşleşen öğrenci bulunamadı');
      }
    } catch (error) {
      console.error('Arama hatası:', error);
      alert('TC ile eşleşen öğrenci bulunamadı');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [refreshFlag]);

  const handleClosePopup = () => {
    setPopupType(null);
    setSelectedStudentId(null);
    setRefreshFlag(!refreshFlag);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="TC ile ara"
        value={searchTC}
        onChange={(e) => setSearchTC(e.target.value)}
        style={{ marginRight: 8 }}
      />
      <Button variant="primary" onClick={searchByTC} style={{ marginRight: 8 }}>
  Ara
</Button>
<Button variant="secondary" onClick={() => { setSearchTC(''); fetchStudents(); }} style={{ marginRight: 8 }}>
  Temizle
</Button>

      

      <button onClick={() => setPopupType('add')} style={{ marginLeft: 16 }}>
        Öğrenci Ekle
      </button>

      <table border="1" cellPadding="5" style={{ marginTop: 10, borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Ad</th>
            <th>Soyad</th>
            <th>TC</th>
            <th>Telefon</th>
            <th>Cinsiyet</th>
            <th>Doğum Tarihi</th>
            <th>Sınıf ID</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center' }}>
                Kayıt bulunamadı
              </td>
            </tr>
          ) : (
            students.map((s) => (
              <tr key={s.id}>
                <td>{s.firstName}</td>
                <td>{s.surname}</td>
                <td>{s.tc}</td>
                <td>{s.phone}</td>
                <td>{s.gender}</td>
                <td>{s.dateOfBirth ? new Date(s.dateOfBirth).toLocaleDateString() : '-'}</td>
                <td>{s.sinifId}</td>
                <td>
                  <button onClick={() => { setSelectedStudentId(s.id); setPopupType('edit'); }}>
                    Düzenle
                  </button>
                  <button onClick={() => { setSelectedStudentId(s.id); setPopupType('delete'); }}>
                    Sil
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {popupType && (
        <PopupStudent type={popupType} studentId={selectedStudentId} closePopup={handleClosePopup} />
      )}
    </div>
  );
}

export default Student;
