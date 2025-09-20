# Production Deployment Guide

## Masalah MIME Type yang Diperbaiki

Error: `Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "application/octet-stream"`

## Solusi yang Diterapkan

### 1. Konfigurasi Vite (vite.config.js)

```javascript
build: {
  // Ensure proper MIME types for production
  assetsInlineLimit: 0,
  cssCodeSplit: true,
  sourcemap: false,
}
```

### 2. File .htaccess untuk Apache

File: `frontend/dist/.htaccess`

- Mengatur MIME type yang benar untuk file JavaScript
- Menambahkan compression dan caching
- Menangani client-side routing
- Menambahkan security headers

### 3. Konfigurasi Nginx

File: `nginx.conf`

- Mengatur MIME type untuk .js dan .mjs files
- Menambahkan caching dan compression
- Menangani client-side routing

## Langkah Deployment

### Untuk Apache Server:

1. Build aplikasi: `npm run build`
2. Upload isi folder `dist/` ke web server
3. Pastikan file `.htaccess` ikut ter-upload
4. Restart Apache server

### Untuk Nginx Server:

1. Build aplikasi: `npm run build`
2. Upload isi folder `dist/` ke `/var/www/html/`
3. Copy konfigurasi dari `nginx.conf` ke server config
4. Reload Nginx: `nginx -s reload`

### Untuk Server Lain:

Pastikan server mengirim file JavaScript dengan MIME type:

- `.js` files: `application/javascript` atau `text/javascript`
- `.mjs` files: `application/javascript`

## Script Build Production

Gunakan script `build-production.sh` untuk build yang optimal:

```bash
cd frontend
./build-production.sh
```

## Troubleshooting

### Error CSP "connect-src" untuk Backend API:

Jika muncul error: `Refused to connect to 'http://192.168.169.12:3000/api/...' because it violates the following Content Security Policy directive: "connect-src 'self' https:"`

**Solusi:**

1. Pastikan backend URL ditambahkan ke `connect-src` di CSP
2. Untuk development: tambahkan `http://192.168.169.12:3000` dan `http://localhost:3000`
3. Untuk production: gunakan HTTPS URL backend

**Contoh CSP yang benar:**

```html
<meta
  http-equiv="Content-Security-Policy"
  content="
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https: http://192.168.169.12:3000 http://localhost:3000;
  frame-src 'self' https://challenges.cloudflare.com;
  default-src 'self';
"
/>
```

### Jika masih muncul error MIME type:

1. Periksa server logs untuk melihat MIME type yang dikirim
2. Pastikan file JavaScript tidak di-compress dengan gzip yang salah
3. Cek apakah ada proxy/CDN yang mengubah MIME type
4. Pastikan file .htaccess atau nginx config sudah aktif

### Test MIME Type:

```bash
curl -I https://yourdomain.com/assets/js/vendor-xxx.js
```

Response header harus menunjukkan:

```
Content-Type: application/javascript
```

## File yang Dibuat:

- `frontend/dist/.htaccess` - Konfigurasi Apache
- `nginx.conf` - Konfigurasi Nginx
- `frontend/build-production.sh` - Script build production
- `PRODUCTION_DEPLOYMENT.md` - Dokumentasi ini
