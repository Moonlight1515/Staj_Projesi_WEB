import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Popup.css'; // kendi stillerini ekleyebilirsin
import ApiData from '../config.json';

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
      axios
        .get(`${ApiData.API_URL}Ogrenci/${studentId}`)
        .then((res) => {
          const s = res.data.data || res.data;
          setFirstName(s?.firstName || '');
          setSurname(s?.surname || '');
          setTc(s?.tc || '');
          setPhone(s?.phone || '');
          setGender(s?.gender || '');
          setDateOfBirth(s?.dateOfBirth ? new Date(s.dateOfBirth) : null);
          setSinifId(s?.sinifId || '');
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
    if (
      (type === 'add' || type === 'edit') &&
      (!firstName.trim() || !surname.trim() || !tc.trim() || !phone.trim() || !gender.trim() || !dateOfBirth || !sinifId)
    ) {
      alert('Tüm alanları doldurun');
      return;
    }

    const payload = {
      firstName,
      surname,
      tc,
      phone,
      gender,
      dateOfBirth: dateOfBirth.toISOString(),
      sinifId: Number(sinifId)
    };

    let request;
    if (type === 'add') {
      request = axios.post(ApiData.API_URL + 'Ogrenci', payload);
    } else if (type === 'edit') {
      request = axios.put(ApiData.API_URL + `Ogrenci/${studentId}`, payload);
    } else if (type === 'delete') {
      request = axios.delete(ApiData.API_URL + `Ogrenci/${studentId}`);
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
        alert('İşlem sırasında hata oluştu');
      });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{type.toUpperCase()} Öğrenci</h3>

        {(type === 'add' || type === 'edit') && (
          <>
            <input
              type="text"
              placeholder="Ad"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoFocus
            />
            <input
              type="text"
              placeholder="Soyad"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
            <input
              type="text"
              placeholder="TC Kimlik No"
              value={tc}
              onChange={(e) => setTc(e.target.value)}
            />
            <input
              type="text"
              placeholder="Telefon"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              type="text"
              placeholder="Cinsiyet"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            />
            <DatePicker
              selected={dateOfBirth}
              onChange={(date) => setDateOfBirth(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Doğum Tarihi"
              className="datepicker-input"
            />
            <input
              type="number"
              placeholder="Sınıf ID"
              value={sinifId}
              onChange={(e) => setSinifId(e.target.value)}
            />
          </>
        )}

        {type === 'delete' && <p>Bu öğrenciyi silmek istediğinizden emin misiniz?</p>}

        <div className="button-group">
          <button onClick={handleConfirm}>Onayla</button>
          <button onClick={closePopup}>İptal</button>
        </div>
      </div>
    </div>
  );
}

export default PopupStudent;
