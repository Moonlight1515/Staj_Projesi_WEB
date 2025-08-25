import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Popup.css';
import ApiData from '../config.json';

const sabitSiniflar = [
  { id: 19, name: '9/A' }, { id: 20, name: '9/B' }, { id: 21, name: '9/C' },
  { id: 22, name: '10/A' }, { id: 23, name: '10/B' }, { id: 24, name: '10/C' },
  { id: 25, name: '11/A' }, { id: 26, name: '11/B' }, { id: 27, name: '11/C' },
  { id: 28, name: '12/A' }, { id: 29, name: '12/B' }, { id: 30, name: '12/C' },
];

const typeTitles = {
  add: "Öğrenci Ekle",
  edit: "Öğrenci Düzenle",
  delete: "Öğrenci Sil",
  grades: "Öğrenci Notları"
};

function PopupStudent({ type, studentId, closePopup }) {
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [tc, setTc] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [sinifId, setSinifId] = useState('');

  const [grades, setGrades] = useState([]);
  const [average, setAverage] = useState(0);
  const [karneTuru, setKarneTuru] = useState('');

  useEffect(() => {
    // Öğrenci bilgilerini çek
    if ((type === 'edit' || type === 'delete') && studentId) {
      axios.get(`${ApiData.API_URL}Ogrenci/${studentId}`)
        .then(res => {
          const s = res.data.data || res.data;
          setFirstName(s?.firstName || '');
          setSurname(s?.surname || '');
          setTc(s?.tc || '');
          setPhone(s?.phone || '');
          setGender(s?.gender || '');
          setDateOfBirth(s?.dateOfBirth ? new Date(s.dateOfBirth) : null);
          setSinifId(s?.sinifId ? s.sinifId.toString() : '');
        })
        .catch(() => {
          alert('Öğrenci bilgisi alınamadı');
          closePopup();
        });
    } else if (type === 'add') {
      setFirstName(''); setSurname(''); setTc(''); setPhone('');
      setGender(''); setDateOfBirth(null); setSinifId('');
    }

    // Notları çek
    if (studentId && type === 'grades') {
      axios.get(`${ApiData.API_URL}Ogrenci/${studentId}/notlar`)
        .then(res => {
          const data = res.data.data || [];
          setGrades(data);

          if (data.length > 0) {
            const ort = data.reduce((acc, g) => acc + (g.ortalama || 0), 0) / data.length;
            setAverage(ort.toFixed(2));
            if (ort >= 85) setKarneTuru('Taktir');
            else if (ort >= 70) setKarneTuru('Teşekkür');
            else if (ort >= 50) setKarneTuru('Geçti');
            else setKarneTuru('Kaldı');
          } else {
            setAverage(0);
            setKarneTuru('Kaldı');
          }
        })
        .catch(() => {
          setGrades([]);
          setAverage(0);
          setKarneTuru('Kaldı');
        });
    }
  }, [type, studentId, closePopup]);

  const handleConfirm = () => {
    if ((type === 'add' || type === 'edit') &&
        (!firstName || !surname || !tc || !phone || !gender || !dateOfBirth || !sinifId)) {
      alert('Tüm alanları doldurun');
      return;
    }

    const payload = {
      firstName, surname, tc, phone,
      gender: gender.toLowerCase(),
      dateOfBirth: dateOfBirth?.toISOString().split('T')[0],
      sinifId: Number(sinifId),
    };

    let request;
    if (type === 'add') request = axios.post(`${ApiData.API_URL}Ogrenci`, payload);
    else if (type === 'edit') request = axios.put(`${ApiData.API_URL}Ogrenci/${studentId}`, payload);
    else if (type === 'delete') request = axios.delete(`${ApiData.API_URL}Ogrenci/${studentId}`);
    else return alert('Geçersiz işlem');

    request
      .then(res => {
        alert(res.data.message);
        closePopup();
      })
      .catch(err => {
        const msg = err.response?.data?.message || "İşlem sırasında hata oluştu.";
        alert(msg);
      });
  }; // ✅ Eksik kapanış buradaydı

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        

        {(type === 'add' || type === 'edit') && (
          <>
            <div className="form-group"><label>Ad</label><input value={firstName} onChange={e => setFirstName(e.target.value)} /></div>
            <div className="form-group"><label>Soyad</label><input value={surname} onChange={e => setSurname(e.target.value)} /></div>
            <div className="form-group"><label>TC Kimlik No</label><input value={tc} onChange={e => setTc(e.target.value)} /></div>
            <div className="form-group"><label>Telefon</label><input value={phone} onChange={e => setPhone(e.target.value)} /></div>
            <div className="form-group">
              <label>Cinsiyet</label>
              <select value={gender} onChange={e => setGender(e.target.value)}>
                <option value="">Seçiniz</option>
                <option value="kadın">Kadın</option>
                <option value="erkek">Erkek</option>
                <option value="belirtmek istemiyorum">Belirtmek İstemiyorum</option>
              </select>
            </div>
            <div className="form-group">
              <label>Doğum Tarihi</label>
              <DatePicker selected={dateOfBirth} onChange={setDateOfBirth} dateFormat="yyyy-MM-dd" placeholderText="Doğum Tarihi seçiniz" />
            </div>
            <div className="form-group">
              <label>Sınıf</label>
              <select value={sinifId} onChange={e => setSinifId(e.target.value)}>
                <option value="">Sınıf Seç</option>
                {sabitSiniflar.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </>
        )}

        {type === 'delete' && <p>Bu öğrenciyi silmek istediğinizden emin misiniz?</p>}

        {type === 'grades' && (
          <div className="grades-section">
            <table>
              <thead>
                <tr>
                  <th>Branş</th>
                  <th>Öğretmen</th>
                  <th>Sınav1</th>
                  <th>Sınav2</th>
                  <th>Sözlü1</th>
                  <th>Sözlü2</th>
                  <th>Ortalama</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>
                {grades.length === 0 ? (
                  <tr><td colSpan="8" style={{ textAlign: 'center' }}>Not bulunamadı</td></tr>
                ) : grades.map(g => (
                  <tr key={g.id}>
                    <td>{g.bransAdi}</td>
                    <td>{g.ogretmenAdi} {g.ogretmenSoyadi}</td>
                    <td>{g.sinav1}</td>
                    <td>{g.sinav2}</td>
                    <td>{g.sozlu1}</td>
                    <td>{g.sozlu2}</td>
                    <td>{g.ortalama}</td>
                    <td>{g.durum}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p><strong>Dönem Sonu Ortalama:</strong> {average}</p>
            <p><strong>Karne Türü:</strong> {karneTuru}</p>
          </div>
        )}

        <div className="button-group">
          {(type === 'add' || type === 'edit' || type === 'delete') && (
            <button onClick={handleConfirm} className="btn-confirm">Onayla</button>
          )}
          <button onClick={closePopup} className="btn-cancel">Kapat</button>
        </div>
      </div>
    </div>
  );
}

export default PopupStudent;
