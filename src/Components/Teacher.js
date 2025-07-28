import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PopupTeacher from './PopupTeacher';
import ApiData from '../config.json';

function Teacher() {
  const [teachers, setTeachers] = useState([]);
  const [popupType, setPopupType] = useState(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [searchTC, setSearchTC] = useState('');

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(ApiData.API_URL + 'Ogretmen');
      setTeachers(res.data.data || []);
    } catch {
      setTeachers([]);
    }
  };

  const searchByTC = async () => {
    if (!searchTC.trim()) {
      fetchTeachers();
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

  useEffect(() => {
    fetchTeachers();
  }, [refreshFlag]);

  const handleClosePopup = () => {
    setPopupType(null);
    setSelectedTeacherId(null);
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
      <button onClick={searchByTC} style={{ marginRight: 8 }}>
        Ara
      </button>
      <button
        onClick={() => {
          setSearchTC('');
          fetchTeachers();
        }}
        style={{ marginRight: 8 }}
      >
        Temizle
      </button>

      <button onClick={() => setPopupType('add')} style={{ marginLeft: 16 }}>
        Öğretmen Ekle
      </button>

      <table border="1" cellPadding="5" style={{ marginTop: 10, borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Ad</th>
            <th>Soyad</th>
            <th>TC</th>
            <th>Telefon</th>
            <th>Email</th>
            <th>Doğum Tarihi</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {teachers.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>
                Kayıt bulunamadı
              </td>
            </tr>
          ) : (
            teachers.map((t) => (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td>{t.surname}</td>
                <td>{t.tc}</td>
                <td>{t.phone}</td>
                <td>{t.email}</td>
                <td>{t.dateOfBirth ? new Date(t.dateOfBirth).toLocaleDateString() : '-'}</td>
                <td>
                  <button
                    onClick={() => {
                      setSelectedTeacherId(t.id);
                      setPopupType('edit');
                    }}
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTeacherId(t.id);
                      setPopupType('delete');
                    }}
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {popupType && (
        <PopupTeacher
          type={popupType}
          teacherId={selectedTeacherId}
          closePopup={handleClosePopup}
        />
      )}
    </div>
  );
}

export default Teacher;
