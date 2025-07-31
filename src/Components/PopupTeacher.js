import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Popup.css';
import ApiData from '../config.json';

function PopupTeacher({ type, teacherId, closePopup }) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [tc, setTc] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);

  useEffect(() => {
    if ((type === 'edit' || type === 'delete') && teacherId) {
      axios.get(`${ApiData.API_URL}Ogretmen/${teacherId}`)
        .then((res) => {
          const t = res.data.data;
          setName(t?.name || '');
          setSurname(t?.surname || '');
          setTc(t?.tc || '');
          setPhone(t?.phone || '');
          setEmail(t?.email || '');
          setDateOfBirth(t?.dateOfBirth ? new Date(t.dateOfBirth) : null);
        })
        .catch(() => {
          alert('Öğretmen bilgisi alınamadı');
          closePopup();
        });
    } else if (type === 'add') {
      setName('');
      setSurname('');
      setTc('');
      setPhone('');
      setEmail('');
      setDateOfBirth(null);
    }
  }, [type, teacherId, closePopup]);

  const handleConfirm = () => {
    if ((type === 'add' || type === 'edit') &&
        (!name || !surname || !tc || !phone || !email || !dateOfBirth)) {
      alert('Tüm alanları doldurun');
      return;
    }

    const payload = {
      name,
      surname,
      tc,
      phone,
      email,
      dateOfBirth: dateOfBirth.toISOString()
    };

    let request;
    if (type === 'add') {
      request = axios.post(`${ApiData.API_URL}Ogretmen`, payload);
    } else if (type === 'edit') {
      request = axios.put(`${ApiData.API_URL}Ogretmen/${teacherId}`, payload);
    } else if (type === 'delete') {
      request = axios.delete(`${ApiData.API_URL}Ogretmen/${teacherId}`);
    } else {
      alert('Geçersiz işlem');
      return;
    }

    request
      .then(() => {
        const action = type === 'add' ? 'eklendi' : type === 'edit' ? 'güncellendi' : 'silindi';
        alert(`Öğretmen başarıyla ${action}.`);
        closePopup();
      })
      .catch((err) => {
        console.error('İşlem hatası:', err);
        alert('İşlem sırasında hata oluştu');
      });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{type.toUpperCase()} Öğretmen</h3>

        {(type === 'add' || type === 'edit') && (
          <>
            <div className="form-group">
              <label>Ad</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
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
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
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
          </>
        )}

        {type === 'delete' && (
          <p>Bu öğretmeni silmek istediğinizden emin misiniz?</p>
        )}

        <div className="button-group">
          <button onClick={handleConfirm}>Onayla</button>
          <button onClick={closePopup}>İptal</button>
        </div>
      </div>
    </div>
  );
}

export default PopupTeacher;
