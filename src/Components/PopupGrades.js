import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ApiData from '../config.json';

function PopupGrades({ teacherId, closePopup }) {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [grades, setGrades] = useState({ sinav1: 0, sinav2: 0, sozlu1: 0, sozlu2: 0 });
  const [loading, setLoading] = useState(true);
  const [bransId, setBransId] = useState(null);

  // Öğretmenin branşını al
  useEffect(() => {
    if (!teacherId) return;

    axios.get(`${ApiData.API_URL}Ogretmen/${teacherId}`)
      .then(res => {
        const data = res.data.data;
        if (data && data.bransId) setBransId(data.bransId);
        else setBransId(null);
      })
      .catch(err => {
        console.error('Öğretmen bilgisi alınamadı:', err);
        setBransId(null);
      });
  }, [teacherId]);

  // Öğrencileri al
  useEffect(() => {
    if (!teacherId) return;
    setLoading(true);

    axios.get(`${ApiData.API_URL}Ogrenci`)
      .then(res => {
        const liste = res.data.data || [];
        setStudents(liste);
        setLoading(false);
      })
      .catch(err => {
        console.error('Öğrenciler alınamadı:', err);
        setStudents([]);
        setLoading(false);
      });
  }, [teacherId]);

  // Seçilen öğrencinin notlarını al
  useEffect(() => {
    if (!selectedStudentId) return;
    setLoading(true);

    axios.get(`${ApiData.API_URL}Ogrenci/${selectedStudentId}/notlar`)
      .then(res => {
        const notlarArray = res.data.data || [];
        const data = notlarArray[0] || {};
        setGrades({
          sinav1: data.sinav1 ?? 0,
          sinav2: data.sinav2 ?? 0,
          sozlu1: data.sozlu1 ?? 0,
          sozlu2: data.sozlu2 ?? 0
        });
        setBransId(data.bransId ?? bransId);
        setLoading(false);
      })
      .catch(err => {
        console.warn('Notlar bulunamadı, sıfırlandı.', err);
        setGrades({ sinav1: 0, sinav2: 0, sozlu1: 0, sozlu2: 0 });
        setLoading(false);
      });
  }, [selectedStudentId]);

  const handleGradeChange = (alan, value) => {
    let val = Number(value);
    if (val < 0) val = 0;
    if (val > 100) val = 100;
    setGrades(prev => ({ ...prev, [alan]: val }));
  };

  const handleSave = async () => {
    if (!bransId || !selectedStudentId) {
      alert('Öğrenci veya branş bilgisi eksik.');
      return;
    }

    try {
      const dto = {
        ogrenciId: Number(selectedStudentId),
        ogretmenId: teacherId,
        bransId: bransId,
        sinav1: grades.sinav1,
        sinav2: grades.sinav2,
        sozlu1: grades.sozlu1,
        sozlu2: grades.sozlu2
      };

      await axios.post(`${ApiData.API_URL}Notlar/ekle`, dto);
      alert('Not başarıyla kaydedildi.');
      closePopup();
    } catch (err) {
      console.error('Not kaydetme hatası:', err);
      alert('Not kaydedilirken hata oluştu.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Öğrenci Notları</h3>

        {loading ? (
          <p>Yükleniyor...</p>
        ) : (
          <>
            <div style={{ marginBottom: '10px' }}>
              <label>Öğrenci Seç:</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                style={{ marginLeft: '10px' }}
              >
                <option value="">Seçiniz</option>
                {students.map(st => (
                  <option key={st.id} value={st.id}>
                    {st.firstName} {st.surname}
                  </option>
                ))}
              </select>
            </div>

            {selectedStudentId && (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th>Ad</th>
                    <th>Soyad</th>
                    <th>Sınav 1</th>
                    <th>Sınav 2</th>
                    <th>Sözlü 1</th>
                    <th>Sözlü 2</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{students.find(s => s.id === Number(selectedStudentId))?.firstName}</td>
                    <td>{students.find(s => s.id === Number(selectedStudentId))?.surname}</td>
                   {['sinav1', 'sinav2', 'sozlu1', 'sozlu2'].map(alan => (
  <td key={alan}>
    <input
      type="text"
      value={grades[alan]}
      onChange={(e) => {
        const val = e.target.value.replace(/\D/g, ''); // sadece rakam
        if (val === '' || (Number(val) >= 0 && Number(val) <= 100)) {
          setGrades(prev => ({ ...prev, [alan]: val }));
        }
      }}
      style={{ width: '60px' }}
    />
  </td>
))}

                  </tr>
                </tbody>
              </table>
            )}
          </>
        )}

        <div className="button-group" style={{ marginTop: 10 }}>
          <button
            onClick={handleSave}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              marginRight: '5px'
            }}
          >
            Kaydet
          </button>
          <button
            onClick={closePopup}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}

export default PopupGrades;
