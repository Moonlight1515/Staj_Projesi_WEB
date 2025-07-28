import React, { useState, useEffect } from 'react';
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
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);

  useEffect(() => {
    if ((type === 'edit' || type === 'delete') && teacherId) {
      axios
        .get(`${ApiData.API_URL}Ogretmen/${teacherId}`)
        .then((res) => {
          const t = res.data;
          setName(t?.name || '');
          setSurname(t?.surname || '');
          setTc(t?.tc || '');
          setPhone(t?.phone || '');
          setEmail(t?.email || '');
          setGender(t?.gender || '');
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
      setGender('');
      setDateOfBirth(null);
    }
  }, [type, teacherId, closePopup]);

  const handleConfirm = () => {
    if ((type === 'add' || type === 'edit') &&
        (!name.trim() || !surname.trim() || !tc.trim() || !phone.trim() || !email.trim() || !dateOfBirth)) {
      alert('Tüm alanları doldurun');
      return;
    }

    const payload = {
      name,
      surname,
      tc,
      phone,
      email,
      gender,
      dateOfBirth: dateOfBirth.toISOString()
    };

    let request;
    if (type === 'add') {
      request = axios.post(ApiData.API_URL + 'Ogretmen', payload);
    } else if (type === 'edit') {
      request = axios.put(ApiData.API_URL + `Ogretmen/${teacherId}`, payload);
    } else if (type === 'delete') {
      request = axios.delete(ApiData.API_URL + `Ogretmen/${teacherId}`);
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
      .catch(() => {
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
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              <label>Ad</label>
            </div>
            <div className="form-group">
              <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} required />
              <label>Soyad</label>
            </div>
            <div className="form-group">
              <input type="text" value={tc} onChange={(e) => setTc(e.target.value)} required />
              <label>TC Kimlik No</label>
            </div>
            <div className="form-group">
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              <label>Telefon</label>
            </div>
            <div className="form-group">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <label>Email</label>
            </div>
            <div className="form-group">
              <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option value="">Cinsiyet Seçiniz</option>
                <option value="Kadın">Kadın</option>
                <option value="Erkek">Erkek</option>
                <option value="Belirtmek istemiyorum">Belirtmek istemiyorum</option>
              </select>
              <label>Cinsiyet</label>
            </div>
            <div className="form-group">
              <DatePicker
                selected={dateOfBirth}
                onChange={(date) => setDateOfBirth(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Doğum Tarihi"
                className="datepicker-input"
              />
              <label>Doğum Tarihi</label>
            </div>
          </>
        )}

        {type === 'delete' && <p>Bu öğretmeni silmek istediğinizden emin misiniz?</p>}

        <div className="button-group">
          <button onClick={handleConfirm}>Onayla</button>
          <button onClick={closePopup}>İptal</button>
        </div>
      </div>
    </div>
  );
}

export default PopupTeacher;
