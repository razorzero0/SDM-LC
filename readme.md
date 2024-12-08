# SDM-LC

SDM-LC adalah aplikasi sederhana yang dirancang untuk mempermudah pengelolaan sumber daya manusia (SDM) dan pengajuan cuti dalam sebuah organisasi. Aplikasi ini dibangun menggunakan stack **MERN** (MongoDB, Express.js, React, dan Node.js) yang memungkinkan pengelolaan data secara efisien serta memberikan antarmuka pengguna yang responsif.

## Fitur Utama

1. **Manajemen Data Karyawan**  
   Memungkinkan pengelolaan data karyawan termasuk autentikasi pengguna.

2. **Sistem Pengajuan Cuti**  
   Memberikan kemudahan bagi karyawan untuk mengajukan cuti dan mendapatkan persetujuan secara online.

3. **Antarmuka Pengguna yang Sederhana**  
   Aplikasi ini dirancang dengan antarmuka yang simple, memudahkan pengguna dalam mengakses dan mengelola informasi.

---

## Panduan Instalasi Menggunakan Docker

Ikuti langkah-langkah berikut untuk menjalankan aplikasi ini menggunakan Docker dengan terminal:

### 1. Clone Repository

```bash
git clone https://github.com/razorzero0/SDM-LC.git
```

### 2. Masuk ke Folder Proyek

```bash
cd SDM-LC
```

### 3. Bangun Docker Image

```bash
docker build .
```

### 4. Jalankan Aplikasi dengan Docker Compose

```bash
docker-compose up app-dev
```

### 5. Di terminal yang berbeda, masuk ke Container Backend

```bash
docker exec -it backend-dev /bin/sh
```

### 6. Reset Database

```bash
npm run refresh:db
```

### 7. Akses Aplikasi

Buka browser Anda dan akses aplikasi melalui URL:

```bash
http://localhost:3000
```

## Teknologi yang Digunakan

Aplikasi ini dibangun dengan menggunakan teknologi berikut:

-   **MongoDB**: Basis data NoSQL untuk menyimpan dan mengelola data karyawan serta cuti.
-   **Express.js**: Framework backend untuk membangun API yang cepat dan andal.
-   **React.js**: Library frontend untuk antarmuka pengguna yang dinamis dan responsif.
-   **Node.js**: Runtime JavaScript untuk menjalankan server aplikasi.
-   **Docker**: Teknologi container untuk mempermudah proses deployment dan menjalankan aplikasi di berbagai lingkungan.
