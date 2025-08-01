import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Popup.css';
import ApiData from '../config.json';

const sabitSiniflar = [
  { id: 19, name: '9/A' },
  { id: 20, name: '9/B' },
  { id: 21, name: '9/C' },
  { id: 22, name: '10/A' },
  { id: 23, name: '10/B' },
  { id: 24, name: '10/C' },
  { id: 25, name: '11/A' },
  { id: 26, name: '11/B' },
  { id: 27, name: '11/C' },
  { id: 28, name: '12/A' },
  { id: 29, name: '12/B' },
  { id: 30, name: '12/C' },
];

function PopupStudent({ type, studentId, closePopup }) {
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [tc, setTc] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [sinifId, setSinifId] = useState('');

  useEffect(() => {
    if ((type === 'edit' || type === 'delete') && studentId) {
      axios.get(`${ApiData.API_URL}Ogrenci/${studentId}`)
        .then((res) => {
          const s = res.data.data || res.data;
          setFirstName(s?.firstName || '');
          setSurname(s?.surname || '');
          setTc(s?.tc || '');
          setPhone(s?.phone || '');
          setGender(s?.gender || '');
          setDateOfBirth(s?.dateOfBirth ? new Date(s.dateOfBirth) : null);
          setSinifId(s?.sinifId !== undefined && s?.sinifId !== null ? s.sinifId.toString() : '');
        })
        .catch(() => {
          alert('Öğrenci bilgisi alınamadı');
          closePopup();
        });
    } else if (type === 'add') {
      setFirstName('');
      setSurname('');
      setTc('');
      setPhone('');
      setGender('');
      setDateOfBirth(null);
      setSinifId('');
    }
  }, [type, studentId, closePopup]);

  const handleConfirm = () => {
    if ((type === 'add' || type === 'edit') &&
      (!firstName.trim() || !surname.trim() || !tc.trim() || !phone.trim() || !gender || !dateOfBirth || !sinifId)) {
      alert('Tüm alanları doldurun');
      return;
    }

    const payload = {
  firstName,
  surname,
  tc,
  phone,
  gender: gender.toLowerCase(), // backend 'erkek' ve 'kadın' küçük harf istiyor gibi
  dateOfBirth: dateOfBirth.toISOString().split('.')[0], // Backend tarih formatını kabul ediyorsa
  sinifId: Number(sinifId),  // sadece sinifId gönderiliyor
};


    let request;
    if (type === 'add') {
      request = axios.post(`${ApiData.API_URL}Ogrenci`, payload);
    } else if (type === 'edit') {
      request = axios.put(`${ApiData.API_URL}Ogrenci/${studentId}`, payload);
    } else if (type === 'delete') {
      request = axios.delete(`${ApiData.API_URL}Ogrenci/${studentId}`);
    } else {
      alert('Geçersiz işlem');
      return;
    }

    request
      .then(() => {
        const action = type === 'add' ? 'eklendi' : type === 'edit' ? 'güncellendi' : 'silindi';
        alert(`Öğrenci başarıyla ${action}.`);
        closePopup();
      })
      .catch(() => {
        alert('Sınıf Mevcudu Dolu');
      });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{type.toUpperCase()} Öğrenci</h3>

        {(type === 'add' || type === 'edit') && (
          <>
            <div className="form-group">
              <label>Ad</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Soyad</label>
              <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} />
            </div>

            <div className="form-group">
              <label>TC Kimlik No</label>
              <input type="text" value={tc} onChange={(e) => setTc(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Telefon</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Cinsiyet</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Seçiniz</option>
                <option value="Kadın">Kadın</option>
                <option value="Erkek">Erkek</option>
                <option value="Belirtmek İstemiyorum">Belirtmek İstemiyorum</option>
              </select>
            </div>

            <div className="form-group">
              <label>Doğum Tarihi</label>
              <DatePicker
                selected={dateOfBirth}
                onChange={(date) => setDateOfBirth(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Doğum Tarihi seçiniz"
                className="datepicker-input"
              />
            </div>

            <div className="form-group">
              <label>Sınıf</label>
              <select value={sinifId} onChange={(e) => setSinifId(e.target.value)}>
                <option value="">Sınıf Seç</option>
                {sabitSiniflar.map(s => (
                  <option key={s.id} value={s.id.toString()}>{s.name}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {type === 'delete' && (
          <p>Bu öğrenciyi silmek istediğinizden emin misiniz?</p>
        )}

        <div className="button-group">
          <button onClick={handleConfirm}>Onayla</button>
          <button onClick={closePopup}>İptal</button>
        </div>
      </div>
    </div>
  );
}

export default PopupStudent;
