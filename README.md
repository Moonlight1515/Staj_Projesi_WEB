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

<img width="1847" height="892" alt="Ekran görüntüsü 1" src="https://github.com/user-attachments/assets/3334a4c2-8879-4f5f-a7ea-b89fc017cece" />
<img width="1845" height="912" alt="Ekran görüntüsü 2" src="https://github.com/user-attachments/assets/ae9c8211-1c61-446d-a2a0-6d29006be93b" />
<img width="1843" height="912" alt="Ekran görüntüsü 3" src="https://github.com/user-attachments/assets/d1402172-23d3-4e39-a019-d001bdc6ba26" />
<img width="1847" height="913" alt="Ekran görüntüsü 4" src="https://github.com/user-attachments/assets/8089d358-c62d-4caf-807d-9270af960ac5" />
<img width="1846" height="913" alt="Ekran görüntüsü 5" src="https://github.com/user-attachments/assets/441a663d-b28f-4d6e-8db6-0eaaeaee8edb" />
<img width="1848" height="907" alt="Ekran görüntüsü 6" src="https://github.com/user-attachments/assets/3d3f5121-3edc-4b33-aadc-7146097e557d" />
<img width="1840" height="913" alt="Ekran görüntüsü 7" src="https://github.com/user-attachments/assets/28ea7949-1420-425f-acb4-c0dd03f53106" />
<img width="1817" height="912" alt="Ekran görüntüsü 8" src="https://github.com/user-attachments/assets/78cacc11-a2d8-4852-b917-415c43f9af13" />








