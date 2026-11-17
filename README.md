# 📸 Pozia — Korean Studio Photobooth & Photo Strip Studio

Pozia adalah aplikasi web photobooth mobile-first bergaya studio Korea modern yang dapat diakses melalui browser, diinstall sebagai **Progressive Web App (PWA)** offline, dan di-build menjadi file **Android APK** otomatis melalui GitHub Actions.

---

## ✨ Fitur Utama
1. **16 Filter Studio Real-Time:**
   - *Beauty & Glow:* Seoul Glow, Peach Milk, Porcelain Clean, Golden Hour
   - *Analog & Digicam:* Kodak Gold, Fuji Film, 2000s Digicam, Night Neon 800T
   - *Monochrome & Retro:* Photobox B&W, Silver Cinema, Koran Vintage, Faded Print
   - *Mood & Artistic:* Dreamy Soft, Matcha Tone, Cyber Pop, Retro VHS
2. **Efek Lensa & Overlay:**
   - Light Leak flare
   - Procedural Film Grain
   - Fisheye Vignette
3. **5 Tema Bingkai (Frames):**
   - *Minimalist Studio:* Milk White, Matte Black, Sage Green, Baby Blue, Blush Pink + custom color picker.
   - *Vintage Newspaper:* Desain koran retro dengan header `"THE POZIA TIMES"`.
   - *Analog Film Roll:* Strip film bioskop hitam dengan lubang sproket & penomoran frame analog.
   - *Cute Doodle & Coquette:* Warna pastel, jahitan dashed border, pita & awan lucu.
   - *Custom PNG Overlay:* Upload twibbon / bingkai kustom berformat PNG transparan.
4. **4 Pilihan Format Layout:**
   - `Strip 4 Pose` (1x4 vertical classic photobox)
   - `Strip 3 Pose` (1x3 vertical)
   - `Grid 2x2` (Square collage)
   - `Polaroid` (Single classic wide-bottom)
5. **Auto-Capture & Kamera Pintar:**
   - Hitungan mundur otomatis (3s / 5s) per pose berurutan
   - Screen Flash 350ms warm-white untuk mencerahkan wajah
   - Flip kamera depan / belakang (mirror preview)
   - Audio shutter & countdown beep sintetis (Web Audio API, 100% offline)
   - Burst Behind-The-Scenes (BTS) frame capture untuk animasi loop
6. **Editor Interaktif:**
   - Drag & drop stiker lucu (pita, bintang, hati, kacamata, SLAY!, BESTIE, 2026)
   - Penggantian foto per slot (cukup tap foto yang ingin diganti/di-retake)
   - Cap tanggal analog (`'26 11 17`) & watermark studio
   - Export resolusi ultra tinggi (HD) via HTML5 Canvas
7. **Diagnostik Sistem & Privasi (Zero-Server):**
   - Telemetry WebRTC, HTTPS TLS context, hardware acceleration, dan ukuran penyimpanan lokal
   - 100% pemrosesan client-side di memori perangkat, privasi foto terjamin aman.
8. **Dukungan Bilingual:**
   - Tombol toggle `ID | EN` untuk beralih bahasa Indonesia & Inggris secara instan.

---

## 🚀 Deployment & Build APK

### 1. Progressive Web App (PWA)
Buka aplikasi di Google Chrome atau browser HP, lalu tekan tombol **"Install"** di banner bawah atau menu browser **"Tambahkan ke Layar Utama" / "Install App"** untuk menggunakannya persis seperti aplikasi APK asli (mendukung mode offline).

### 2. Otomatis Build APK via GitHub Actions
Repositori ini telah dilengkapi dengan `.github/workflows/build-apk.yml`. Setiap kali kode di-push ke GitHub:
1. GitHub Actions akan mengompilasi aplikasi web menjadi file **Android APK (`app-debug.apk`)** menggunakan Capacitor & Android SDK.
2. File APK yang sudah jadi dapat diunduh langsung di tab **Releases** atau **Actions > Artifacts** pada repositori GitHub Anda.
