# ❗ OKUYUN

- `appsettings.json` içindeki **Connection String** değerini kendi SQL Server kullanıcı adı ve şifrenize göre değiştirin.  
- Frontend için önce `npm install` yapmadan **npm start** çalışmaz.  
- Backend çalıştırmak için:  
  ```
  cd backend/okulprojesi
  dotnet run
  ```

---

# Okul Sistemi (Staj Projesi)

Bu proje bir **Okul Yönetim Sistemi**’dir.  
Teknolojiler: **SQL Server, C# Web API, React**.  
Veritabanı işlemleri **Stored Procedure** ile yapılır.  

### Özellikler
- Roller: **Müdür, Öğretmen, Öğrenci**
- Rol bazlı farklı ekranlar
- TC ile arama
- Not girişleri ve görüntüleme
- Ekleme, silme, güncelleme
- Şifreler backend’de **SHA256 ile hashlenir**
- ASP.NET Core API ↔ React arayüzü (JSON iletişim)

---

## Kurulum

### Backend (ASP.NET Core)
1. Klasöre gidin:
   ```
   cd backend/okulprojesi
   ```
2. `appsettings.json` → ConnectionStrings kısmını kendi SQL bilgilerinize göre değiştirin:
   ```json
   "ConnectionStrings": {
     "OkulDb": "Server=.;Database=OkulDb;User Id=SA;Password=YourPassword;TrustServerCertificate=True;"
   }
   ```
3. Çalıştırın:
   ```
   dotnet run
   ```

### Frontend (React)
1. Klasöre gidin:
   ```
   cd frontend
   ```
2. Paketleri yükleyin:
   ```
   npm install
   ```
3. Başlatın:
   ```
   npm start
   ```

---

## Kullanılan Teknolojiler
- **Backend:** ASP.NET Core, MSSQL, Stored Procedures  
- **Frontend:** React, Axios  
- **Veritabanı:** SQL Server  

---

## Not
- Sisteme 3 tip kullanıcı ile giriş yapılır: **Öğrenci, Öğretmen, Müdür**  
- Kullanıcı rolüne göre farklı sayfalar açılır.

<img width="1817" height="912" alt="Ekran görüntüsü 8" src="https://github.com/user-attachments/assets/280ea88f-3085-491d-976b-6b5bcb4d2e0e" />
