  <!-- ======================================================== -->
  <!-- CORE JAVASCRIPT APPLICATION LOGIC                        -->
  <!-- ======================================================== -->
  <script>
    /* ===================================================
       1. SYNTHETIC SOUND ENGINE (WEB AUDIO API)
       =================================================== */
    const SoundEngine = {
      ctx: null,
      getAudioContext() {
        if (!this.ctx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) this.ctx = new AudioContext();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        return this.ctx;
      },
      playBeep(freq = 880, duration = 0.1) {
        try {
          const ctx = this.getAudioContext();
          if (!ctx) return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0.12, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + duration);
        } catch (e) { }
      },
      playShutter() {
        try {
          const ctx = this.getAudioContext();
          if (!ctx) return;
          const now = ctx.currentTime;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(140, now);
          osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.1);
        } catch (e) { }
      }
    };

    /* ===================================================
       1b. LAYOUT SLIDESHOW CONTROLLER (CROSSFADE IN SLOTS ONLY)
       =================================================== */
    const LayoutSlideshow = {
      activeSlide: 0,
      timer: null,
      totalSlides: 4,
      init() {
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => {
          this.next();
        }, 2800);
      },
      stop() {
        if (this.timer) {
          clearInterval(this.timer);
          this.timer = null;
        }
      },
      next() {
        const prev = this.activeSlide;
        this.activeSlide = (this.activeSlide + 1) % this.totalSlides;
        document.querySelectorAll(`.slot-slide-${prev}`).forEach(el => {
          el.classList.remove('opacity-100');
          el.classList.add('opacity-0');
        });
        document.querySelectorAll(`.slot-slide-${this.activeSlide}`).forEach(el => {
          el.classList.remove('opacity-0');
          el.classList.add('opacity-100');
        });
      }
    };

    /* ===================================================
       2. BILINGUAL I18N DICTIONARY (ID & EN)
       =================================================== */
    const I18N = {
      current: 'id',
      dict: {
        id: {
          // Nav & Global
          nav_home: 'Beranda',
          nav_frames: 'Koleksi Bingkai',
          nav_features: 'Fitur Studio',
          cta_start: 'Mulai Studio',
          history_title: 'Galeri Hasil Tersimpan',
          clear_history: 'Hapus Riwayat',
          diag_title: 'Diagnostik Sistem & Arsitektur',
          diag_close: 'Tutup',

          // Homepage Hero & Showcase
          hero_badge: 'Digital Creative Photobooth',
          hero_desc: 'Capture your moments, your way. Create beautiful photostrips with Pozia Studio.',
          cta_upload: 'Upload dari Galeri',
          try_times: 'Coba Times →',
          try_coquette: 'Coba Coquette →',
          try_denim: 'Coba Denim & Stars →',
          try_chrome: 'Coba Chrome →',
          try_arcade: 'Coba Arcade →',
          trust_frames: '20+ Bingkai Orisinal',
          trust_filters: '14 Filter Analog',
          trust_download: 'Unduh Ultra HD 300DPI',
          trust_privacy: '100% Privasi di Peramban',
          showcase_badge: 'Koleksi Kreatif',
          showcase_title: 'Koleksi Bingkai Tematik Original',
          showcase_desc: 'Setiap bingkai memiliki karakter, palet warna, dan detail artistik orisinal dari Pozia Studio untuk melengkapi momen istimewa Anda.',
          showcase_btn: 'Buka Semua Bingkai',

          // Showcase Frame Cards
          frame_denim_cat: 'Scrapbook & Stars',
          frame_denim_desc: 'Kain corduroy navy & aksesoris 3D pin',
          frame_times_cat: 'Retro Editorial',
          frame_times_desc: 'Gaya koran vintage & tipografi klasik',
          frame_chrome_cat: 'Y2K Cyber',
          frame_chrome_desc: 'Efek chrome cair & bintang futuristik',
          frame_arcade_cat: 'Arcade Gaming',
          frame_arcade_desc: 'Layar CRT neon retro & pixel font',
          frame_ribbon_cat: 'Romantic Pastel',
          frame_ribbon_desc: 'Aksen pita satin & palet blush manis',
          frame_lemon_cat: 'Summer Holiday',
          frame_lemon_desc: 'Nuansa cerah Mediterania & garis biru',
          frame_tarot_cat: 'Magical & Tarot',
          frame_tarot_desc: 'Aksen midnight navy & emas mistis',
          frame_film_cat: 'Analog Contact',
          frame_film_desc: 'Lubang sprocket film asli & angka strip',

          // Features Section
          features_badge: 'Kualitas Profesional',
          features_title: 'Fitur Studio Photobooth',
          features_desc: 'Semua yang Anda butuhkan untuk menghasilkan cetakan foto photobooth berkualitas studio.',
          feat1_title: '14 Filter Film Analog Nyata',
          feat1_desc: 'Preset warna vintage, retro 90s, moody noir, hingga dreamy fairy dengan grading warna nyata yang tampak di kamera langsung, review foto, dan download akhir.',
          feat2_title: 'Viewfinder & Mirror Pintar',
          feat2_desc: 'Mirror flip realistis, screen flash lembut, timer hitung mundur 3s/5s, dan kemudahan mengganti lensa kamera depan maupun belakang pada smartphone Anda.',
          feat3_title: 'Ekspor Ultra HD & 100% Privat',
          feat3_desc: 'Unduh hasil strip foto beresolusi tinggi (> 1400px) siap cetak tanpa watermark. Seluruh foto diproses secara privat di peramban Anda tanpa dikirim ke server.',
          footer_home: 'Beranda',
          footer_frames: 'Bingkai',
          footer_features: 'Fitur',
          footer_top: 'Ke Atas',
          footer_copyright: '© 2026 Pozia Studio. All rights reserved. Creative digital photobooth experience.',

          // Setup Stage
          setup_back: 'Kembali ke Beranda',
          setup_step_badge: 'TAHAP 1: PILIH JUMLAH FOTO',
          setup_badge: 'Photobooth Layout',
          setup_title: 'Pilih Layout & Jumlah Foto',
          setup_subtitle: 'Tentukan berapa banyak pose yang ingin Anda ambil dalam satu sesi. Desain bingkai visual bebas dipilih dari seluruh koleksi setelah sesi foto selesai.',
          layout_1x4_title: 'Strip 4 Pose',
          layout_1x4_sub: '4x Cekrek Vertikal',
          layout_1x3_title: 'Strip 3 Pose',
          layout_1x3_sub: '3x Cekrek Lapang',
          layout_1x2_title: 'Strip 2 Pose',
          layout_1x2_sub: '2x Cekrek Cepat',
          layout_2x2_title: 'Grid 2×2',
          layout_2x2_sub: '4 Foto Kolase Persegi',
          layout_polaroid_title: 'Polaroid',
          layout_polaroid_sub: '1 Pose Portrait Klasik',
          setup_timer_label: '⏱ Timer:',
          setup_flash_label: '💡 Screen Flash:',
          flash_white: 'Putih',
          flash_warm: 'Warm',
          flash_off: 'Mati',
          setup_shutter_label: '🔊 Shutter:',
          setup_shutter_status: 'Suara Kamera Aktif',
          setup_gallery_btn: 'Pilih dari Galeri',

          // Camera Stage
          back_btn: 'Kembali',
          cam_switch_text: 'Ganti Lensa',
          camera_settings: 'Kontrol Kamera',
          timer_label: 'Timer Countdown:',
          flash_color: 'Screen Flash Warna:',
          zoom_label: 'Digital Zoom:',
          exposure_label: 'Exposure / Kecerahan:',
          upload_label: 'Upload',
          review_label: 'Review',
          cam_error_title: 'Akses Kamera Ditolak / Tidak Tersedia',
          cam_error: 'Kamera tidak dapat diakses atau diblokir. Anda tetap bisa upload foto dari galeri!',
          cam_upload_btn: 'Upload Foto dari Galeri',

          // Review Stage
          review_back: 'Kembali ke Kamera',
          review_title: 'Pratinjau Hasil Pemotretan',
          review_subtitle: 'Periksa foto Anda, terapkan filter analog, atau ambil ulang pose tertentu.',
          review_filter_label: 'Pilih Filter Analog:',
          review_retake_all: 'Foto Ulang Semua',
          review_proceed: 'Lanjut Pilih Desain Frame',

          // Editor Stage
          editor_slot_hint: 'Klik slot foto untuk mengganti',
          editor_back: 'Review',
          editor_reset: 'Reset',
          tab_frame: 'Bingkai',
          tab_filter: 'Filter',
          random_vibe: 'Acak Vibe',
          done_btn: 'Selesai',
          editor_format_label: 'Format Layout:',
          cat_all: 'Semua',
          cat_gaming: 'Gaming',
          cat_scrapbook: 'Scrapbook',
          cat_cyber: 'Y2K Cyber',
          cat_comic: 'Pop Comic',
          cat_music: 'Music',
          cat_summer: 'Summer',
          cat_retro: 'Retro',
          cat_fantasy: 'Magical',
          cat_solid: 'Minimalist',
          upload_custom_frame: 'Upload Custom Twibbon PNG',
          filter_heading: '14 Preset Filter Analog & Film:',
          intensity: 'Intensitas Filter:',
          fine_brightness: 'Fine Brightness:',
          fine_contrast: 'Fine Contrast:',

          // Export Stage
          export_title: 'Foto Selesai Dirender!',
          export_desc: 'Komposisi photobooth Anda telah berhasil diproses dalam resolusi ultra tinggi (> 1400px) siap untuk disimpan atau dicetak.',
          hold_save_hint: 'Tips: Jika download otomatis terhambat di HP/WebView, tekan dan tahan gambar di atas untuk "Simpan ke Galeri".',
          bts_title: 'Behind-The-Scenes HD Video',
          bts_desc: 'Momen hitungan mundur sebelum cekrek (HD 720p)',
          save_bts: 'Simpan Video BTS HD (WebM / Video)',
          download_hd: 'Simpan Foto Ultra HD (PNG)',
          edit_again: 'Edit Ulang',
          new_session: 'Buat Foto Baru'
        },
        en: {
          // Nav & Global
          nav_home: 'Home',
          nav_frames: 'Frames Collection',
          nav_features: 'Studio Features',
          cta_start: 'Start Studio',
          history_title: 'Saved History Gallery',
          clear_history: 'Clear History',
          diag_title: 'System & Architecture Diagnostics',
          diag_close: 'Close',

          // Homepage Hero & Showcase
          hero_badge: 'Digital Creative Photobooth',
          hero_desc: 'Capture your moments, your way. Create beautiful photostrips with Pozia Studio.',
          cta_upload: 'Upload from Gallery',
          try_times: 'Try Times →',
          try_coquette: 'Try Coquette →',
          try_denim: 'Try Denim & Stars →',
          try_chrome: 'Try Chrome →',
          try_arcade: 'Try Arcade →',
          trust_frames: '20+ Original Frames',
          trust_filters: '14 Analog Filters',
          trust_download: 'Ultra HD 300DPI Download',
          trust_privacy: '100% Client-Side Privacy',
          showcase_badge: 'Creative Collection',
          showcase_title: 'Original Themed Frame Collection',
          showcase_desc: 'Each frame features original character, color palette, and artistic details from Pozia Studio to elevate your special moments.',
          showcase_btn: 'Browse All Frames',

          // Showcase Frame Cards
          frame_denim_cat: 'Scrapbook & Stars',
          frame_denim_desc: 'Navy corduroy fabric & 3D pin accessories',
          frame_times_cat: 'Retro Editorial',
          frame_times_desc: 'Vintage newspaper style & classic typography',
          frame_chrome_cat: 'Y2K Cyber',
          frame_chrome_desc: 'Liquid chrome effect & futuristic stars',
          frame_arcade_cat: 'Arcade Gaming',
          frame_arcade_desc: 'Retro neon CRT screen & pixel font',
          frame_ribbon_cat: 'Romantic Pastel',
          frame_ribbon_desc: 'Satin ribbon accents & sweet blush palette',
          frame_lemon_cat: 'Summer Holiday',
          frame_lemon_desc: 'Sunny Mediterranean vibe & coastal stripes',
          frame_tarot_cat: 'Magical & Tarot',
          frame_tarot_desc: 'Midnight navy & mystical gold accents',
          frame_film_cat: 'Analog Contact',
          frame_film_desc: 'Authentic sprocket film holes & strip count',

          // Features Section
          features_badge: 'Professional Quality',
          features_title: 'Studio Photobooth Features',
          features_desc: 'Everything you need to produce studio-quality photobooth prints.',
          feat1_title: '14 Real Analog Film Filters',
          feat1_desc: 'Vintage, 90s retro, moody noir, to dreamy fairy presets with real color grading visible on live camera, photo review, and final download.',
          feat2_title: 'Smart Viewfinder & Mirror',
          feat2_desc: 'Realistic mirror flip, soft screen flash, 3s/5s countdown timer, and seamless front/rear camera switching on your device.',
          feat3_title: 'Ultra HD Export & 100% Private',
          feat3_desc: 'Download high-resolution photostrips (> 1400px) ready to print without watermarks. All photos are processed privately in your browser without uploading to a server.',
          footer_home: 'Home',
          footer_frames: 'Frames',
          footer_features: 'Features',
          footer_top: 'Back to Top',
          footer_copyright: '© 2026 Pozia Studio. All rights reserved. Creative digital photobooth experience.',

          // Setup Stage
          setup_back: 'Back to Home',
          setup_step_badge: 'STEP 1: SELECT NUMBER OF PHOTOS',
          setup_badge: 'Photobooth Layout',
          setup_title: 'Choose Layout & Photo Count',
          setup_subtitle: 'Decide how many poses you want to capture in one session. Frame designs can be freely chosen from the entire collection once the shoot is complete.',
          layout_1x4_title: 'Strip 4 Poses',
          layout_1x4_sub: '4x Vertical Snaps',
          layout_1x3_title: 'Strip 3 Poses',
          layout_1x3_sub: '3x Roomy Snaps',
          layout_1x2_title: 'Strip 2 Poses',
          layout_1x2_sub: '2x Quick Snaps',
          layout_2x2_title: 'Grid 2×2',
          layout_2x2_sub: '4 Square Collage Photos',
          layout_polaroid_title: 'Polaroid',
          layout_polaroid_sub: '1 Classic Portrait Pose',
          setup_timer_label: '⏱ Timer:',
          setup_flash_label: '💡 Screen Flash:',
          flash_white: 'White',
          flash_warm: 'Warm',
          flash_off: 'Off',
          setup_shutter_label: '🔊 Shutter:',
          setup_shutter_status: 'Camera Sound Active',
          setup_gallery_btn: 'Upload from Gallery',

          // Camera Stage
          back_btn: 'Back',
          cam_switch_text: 'Switch Lens',
          camera_settings: 'Camera Controls',
          timer_label: 'Countdown Timer:',
          flash_color: 'Screen Flash Color:',
          zoom_label: 'Digital Zoom:',
          exposure_label: 'Exposure / Brightness:',
          upload_label: 'Upload',
          review_label: 'Review',
          cam_error_title: 'Camera Access Denied / Unavailable',
          cam_error: 'Camera access denied or unavailable. You can still upload photos from gallery!',
          cam_upload_btn: 'Upload Photos from Gallery',

          // Review Stage
          review_back: 'Back to Camera',
          review_title: 'Review Photo Shots',
          review_subtitle: 'Inspect your photos, apply analog filters, or retake specific poses.',
          review_filter_label: 'Select Analog Filter:',
          review_retake_all: 'Retake All Photos',
          review_proceed: 'Continue to Frame Design',

          // Editor Stage
          editor_slot_hint: 'Click photo slot to replace',
          editor_back: 'Review',
          editor_reset: 'Reset',
          tab_frame: 'Frame',
          tab_filter: 'Filter',
          random_vibe: 'Random Vibe',
          done_btn: 'Finish',
          editor_format_label: 'Layout Format:',
          cat_all: 'All',
          cat_gaming: 'Gaming',
          cat_scrapbook: 'Scrapbook',
          cat_cyber: 'Y2K Cyber',
          cat_comic: 'Pop Comic',
          cat_music: 'Music',
          cat_summer: 'Summer',
          cat_retro: 'Retro',
          cat_fantasy: 'Magical',
          cat_solid: 'Minimalist',
          upload_custom_frame: 'Upload Custom Twibbon PNG',
          filter_heading: '14 Analog & Film Filter Presets:',
          intensity: 'Filter Intensity:',
          fine_brightness: 'Fine Brightness:',
          fine_contrast: 'Fine Contrast:',

          // Export Stage
          export_title: 'Photo Successfully Rendered!',
          export_desc: 'Your photobooth composition is rendered in sharp ultra-high resolution (> 1400px) ready to save or print.',
          hold_save_hint: 'Tips: If automatic download is blocked in mobile WebView, press and hold the image above to save to gallery.',
          bts_title: 'Behind-The-Scenes HD Video',
          bts_desc: 'Countdown moments before each snap (HD 720p)',
          save_bts: 'Save BTS HD Video (WebM / Video)',
          download_hd: 'Save Ultra HD Photo (PNG)',
          edit_again: 'Edit Again',
          new_session: 'New Session'
        }
      },
      apply(lang) {
        this.current = lang;
        try { localStorage.setItem('pozia_lang', lang); } catch (e) { }
        const texts = this.dict[lang] || this.dict.id;
        document.querySelectorAll('[data-i18n]').forEach(el => {
          const key = el.getAttribute('data-i18n');
          if (texts[key] !== undefined) el.textContent = texts[key];
        });
        const btn = document.getElementById('lang-btn');
        if (btn) btn.textContent = lang === 'id' ? 'ID | EN' : 'EN | ID';
        if (window.App && typeof App.updateSetupUI === 'function') {
          App.updateSetupUI();
        }
      }
    };

    /* ===================================================
       3. 14 BOLD, DISTINCT, VIBRANT ANALOG FILTERS
       =================================================== */
    const FilterPresets = [
      { id: 'original', name: 'Original', css: 'none', desc: 'Asli tanpa filter' },
      { id: 'vintage', name: 'Vintage', css: 'sepia(0.65) contrast(1.25) brightness(0.92) saturate(1.35)', desc: 'Hangat & bernuansa 70-an' },
      { id: 'retro', name: 'Retro 90s', css: 'contrast(1.35) saturate(1.6) hue-rotate(-18deg) brightness(1.02)', desc: 'Warna pop kamera analog' },
      { id: 'warm', name: 'Warm Honey', css: 'sepia(0.4) saturate(1.45) brightness(1.1) hue-rotate(-12deg)', desc: 'Nuansa madu & golden hour' },
      { id: 'cool', name: 'Cool Mist', css: 'saturate(1.15) hue-rotate(30deg) brightness(1.05) contrast(1.18)', desc: 'Nuansa biru dingin segar' },
      { id: 'soft', name: 'Soft Velvet', css: 'contrast(0.85) brightness(1.18) saturate(1.15)', desc: 'Lembut, cerah & halus' },
      { id: 'film', name: 'Film 35mm', css: 'contrast(1.4) brightness(0.9) saturate(1.3) sepia(0.28) hue-rotate(-8deg)', desc: 'Film stock kontras tajam' },
      { id: 'bw', name: 'B&W Classic', css: 'grayscale(1) contrast(1.5) brightness(1.05)', desc: 'Hitam putih dramatis' },
      { id: 'sepia', name: 'Sepia Antique', css: 'sepia(1) contrast(1.2) brightness(0.88) hue-rotate(-15deg)', desc: 'Cokelat antik nostalgia' },
      { id: 'dreamy', name: 'Dreamy Fairy', css: 'brightness(1.22) contrast(0.92) saturate(1.5) hue-rotate(8deg)', desc: 'Glowing & bernuansa fantasi' },
      { id: 'bright', name: 'Bright Studio', css: 'brightness(1.25) contrast(1.22) saturate(1.4)', desc: 'High-key cerah studio Jepang' },
      { id: 'moody', name: 'Moody Noir', css: 'brightness(0.75) contrast(1.6) saturate(1.25) sepia(0.2)', desc: 'Sinematik gelap berkarakter' },
      { id: 'pastel', name: 'Pastel Candy', css: 'brightness(1.15) contrast(0.95) saturate(1.3) hue-rotate(-25deg)', desc: 'Rona pink manis & lembut' },
      { id: 'faded', name: 'Faded 70s', css: 'contrast(0.78) brightness(1.18) saturate(0.65) sepia(0.4)', desc: 'Warna pudar cetakan lama' }
    ];

    /* ===================================================
       4. 20 ORIGINAL THEMATIC DESIGNER FRAMES
       =================================================== */
    const FrameThemes = [
      // Gaming & Arcade
      { id: 'pixel-arcade', cat: 'gaming', name: '8-Bit Arcade 1984', desc: 'CRT Neon & Pixel Score', thumb: 'linear-gradient(135deg, #100C2A, #281B4B)' },
      { id: 'retro-gameboy', cat: 'gaming', name: 'GameBoy Retro', desc: 'Olive LCD & Matte Body', thumb: 'linear-gradient(135deg, #D4D3C5, #9EA088)' },

      // Scrapbook & Sticker
      { id: 'denim-stars', cat: 'scrapbook', name: 'Denim & Stars', desc: 'Navy Corduroy & Chrome Pozia', thumb: '#1E2436' },
      { id: 'washi-botanical', cat: 'scrapbook', name: 'Botanical Herbarium', desc: 'Pressed Flora & Washi Tape', thumb: 'linear-gradient(135deg, #F5ECE1, #E8DACB)' },
      { id: 'coquette-ribbon', cat: 'scrapbook', name: 'Coquette Ribbon', desc: 'Blush Pink & Satin Bows', thumb: 'linear-gradient(135deg, #FFE8EE, #FFD0DD)' },

      // Y2K & Cyber
      { id: 'cyber-liquid-chrome', cat: 'cyber', name: 'Liquid Chrome', desc: 'Mercury Drips & Cyber Star', thumb: 'linear-gradient(135deg, #E2E8F0, #94A3B8)' },
      { id: 'hologram-cd', cat: 'cyber', name: '2000s CD Hologram', desc: 'Prismatic Laser CD Flare', thumb: 'linear-gradient(135deg, #C7D2FE, #FBCFE8, #BAE6FD)' },

      // Comic & Cartoon
      { id: 'pop-art-comic', cat: 'comic', name: 'Pop Art Comic', desc: 'Halftone Dots & POW! Burst', thumb: 'linear-gradient(135deg, #FFF9D2, #FDE047)' },
      { id: 'pastel-doodle-diary', cat: 'comic', name: 'Doodle Journal', desc: 'Grid Notebook & Cute Sketch', thumb: 'linear-gradient(135deg, #F8FAFC, #E2E8F0)' },

      // Music & Concert
      { id: 'mixtape-cassette', cat: 'music', name: '90s Retro Mixtape', desc: 'Cassette Reels & Sound Waves', thumb: 'linear-gradient(135deg, #2D3748, #1A202C)' },
      { id: 'vip-backstage', cat: 'music', name: 'VIP Concert Pass', desc: 'All Access Holographic Laminate', thumb: 'linear-gradient(135deg, #7C3AED, #DB2777)' },

      // Summer & Holiday
      { id: 'amalfi-lemon', cat: 'summer', name: 'Amalfi Lemon', desc: 'Sunny Citrus & Azure Trim', thumb: 'linear-gradient(135deg, #FFFDEB, #FEF08A)' },
      { id: 'sunset-beach-club', cat: 'summer', name: 'Sunset Beach Club', desc: 'Golden Hour Aura & Palms', thumb: 'linear-gradient(135deg, #FB923C, #F43F5E, #FDE047)' },

      // Retro & Vintage
      { id: 'the-pozia-times', cat: 'retro', name: 'The Pozia Times', desc: 'Vintage Editorial Newsprint', thumb: '#F4ECD8' },
      { id: 'film-contact-sheet', cat: 'retro', name: '35mm Film Sheet', desc: 'Analog Sprocket Holes & Numbers', thumb: '#121214' },

      // Fantasy & Magical
      { id: 'celestial-tarot', cat: 'fantasy', name: 'Celestial Tarot', desc: 'Midnight Gold Foil & Moon', thumb: 'linear-gradient(135deg, #0F172A, #1E1B4B)' },
      { id: 'angelic-clouds', cat: 'fantasy', name: 'Angelic Clouds', desc: 'Dreamy Lavender & Angel Wings', thumb: 'linear-gradient(135deg, #F3E8FF, #FCE7F3)' },

      // Minimalist & Custom
      { id: 'classic-white', cat: 'solid', name: 'Classic Studio White', desc: 'Minimalist Editorial White', thumb: '#FFFFFF' },
      { id: 'noir-minimal', cat: 'solid', name: 'Darkroom Noir', desc: 'Pitch Black & Crisp Serif', thumb: '#18181B' },
      { id: 'custom-png', cat: 'solid', name: 'Upload Twibbon PNG', desc: 'Bingkai Custom Transparan', thumb: '#F3F4F6' }
    ];

    /* ===================================================
       5. CORE APPLICATION STATE
       =================================================== */
    const State = {
      stage: 'home',             // 'home', 'setup', 'camera', 'review', 'editor', 'export'
      layout: '1x4',             // '1x4', '1x3', '2x2', 'polaroid'
      targetPoseCount: 4,        // 4, 3, 4, 1
      currentPoseIndex: 0,
      photos: [],                // Array of raw Image elements
      btsBurstGroups: [],
      currentFilter: FilterPresets[0], // Original default
      filterIntensity: 100,
      manualAdjust: { brightness: 0, contrast: 0 },
      frameTheme: 'pixel-arcade',
      frameCategory: 'all',
      frameColor: '#FFFFFF',
      customFrameImage: null,
      activeSlotToReplace: null,
      isRetakingSingle: false,
      lastRenderTime: 0
    };

    /* ===================================================
       6. CAMERA STUDIO CONTROLLER
       =================================================== */
    const CameraStudio = {
      stream: null,
      facingMode: 'user',        // 'user' (front) or 'environment' (back)
      isMirrored: true,          // Mirror horizontal flip (default ON)
      timerDuration: 3,
      flashColor: 'white',
      zoomLevel: 1.0,
      exposureVal: 0,
      isCapturingSequence: false,
      _dropdownListenersAttached: false,

      toggleSettingsDropdown() {
        const dd = document.getElementById('camera-settings-dropdown');
        if (dd) dd.classList.toggle('hidden');
      },

      closeSettingsDropdown() {
        const dd = document.getElementById('camera-settings-dropdown');
        if (dd) dd.classList.add('hidden');
      },

      setupDropdownListeners() {
        if (this._dropdownListenersAttached) return;
        this._dropdownListenersAttached = true;
        document.addEventListener('click', (e) => {
          const dd = document.getElementById('camera-settings-dropdown');
          const toggleBtn = document.getElementById('cam-settings-toggle-btn');
          if (!dd || dd.classList.contains('hidden')) return;
          if (!dd.contains(e.target) && !toggleBtn.contains(e.target)) {
            dd.classList.add('hidden');
          }
        });
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            this.closeSettingsDropdown();
          }
        });
      },

      async init() {
        this.closeSettingsDropdown();
        this.setupDropdownListeners();
        this.updatePoseCounter();
        this.renderFilterDock();
        await this.checkAvailableCameras();
        await this.startStream();
      },

      async checkAvailableCameras() {
        try {
          if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter(d => d.kind === 'videoinput');
          const switchBtn = document.getElementById('cam-switch-btn');
          if (videoDevices.length > 1) {
            if (switchBtn) switchBtn.classList.remove('hidden');
          } else {
            if (switchBtn) switchBtn.classList.add('hidden');
          }
        } catch (e) { }
      },

      async startStream() {
        try {
          if (this.stream) {
            this.stream.getTracks().forEach(t => t.stop());
          }
          const constraints = {
            video: {
              facingMode: { ideal: this.facingMode },
              width: { ideal: 1920 },
              height: { ideal: 1080 }
            },
            audio: false
          };
          this.stream = await navigator.mediaDevices.getUserMedia(constraints);
          const video = document.getElementById('live-video');
          video.srcObject = this.stream;
          await video.play();
          document.getElementById('camera-fallback-msg').classList.add('hidden');

          this.applyVideoTransform();
        } catch (err) {
          console.warn('Camera access error:', err);
          document.getElementById('camera-fallback-msg').classList.remove('hidden');
        }
      },

      stopStream() {
        this.closeSettingsDropdown();
        if (this.stream) {
          this.stream.getTracks().forEach(t => t.stop());
          this.stream = null;
        }
      },

      toggleMirror() {
        this.isMirrored = !this.isMirrored;
        this.applyVideoTransform();
        this.updateMirrorLabels();
      },

      updateMirrorLabels() {
        const topText = document.getElementById('mirror-status-text');
        const topBtn = document.getElementById('cam-mirror-btn');
        const label = this.isMirrored ? 'Mirror ON' : 'Mirror OFF';
        if (topText) topText.textContent = label;

        if (this.isMirrored) {
          if (topBtn) topBtn.className = 'flex-1 py-1.5 px-3 rounded-full bg-pozia-coral text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all';
        } else {
          if (topBtn) topBtn.className = 'flex-1 py-1.5 px-3 rounded-full bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all';
        }
      },

      async switchFacingMode() {
        this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
        this.isMirrored = (this.facingMode === 'user');
        this.updateMirrorLabels();
        await this.startStream();
      },

      handleBack() {
        if (State.photos.length > 0) {
          if (confirm('Sesi foto saat ini belum disimpan. Apakah Anda yakin ingin kembali ke pengaturan? Foto yang sudah diambil akan direset.')) {
            App.resetAndNew();
            App.navigate('setup');
          }
        } else {
          this.stopStream();
          App.navigate('setup');
        }
      },

      setTimer(sec) {
        this.timerDuration = sec;
        [0, 3, 5, 10].forEach(s => {
          const btn = document.getElementById(`cam-timer-${s}`);
          if (btn) {
            btn.className = s === sec
              ? 'py-1.5 rounded-full bg-pozia-coral text-white font-bold text-center text-xs shadow-sm transition-all'
              : 'py-1.5 rounded-full bg-white/10 text-gray-300 hover:bg-white/15 font-bold text-center text-xs transition-all';
          }
          const sBtn = document.getElementById(`setup-timer-${s}`);
          if (sBtn) {
            sBtn.className = s === sec
              ? 'px-2.5 py-1 rounded-md font-bold text-[11px] bg-white text-pozia-coral shadow-xs'
              : 'px-2.5 py-1 rounded-md font-semibold text-[11px] text-stone-600 hover:text-pozia-coral';
          }
        });
      },

      setFlashColor(col) {
        this.flashColor = col;
        ['white', 'peach', 'warm', 'pink', 'off'].forEach(c => {
          const btn = document.getElementById(`flash-color-${c}`);
          if (btn) {
            btn.className = c === col
              ? 'py-1.5 rounded-full bg-pozia-coral text-white font-bold text-center text-xs shadow-sm transition-all'
              : 'py-1.5 rounded-full bg-white/10 text-gray-300 hover:bg-white/15 font-bold text-center text-xs transition-all';
          }
          const sBtn = document.getElementById(`setup-flash-${c}`);
          if (sBtn) {
            sBtn.className = c === col
              ? 'px-2.5 py-1 rounded-md font-bold text-[11px] bg-white text-pozia-coral shadow-xs'
              : 'px-2.5 py-1 rounded-md font-semibold text-[11px] text-stone-600 hover:text-pozia-coral';
          }
        });
      },

      setZoom(val) {
        this.zoomLevel = parseFloat(val);
        document.getElementById('zoom-val-label').textContent = `${this.zoomLevel.toFixed(1)}x`;
        this.applyVideoTransform();
      },

      setExposure(val) {
        this.exposureVal = parseInt(val, 10);
        document.getElementById('exposure-val-label').textContent = val > 0 ? `+${val}` : `${val}`;
        this.applyVideoTransform();
      },

      /* Apply Real-Time CSS Filter, Mirror, and Brightness to Video */
      applyVideoTransform() {
        const video = document.getElementById('live-video');
        if (!video) return;
        const scaleX = this.isMirrored ? -this.zoomLevel : this.zoomLevel;
        video.style.transform = `scale(${scaleX}, ${this.zoomLevel})`;

        const expBrightness = 1 + (this.exposureVal / 100);
        const filterCss = State.currentFilter.css === 'none' ? '' : State.currentFilter.css;
        const fullFilter = `${filterCss} brightness(${expBrightness})`.trim();

        video.style.filter = fullFilter;
        video.style.webkitFilter = fullFilter;
      },

      updatePoseCounter() {
        const current = Math.min(State.currentPoseIndex + 1, State.targetPoseCount);
        const text = `Foto ${current} dari ${State.targetPoseCount}`;
        const el = document.getElementById('pose-counter-text');
        if (el) el.textContent = text;
      },

      renderFilterDock() {
        const dock = document.getElementById('camera-filter-dock');
        if (!dock) return;
        dock.innerHTML = '';
        FilterPresets.forEach(preset => {
          const btn = document.createElement('button');
          const isSelected = State.currentFilter.id === preset.id;
          btn.className = `px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${isSelected
            ? 'bg-pozia-coral text-white font-bold shadow-md'
            : 'bg-[#232228] text-gray-300 hover:bg-white/15'
            }`;
          btn.textContent = preset.name;
          btn.onclick = () => {
            State.currentFilter = preset;
            this.applyVideoTransform();
            this.renderFilterDock();
          };
          dock.appendChild(btn);
        });
      },

      /* Capture Photo Sequence with Timer & Screen Flash */
      async startCaptureSequence() {
        if (this.isCapturingSequence) return;
        this.isCapturingSequence = true;

        const overlay = document.getElementById('countdown-overlay');
        const num = document.getElementById('countdown-num');
        let seconds = this.timerDuration;

        if (seconds > 0) {
          overlay.classList.remove('opacity-0');
          num.textContent = seconds;
          SoundEngine.playBeep(440, 0.15);
        }

        const currentBurst = [];
        const interval = setInterval(async () => {
          if (seconds > 0) {
            this.captureHDBurstFrame(currentBurst);
            seconds--;
            if (seconds > 0) {
              num.textContent = seconds;
              SoundEngine.playBeep(880, 0.1);
            }
          }

          if (seconds <= 0) {
            clearInterval(interval);
            overlay.classList.add('opacity-0');

            if (this.flashColor !== 'off') {
              const flash = document.getElementById('screen-flash');
              const flashBg = {
                white: '#FFFFFF',
                peach: '#FFF3E6',
                pink: '#FFE8F0'
              }[this.flashColor] || '#FFFFFF';
              flash.style.backgroundColor = flashBg;
              flash.classList.add('flash-active');
              setTimeout(() => flash.classList.remove('flash-active'), 350);
            }

            SoundEngine.playShutter();
            this.captureHDBurstFrame(currentBurst);
            await this.grabMainFrame();
            State.btsBurstGroups.push(currentBurst);

            // If we were just retaking a single pose:
            if (State.isRetakingSingle) {
              State.isRetakingSingle = false;
              State.activeSlotToReplace = null;
              this.isCapturingSequence = false;
              document.getElementById('retake-banner').classList.add('hidden');
              ReviewStudio.openReview();
              return;
            }

            State.currentPoseIndex++;
            if (State.currentPoseIndex < State.targetPoseCount) {
              this.updatePoseCounter();
              this.isCapturingSequence = false;
              setTimeout(() => this.startCaptureSequence(), 1200);
            } else {
              this.isCapturingSequence = false;
              // All poses captured! Proceed to dedicated Review Stage
              ReviewStudio.openReview();
            }
          }
        }, 1000);
      },

      captureHDBurstFrame(burstArray) {
        const video = document.getElementById('live-video');
        if (!video || !video.videoWidth) return;
        const canvas = document.createElement('canvas');
        canvas.width = 720;
        canvas.height = 960;
        const ctx = canvas.getContext('2d');

        if (this.isMirrored) {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }

        const vW = video.videoWidth;
        const vH = video.videoHeight;
        const ratio = Math.max(canvas.width / vW, canvas.height / vH);
        const x = (canvas.width - vW * ratio) / 2;
        const y = (canvas.height - vH * ratio) / 2;
        ctx.drawImage(video, x, y, vW * ratio, vH * ratio);
        burstArray.push(canvas);
      },

      async grabMainFrame() {
        const video = document.getElementById('live-video');
        const canvas = document.createElement('canvas');
        canvas.width = 1600;
        canvas.height = 1200;
        const ctx = canvas.getContext('2d');

        if (this.isMirrored) {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }

        const vW = video.videoWidth || 1920;
        const vH = video.videoHeight || 1080;
        const ratio = Math.max(canvas.width / vW, canvas.height / vH);
        const x = (canvas.width - vW * ratio) / 2;
        const y = (canvas.height - vH * ratio) / 2;
        ctx.drawImage(video, x, y, vW * ratio, vH * ratio);

        const img = new Image();
        img.src = canvas.toDataURL('image/jpeg', 0.98);

        try {
          if ('decode' in img) {
            await img.decode();
          }
        } catch (e) { }

        if (State.activeSlotToReplace !== null && State.activeSlotToReplace !== undefined) {
          State.photos[State.activeSlotToReplace] = img;
        } else {
          State.photos.push(img);
        }
      },

      /* Retake an Individual Pose (Section 5 & 9) */
      retakeSinglePose(index) {
        State.activeSlotToReplace = index;
        State.isRetakingSingle = true;

        App.navigate('camera');

        const banner = document.getElementById('retake-banner');
        const bannerText = document.getElementById('retake-banner-text');
        if (banner && bannerText) {
          bannerText.textContent = `Mengambil Ulang Pose ${index + 1} • Tekan Shutter Saat Siap`;
          banner.classList.remove('hidden');
        }

        const poseText = document.getElementById('pose-counter-text');
        if (poseText) poseText.textContent = `Pose ${index + 1} (Ambil Ulang)`;
      },

      confirmRetakeAll() {
        const msg = (I18N.current === 'en')
          ? 'Retake entire photoshoot session from the beginning?'
          : 'Ulangi seluruh sesi pengambilan foto dari awal?';
        if (confirm(msg)) {
          State.photos = [];
          State.currentPoseIndex = 0;
          State.activeSlotToReplace = null;
          State.isRetakingSingle = false;
          App.navigate('camera');
        }
      }
    };

    /* ===================================================
       7. DEDICATED REVIEW STUDIO CONTROLLER (STAGE 4)
       =================================================== */
    const ReviewStudio = {
      openReview() {
        App.navigate('review');
        this.render();
      },

      render() {
        const display = document.getElementById('review-photos-display');
        const badge = document.getElementById('review-pose-badge');
        const activeFilterName = document.getElementById('review-active-filter-name');

        if (badge) badge.textContent = `${State.photos.length} Pose Lengkap`;
        if (activeFilterName) activeFilterName.textContent = State.currentFilter.name;

        if (display) {
          display.innerHTML = '';
          State.photos.forEach((img, idx) => {
            const card = document.createElement('div');
            card.className = 'flex flex-col items-center gap-2 p-2.5 sm:p-3 rounded-2xl bg-white border border-gray-200/80 shadow-sm hover:shadow-md transition-all';

            const filterStyle = State.currentFilter.css === 'none' ? '' : `filter: ${State.currentFilter.css};`;

            card.innerHTML = `
              <div class="w-28 h-38 sm:w-34 sm:h-46 rounded-xl overflow-hidden bg-black flex items-center justify-center relative shadow-inner">
                <img src="${img.src}" style="${filterStyle}" class="w-full h-full object-cover transition-all duration-300">
                <span class="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 text-white font-mono text-[9px] sm:text-[10px] font-bold">
                  Pose ${idx + 1}
                </span>
              </div>
              <button onclick="CameraStudio.retakeSinglePose(${idx})"
                class="w-full py-1.5 px-2.5 rounded-xl bg-gray-100 hover:bg-pozia-coral hover:text-white text-gray-700 text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>${I18N.current === "en" ? "Retake" : "Foto Ulang"}</span>
              </button>
            `;
            display.appendChild(card);
          });
        }

        this.renderFiltersDock();
      },

      renderFiltersDock() {
        const dock = document.getElementById('review-filters-dock');
        if (!dock) return;
        dock.innerHTML = '';

        FilterPresets.forEach(preset => {
          const btn = document.createElement('button');
          const isSelected = State.currentFilter.id === preset.id;
          btn.className = `px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${isSelected
            ? 'bg-pozia-coral text-white border-pozia-coral shadow-md scale-105'
            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`;

          const filterStyle = preset.css === 'none' ? '' : `filter: ${preset.css};`;
          btn.innerHTML = `
            <span class="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-amber-300 to-rose-400 inline-block shrink-0 shadow-inner" style="${filterStyle}"></span>
            <span>${preset.name}</span>
          `;

          btn.onclick = () => {
            State.currentFilter = preset;
            this.render();
          };

          dock.appendChild(btn);
        });
      }
    };

    /* ===================================================
       8. EDITOR STUDIO CONTROLLER (UNDO/REDO/FRAMES/CANVAS)
       =================================================== */
    const EditorStudio = {
      activeTab: 'frame',
      denimFrameImage: null,
      history: [],
      historyIndex: -1,

      init() {
        this.recordState();
        this.renderDesignerFramesGrid();
        this.renderFilterPresets();
        this.setupSlotInteraction();
        this.renderCanvas();
      },

      recordState() {
        if (this.historyIndex < this.history.length - 1) {
          this.history = this.history.slice(0, this.historyIndex + 1);
        }
        this.history.push({
          frameTheme: State.frameTheme,
          filterId: State.currentFilter.id,
          filterIntensity: State.filterIntensity,
          manualAdjust: { ...State.manualAdjust },
          layout: State.layout
        });
        if (this.history.length > 30) this.history.shift();
        this.historyIndex = this.history.length - 1;
        this.updateUndoRedoButtons();
      },

      undo() {
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.applyHistoricalState(this.history[this.historyIndex]);
        }
      },

      redo() {
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.applyHistoricalState(this.history[this.historyIndex]);
        }
      },

      applyHistoricalState(item) {
        State.frameTheme = item.frameTheme;
        State.currentFilter = FilterPresets.find(f => f.id === item.filterId) || FilterPresets[0];
        State.filterIntensity = item.filterIntensity;
        State.manualAdjust = { ...item.manualAdjust };
        State.layout = item.layout;

        this.renderDesignerFramesGrid();
        this.renderFilterPresets();
        this.renderCanvas();
        this.updateUndoRedoButtons();
      },

      updateUndoRedoButtons() {
        const uBtn = document.getElementById('editor-undo-btn');
        const rBtn = document.getElementById('editor-redo-btn');
        if (uBtn) {
          const canUndo = this.historyIndex > 0;
          uBtn.disabled = !canUndo;
          uBtn.classList.toggle('opacity-40', !canUndo);
        }
        if (rBtn) {
          const canRedo = this.historyIndex < this.history.length - 1;
          rBtn.disabled = !canRedo;
          rBtn.classList.toggle('opacity-40', !canRedo);
        }
      },

      reset() {
        const resetMsg = (I18N.current === 'en') ? 'Reset all filters and frames to initial settings? (Your original photos remain safe)' : 'Kembalikan semua filter dan bingkai ke pengaturan awal? (Foto asli Anda tetap aman tersimpan)';
        if (confirm(resetMsg)) {
          State.frameTheme = 'pixel-arcade';
          State.currentFilter = FilterPresets[0];
          State.filterIntensity = 100;
          State.manualAdjust = { brightness: 0, contrast: 0 };
          this.recordState();
          this.renderDesignerFramesGrid();
          this.renderFilterPresets();
          this.renderCanvas();
        }
      },

      switchTab(tab) {
        this.activeTab = tab;
        ['frame', 'filter'].forEach(t => {
          const btn = document.getElementById(`tab-btn-${t}`);
          const content = document.getElementById(`tab-content-${t}`);
          if (t === tab) {
            btn.className = 'px-4 py-1.5 text-xs font-bold text-white bg-pozia-coral rounded-lg transition-all shadow-sm';
            content.classList.remove('hidden');
          } else {
            btn.className = 'px-4 py-1.5 text-xs font-semibold text-gray-600 rounded-lg transition-all hover:text-pozia-coral';
            content.classList.add('hidden');
          }
        });
      },

      filterCategory(cat) {
        State.frameCategory = cat;
        const categories = ['all', 'gaming', 'scrapbook', 'cyber', 'comic', 'music', 'summer', 'retro', 'fantasy', 'solid'];
        categories.forEach(c => {
          const btn = document.getElementById(`cat-btn-${c}`);
          if (btn) {
            btn.className = c === cat
              ? 'px-3 py-1 rounded-full text-xs font-bold bg-pozia-coral text-white whitespace-nowrap shadow-sm'
              : 'px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 whitespace-nowrap';
          }
        });
        this.renderDesignerFramesGrid();
      },

      renderDesignerFramesGrid() {
        const grid = document.getElementById('designer-frames-grid');
        if (!grid) return;
        grid.innerHTML = '';

        const filtered = State.frameCategory === 'all'
          ? FrameThemes
          : FrameThemes.filter(f => f.cat === State.frameCategory);

        filtered.forEach(frame => {
          const card = document.createElement('div');
          const isSelected = State.frameTheme === frame.id;
          card.className = `p-3 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${isSelected
            ? 'border-pozia-coral bg-pink-50/70 shadow-md ring-2 ring-pozia-coral/25'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            }`;

          card.innerHTML = `
            <div class="w-full h-20 rounded-xl flex items-center justify-center shadow-inner relative overflow-hidden" style="background: ${frame.thumb};">
              <span class="text-xs font-bold ${frame.thumb.includes('#FFFFFF') || frame.thumb.includes('#FAF') || frame.thumb.includes('#F5') ? 'text-gray-800' : 'text-white/95'} font-serif">
                ${frame.name}
              </span>
              ${isSelected ? '<span class="absolute top-2 right-2 w-5 h-5 rounded-full bg-pozia-coral text-white flex items-center justify-center text-[10px] font-bold shadow">✔</span>' : ''}
            </div>
            <div class="flex flex-col">
              <span class="font-extrabold text-xs text-pozia-charcoal truncate">${frame.name}</span>
              <span class="text-[10px] text-gray-400 truncate">${frame.desc}</span>
            </div>
          `;

          card.onclick = () => {
            State.frameTheme = frame.id;
            this.recordState();
            this.renderDesignerFramesGrid();
            this.renderCanvas();
          };

          grid.appendChild(card);
        });
      },

      renderFilterPresets() {
        const grid = document.getElementById('filter-presets-grid');
        if (!grid) return;
        grid.innerHTML = '';
        FilterPresets.forEach(p => {
          const card = document.createElement('button');
          const isSelected = State.currentFilter.id === p.id;
          card.className = `p-2.5 rounded-xl text-left text-xs flex items-center gap-2.5 border transition-all ${isSelected
            ? 'border-pozia-coral bg-pink-50 font-bold text-pozia-coral shadow-sm ring-2 ring-pozia-coral/20'
            : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100'
            }`;
          const filterStyle = p.css === 'none' ? '' : `filter: ${p.css};`;
          card.innerHTML = `
            <div class="w-10 h-10 rounded-lg bg-gradient-to-tr from-amber-200 to-rose-300 overflow-hidden shadow-inner shrink-0 flex items-center justify-center text-[10px] font-bold text-white/80" style="${filterStyle}">
              PZ
            </div>
            <div class="flex flex-col truncate">
              <span class="truncate font-bold text-xs">${p.name}</span>
              <span class="truncate text-[10px] text-gray-400">${p.desc}</span>
            </div>
          `;
          card.onclick = () => {
            State.currentFilter = p;
            document.getElementById('active-filter-badge').textContent = p.name;
            this.recordState();
            this.renderFilterPresets();
            this.renderCanvas();
          };
          grid.appendChild(card);
        });
      },

      setFilterIntensity(val) {
        State.filterIntensity = parseInt(val, 10);
        document.getElementById('intensity-val-text').textContent = `${val}%`;
        this.renderCanvas();
      },

      setManualAdjust(type, val) {
        State.manualAdjust[type] = parseInt(val, 10);
        document.getElementById(`${type}-val-text`).textContent = val;
        this.renderCanvas();
      },

      randomVibe() {
        const nonSolid = FrameThemes.filter(f => f.cat !== 'solid');
        State.frameTheme = nonSolid[Math.floor(Math.random() * nonSolid.length)].id;
        State.currentFilter = FilterPresets[Math.floor(Math.random() * FilterPresets.length)];
        this.recordState();
        this.renderDesignerFramesGrid();
        this.renderFilterPresets();
        this.renderCanvas();
      },

      setupSlotInteraction() {
        const canvas = document.getElementById('editor-preview-canvas');
        if (!canvas) return;
        canvas.onclick = (e) => {
          const rect = canvas.getBoundingClientRect();
          const scaleX = canvas.width / rect.width;
          const scaleY = canvas.height / rect.height;
          const x = (e.clientX - rect.left) * scaleX;
          const y = (e.clientY - rect.top) * scaleY;

          if (State.frameTheme === 'denim-stars' && State.layout === '1x3') {
            let slot = 0;
            if (y > canvas.height * 0.65) slot = 2;
            else if (y > canvas.height * 0.35) slot = 1;
            State.activeSlotToReplace = slot;
            App.triggerGalleryUpload();
            return;
          }

          if (State.layout === 'polaroid') {
            State.activeSlotToReplace = 0;
            App.triggerGalleryUpload();
            return;
          }

          if (State.layout === '2x2') {
            const padding = Math.round(canvas.width * 0.055);
            const gap = Math.round(canvas.width * 0.035);
            const availableW = canvas.width - padding * 2;
            const cellSize = Math.floor((availableW - gap) / 2);
            const midX = padding + cellSize + gap / 2;
            const midY = padding + cellSize + gap / 2;
            let slot = 0;
            if (x < midX && y < midY) slot = 0;
            else if (x >= midX && y < midY) slot = 1;
            else if (x < midX && y >= midY) slot = 2;
            else slot = 3;
            State.activeSlotToReplace = slot;
            App.triggerGalleryUpload();
            return;
          }

          // Strip 1x4, 1x3, 1x2
          const poses = State.layout === '1x2' ? 2 : (State.layout === '1x3' ? 3 : 4);
          const topMargin = (State.frameTheme === 'the-pozia-times' || State.frameTheme === 'pop-art-comic') ? Math.round(canvas.width * 0.16) : Math.round(canvas.width * 0.075);
          const bottomMargin = Math.round(canvas.width * 0.22);
          const availableH = canvas.height - topMargin - bottomMargin;
          const gap = State.layout === '1x4' ? Math.round(canvas.width * 0.026) : (State.layout === '1x3' ? Math.round(canvas.width * 0.032) : Math.round(canvas.width * 0.038));
          const slotH = Math.round((availableH - gap * (poses - 1)) / poses);

          let clickedSlot = Math.floor((y - topMargin) / (slotH + gap));
          if (clickedSlot < 0) clickedSlot = 0;
          if (clickedSlot >= poses) clickedSlot = poses - 1;
          State.activeSlotToReplace = clickedSlot;
          App.triggerGalleryUpload();
        };
      },

      /* Render Canvas with subtle crossfade transition */
      renderCanvas() {
        const previewCanvas = document.getElementById('editor-preview-canvas');
        if (previewCanvas) {
          previewCanvas.classList.add('canvas-updating');
          this.renderToCanvas(previewCanvas, false);
          requestAnimationFrame(() => {
            setTimeout(() => previewCanvas.classList.remove('canvas-updating'), 120);
          });
        }
      },

      /* Render complete photo strip on canvas (low-res preview or high-res export) */
      renderToCanvas(canvas, isHighRes = false) {
        const ctx = canvas.getContext('2d');
        const activeLayout = State.layout;

        // Custom Scrapbook Denim & Stars Frame (1x3 Special Tilted Slots)
        if (State.frameTheme === 'denim-stars' && activeLayout === '1x3') {
          const width = isHighRes ? 1152 : 576;
          const height = isHighRes ? 2048 : 1024;
          canvas.width = width;
          canvas.height = height;

          const s = width / 576;
          const denimSlots = [
            { cx: 288 * s, cy: 208 * s, w: 260 * s, h: 205 * s, rot: -0.045 },
            { cx: 288 * s, cy: 512 * s, w: 255 * s, h: 195 * s, rot: 0.035 },
            { cx: 291 * s, cy: 806 * s, w: 275 * s, h: 205 * s, rot: -0.052 }
          ];

          ctx.fillStyle = '#1e2436';
          ctx.fillRect(0, 0, width, height);

          denimSlots.forEach((slot, idx) => {
            const photo = State.photos[idx] !== undefined ? State.photos[idx] : (State.photos[0] || null);
            if (photo) {
              if (photo instanceof HTMLImageElement && !photo.complete) {
                photo.onload = () => EditorStudio.renderCanvas();
              }
              ctx.save();
              ctx.translate(slot.cx, slot.cy);
              ctx.rotate(slot.rot);

              if (ctx.filter !== undefined && State.currentFilter && State.currentFilter.css !== 'none') {
                ctx.filter = State.currentFilter.css;
              }

              const pW = photo.videoWidth || photo.naturalWidth || photo.width;
              const pH = photo.videoHeight || photo.naturalHeight || photo.height;
              if (pW && pH) {
                const imgRatio = pW / pH;
                const slotRatio = slot.w / slot.h;
                let sW, sH, sX, sY;
                if (imgRatio > slotRatio) {
                  sH = pH; sW = pH * slotRatio;
                  sX = (pW - sW) / 2; sY = 0;
                } else {
                  sW = pW; sH = pW / slotRatio;
                  sX = 0; sY = (pH - sH) / 2;
                }
                ctx.drawImage(photo, sX, sY, sW, sH, -slot.w / 2, -slot.h / 2, slot.w, slot.h);
              }
              ctx.restore();
            }
          });

          if (this.denimFrameImage && this.denimFrameImage.complete && this.denimFrameImage.naturalWidth > 0) {
            ctx.drawImage(this.denimFrameImage, 0, 0, width, height);
          } else {
            if (!this.denimFrameImage) {
              this.denimFrameImage = new Image();
              this.denimFrameImage.onload = () => this.renderCanvas();
              this.denimFrameImage.src = './assets/denim-star-frame.png';
            }
          }
          return;
        }

        // Standard Designer Frames: Dimensions based on layout
        let width, height;

        if (activeLayout === '1x4') {
          width = isHighRes ? 900 : 380;
          height = Math.round(width * 2.95);
        } else if (activeLayout === '1x3') {
          width = isHighRes ? 900 : 380;
          height = Math.round(width * 2.30);
        } else if (activeLayout === '1x2') {
          width = isHighRes ? 900 : 380;
          height = Math.round(width * 1.65);
        } else if (activeLayout === '2x2') {
          width = isHighRes ? 1400 : 560;
          height = width; // BENTUK PERSEGI MURNI (1:1 square canvas)
        } else {
          // Polaroid: Satu foto portrait dengan bingkai proporsi khas Polaroid (bagian bawah lebar)
          width = isHighRes ? 1200 : 480;
          height = Math.round(width * 1.25);
        }

        canvas.width = width;
        canvas.height = height;

        // 1. Draw Thematic Frame Patterns
        this.drawCuteFramePattern(ctx, width, height, isHighRes);

        // 2. Compute Slots Coordinates
        const slotRects = [];
        const poses = activeLayout === '1x4' ? 4 : activeLayout === '1x3' ? 3 : activeLayout === '1x2' ? 2 : activeLayout === '2x2' ? 4 : 1;
        const bottomMargin = Math.round(width * 0.22);

        if (activeLayout === '1x4' || activeLayout === '1x3' || activeLayout === '1x2') {
          const marginX = State.frameTheme === 'film-contact-sheet' ? Math.round(width * 0.11) : Math.round(width * 0.08);
          const topMargin = (State.frameTheme === 'the-pozia-times' || State.frameTheme === 'pop-art-comic') ? Math.round(width * 0.16) : Math.round(width * 0.075);
          const availableW = width - marginX * 2;
          const availableH = height - topMargin - bottomMargin;
          const gap = activeLayout === '1x4' ? Math.round(width * 0.026) : (activeLayout === '1x3' ? Math.round(width * 0.032) : Math.round(width * 0.038));
          const slotH = Math.round((availableH - gap * (poses - 1)) / poses);
          for (let i = 0; i < poses; i++) {
            slotRects.push({ x: marginX, y: topMargin + i * (slotH + gap), w: availableW, h: slotH });
          }
        } else if (activeLayout === '2x2') {
          // Grid 2x2: Bentuk persegi 2 kolom x 2 baris, 4 foto bujur sangkar sama sisi, jarak konsisten
          const padding = Math.round(width * 0.055);
          const gap = Math.round(width * 0.035);
          const availableW = width - padding * 2;
          const cellSize = Math.floor((availableW - gap) / 2);
          slotRects.push({ x: padding, y: padding, w: cellSize, h: cellSize });
          slotRects.push({ x: padding + cellSize + gap, y: padding, w: cellSize, h: cellSize });
          slotRects.push({ x: padding, y: padding + cellSize + gap, w: cellSize, h: cellSize });
          slotRects.push({ x: padding + cellSize + gap, y: padding + cellSize + gap, w: cellSize, h: cellSize });
        } else {
          // Polaroid: Satu foto portrait proporsional, bagian bawah bingkai lebih lebar khas Polaroid klasik
          const marginX = Math.round(width * 0.08);
          const topMargin = Math.round(width * 0.08);
          const photoW = width - marginX * 2;
          const photoH = Math.round(photoW * 1.08);
          slotRects.push({ x: marginX, y: topMargin, w: photoW, h: photoH });
        }

        // 3. Draw Photos with Filter into Slots (Object-Fit: Cover)
        slotRects.forEach((rect, idx) => {
          ctx.save();

          // Smooth inner photo corners
          ctx.beginPath();
          ctx.roundRect(rect.x, rect.y, rect.w, rect.h, width * 0.02);
          ctx.clip();

          const photo = State.photos[idx] !== undefined ? State.photos[idx] : (State.photos[0] || null);
          if (photo) {
            if (photo instanceof HTMLImageElement && !photo.complete) {
              photo.onload = () => EditorStudio.renderCanvas();
            }

            if (ctx.filter !== undefined && State.currentFilter && State.currentFilter.css !== 'none') {
              ctx.filter = State.currentFilter.css;
            }

            const pW = photo.videoWidth || photo.naturalWidth || photo.width;
            const pH = photo.videoHeight || photo.naturalHeight || photo.height;
            if (pW && pH) {
              const imgRatio = pW / pH;
              const slotRatio = rect.w / rect.h;
              let sW, sH, sX, sY;
              if (imgRatio > slotRatio) {
                sH = pH; sW = pH * slotRatio;
                sX = (pW - sW) / 2; sY = 0;
              } else {
                sW = pW; sH = pW / slotRatio;
                sX = 0; sY = (pH - sH) / 2;
              }
              ctx.drawImage(photo, sX, sY, sW, sH, rect.x, rect.y, rect.w, rect.h);
            }
          } else {
            // Placeholder slot
            ctx.fillStyle = '#E5E7EB';
            ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
            ctx.fillStyle = '#9CA3AF';
            ctx.font = `600 ${width * 0.035}px "Plus Jakarta Sans", sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText(`+ Foto ${idx + 1}`, rect.x + rect.w / 2, rect.y + rect.h / 2);
          }
          ctx.restore();

          // 4. Draw slot accents (washi tape, film sprocket tags)
          this.drawSlotAccents(ctx, rect, idx, width, isHighRes);
        });

        // 5. Draw Custom PNG Frame if uploaded
        if (State.frameTheme === 'custom-png' && State.customFrameImage) {
          ctx.drawImage(State.customFrameImage, 0, 0, width, height);
        }

        // 6. PERMANENT BRANDING "Pozia Studio"
        let brandY, brandSize;
        if (activeLayout === '2x2') {
          const padding = Math.round(width * 0.055);
          const gap = Math.round(width * 0.035);
          const availableW = width - padding * 2;
          const cellSize = Math.floor((availableW - gap) / 2);
          const cellsBottom = padding + cellSize * 2 + gap;
          brandY = cellsBottom + (height - cellsBottom) * 0.58;
          brandSize = Math.round(width * 0.038);
        } else if (activeLayout === 'polaroid') {
          const marginX = Math.round(width * 0.08);
          const topMargin = Math.round(width * 0.08);
          const photoW = width - marginX * 2;
          const photoH = Math.round(photoW * 1.08);
          const photoBottom = topMargin + photoH;
          brandY = photoBottom + (height - photoBottom) * 0.44;
          brandSize = Math.round(width * 0.046);
        } else {
          brandY = height - bottomMargin * 0.44;
          brandSize = Math.round(width * 0.048);
        }
        ctx.textAlign = 'center';

        if (State.frameTheme === 'pixel-arcade') {
          ctx.fillStyle = '#06B6D4';
          ctx.font = `bold ${brandSize * 0.85}px "Share Tech Mono", monospace`;
          ctx.fillText('INSERT COIN • POZIA STUDIO', width / 2, brandY);
        } else if (State.frameTheme === 'cyber-liquid-chrome' || State.frameTheme === 'hologram-cd') {
          ctx.fillStyle = '#334155';
          ctx.font = `800 ${brandSize * 0.9}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillText('✦ POZIA STUDIO ✦', width / 2, brandY);
        } else if (State.frameTheme === 'pop-art-comic') {
          ctx.fillStyle = '#DC2626';
          ctx.font = `900 ${brandSize}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillText('POZIA STUDIO COMICS', width / 2, brandY);
        } else if (State.frameTheme === 'mixtape-cassette' || State.frameTheme === 'film-contact-sheet' || State.frameTheme === 'noir-minimal') {
          ctx.fillStyle = '#FFFFFF';
          ctx.font = `600 ${brandSize}px "Playfair Display", serif`;
          ctx.fillText('Pozia Studio', width / 2, brandY);
        } else if (State.frameTheme === 'celestial-tarot') {
          ctx.fillStyle = '#F59E0B';
          ctx.font = `italic 700 ${brandSize}px "Playfair Display", serif`;
          ctx.fillText('The Pozia Studio', width / 2, brandY);
        } else if (State.frameTheme === 'denim-stars') {
          ctx.fillStyle = '#E2E8F0';
          ctx.font = `800 ${brandSize * 0.9}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillText('POZIA', width / 2, brandY);
        } else {
          ctx.fillStyle = '#1C1917';
          ctx.font = `600 ${brandSize}px "Playfair Display", serif`;
          ctx.fillText('Pozia Studio', width / 2, brandY);
        }

        if (activeLayout === 'polaroid') {
          ctx.fillStyle = '#9CA3AF';
          ctx.font = `bold ${Math.round(brandSize * 0.38)}px "Courier Prime", monospace`;
          ctx.fillText('POLAROID CLASSIC', width / 2, brandY + brandSize * 0.65);
        }
      },

      /* Draw Thematic Visual Patterns for all 20 frames */
      drawCuteFramePattern(ctx, width, height, isHighRes) {
        const th = State.frameTheme;

        // 1. 8-Bit Arcade 1984
        if (th === 'pixel-arcade') {
          ctx.fillStyle = '#100C2A';
          ctx.fillRect(0, 0, width, height);

          // CRT scanlines & pixel dots
          ctx.fillStyle = 'rgba(167, 139, 250, 0.08)';
          for (let y = 0; y < height; y += 4) {
            ctx.fillRect(0, y, width, 1.5);
          }

          // Top Header Arcade Banner
          ctx.fillStyle = '#06B6D4';
          ctx.font = `bold ${width * 0.038}px "Share Tech Mono", monospace`;
          ctx.textAlign = 'left';
          ctx.fillText('ARCADE 1984', width * 0.08, width * 0.055);
          ctx.textAlign = 'right';
          ctx.fillStyle = '#F43F5E';
          ctx.fillText('HI-99990', width * 0.92, width * 0.055);

          // Pixel Hearts
          ctx.fillStyle = '#F43F5E';
          ctx.font = `${width * 0.03}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText('♥  ♥  ♥', width / 2, width * 0.055);
        }
        // 2. GameBoy Retro Handheld
        else if (th === 'retro-gameboy') {
          ctx.fillStyle = '#D4D3C5';
          ctx.fillRect(0, 0, width, height);

          // Screen Bezel Inner Border
          ctx.fillStyle = '#9EA088';
          ctx.fillRect(width * 0.05, width * 0.05, width * 0.9, height - width * 0.24);

          // Power Battery LED
          ctx.fillStyle = '#EF4444';
          ctx.beginPath();
          ctx.arc(width * 0.08, width * 0.075, width * 0.012, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#555';
          ctx.font = `bold ${width * 0.02}px sans-serif`;
          ctx.textAlign = 'left';
          ctx.fillText('BATTERY', width * 0.11, width * 0.08);

          // Sound vents bottom right
          ctx.strokeStyle = 'rgba(0,0,0,0.2)';
          ctx.lineWidth = isHighRes ? 4 : 2;
          for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(width * 0.75 + i * 12, height - width * 0.15);
            ctx.lineTo(width * 0.85 + i * 12, height - width * 0.05);
            ctx.stroke();
          }
        }
        // 2b. Scrapbook Denim & Stars
        else if (th === 'denim-stars') {
          ctx.fillStyle = '#1E2436';
          ctx.fillRect(0, 0, width, height);

          // Corduroy ridges
          ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
          for (let x = 0; x < width; x += 6) {
            ctx.fillRect(x, 0, 2, height);
          }

          // Gold stars & scrapbook accents
          ctx.fillStyle = '#F59E0B';
          ctx.font = `${width * 0.045}px serif`;
          ctx.textAlign = 'center';
          ctx.fillText('★', width * 0.06, width * 0.08);
          ctx.fillText('★', width * 0.94, width * 0.12);
          ctx.fillText('★', width * 0.92, height * 0.88);
        }
        // 3. Botanical Herbarium & Washi
        else if (th === 'washi-botanical') {
          ctx.fillStyle = '#F6F0E6';
          ctx.fillRect(0, 0, width, height);

          ctx.strokeStyle = 'rgba(120, 113, 108, 0.25)';
          ctx.lineWidth = isHighRes ? 2 : 1;
          ctx.strokeRect(width * 0.04, width * 0.04, width * 0.92, height - width * 0.08);

          // Postage stamp top right
          ctx.fillStyle = '#E7DFD5';
          ctx.fillRect(width * 0.78, width * 0.03, width * 0.16, width * 0.09);
          ctx.strokeStyle = '#B91C1C';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(width * 0.79, width * 0.035, width * 0.14, width * 0.08);
          ctx.fillStyle = '#B91C1C';
          ctx.font = `bold ${width * 0.018}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText('AIR MAIL', width * 0.86, width * 0.08);
        }
        // 4. Coquette Satin Ribbon
        else if (th === 'coquette-ribbon') {
          ctx.fillStyle = '#FFF0F3';
          ctx.fillRect(0, 0, width, height);

          // Scalloped lace border
          ctx.fillStyle = '#FFFFFF';
          const r = width * 0.018;
          for (let x = r; x < width; x += r * 2) {
            ctx.beginPath();
            ctx.arc(x, r, r, 0, Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, height - r, r, Math.PI, 0);
            ctx.fill();
          }

          ctx.fillStyle = '#FF5A79';
          ctx.font = `600 ${width * 0.032}px "Caveat", cursive`;
          ctx.textAlign = 'center';
          ctx.fillText('sweet memories  •  coquette edition', width / 2, width * 0.055);
        }
        // 5. Y2K Liquid Chrome
        else if (th === 'cyber-liquid-chrome') {
          const grad = ctx.createLinearGradient(0, 0, width, height);
          grad.addColorStop(0, '#E2E8F0');
          grad.addColorStop(0.5, '#CBD5E1');
          grad.addColorStop(1, '#94A3B8');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);

          ctx.fillStyle = '#334155';
          ctx.font = `bold ${width * 0.035}px "Share Tech Mono", monospace`;
          ctx.textAlign = 'center';
          ctx.fillText('✦ CYBER CHROMIUM 2000 ✦', width / 2, width * 0.055);
        }
        // 6. 2000s CD Hologram
        else if (th === 'hologram-cd') {
          const grad = ctx.createLinearGradient(0, 0, width, height);
          grad.addColorStop(0, '#C7D2FE');
          grad.addColorStop(0.33, '#FBCFE8');
          grad.addColorStop(0.66, '#BAE6FD');
          grad.addColorStop(1, '#DDD6FE');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);

          ctx.fillStyle = '#4338CA';
          ctx.font = `bold ${width * 0.03}px "Plus Jakarta Sans", sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText('OPTICAL DISC • STEREO AUDIO', width / 2, width * 0.055);
        }
        // 7. Pop Art Comic Book
        else if (th === 'pop-art-comic') {
          ctx.fillStyle = '#FFF9D2';
          ctx.fillRect(0, 0, width, height);

          // Halftone polka dots
          ctx.fillStyle = 'rgba(234, 179, 8, 0.25)';
          const dotStep = width * 0.04;
          for (let x = dotStep / 2; x < width; x += dotStep) {
            for (let y = dotStep / 2; y < height; y += dotStep) {
              ctx.beginPath();
              ctx.arc(x, y, dotStep * 0.15, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          // Top comic banner
          ctx.fillStyle = '#DC2626';
          ctx.fillRect(0, 0, width, width * 0.11);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = `900 ${width * 0.042}px "Plus Jakarta Sans", sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText('POZIA COMICS ★ ISSUE #1', width / 2, width * 0.075);
        }
        // 8. Pastel Doodle Journal
        else if (th === 'pastel-doodle-diary') {
          ctx.fillStyle = '#F8FAFC';
          ctx.fillRect(0, 0, width, height);

          // Grid lines
          ctx.strokeStyle = '#E2E8F0';
          ctx.lineWidth = 1;
          for (let y = 0; y < height; y += 22) {
            ctx.beginPath();
            ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
          }
          for (let x = 0; x < width; x += 22) {
            ctx.beginPath();
            ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
          }

          ctx.fillStyle = '#FF5A79';
          ctx.font = `600 ${width * 0.035}px "Caveat", cursive`;
          ctx.textAlign = 'center';
          ctx.fillText('today was wonderful ♡ journal studio', width / 2, width * 0.055);
        }
        // 9. 90s Retro Mixtape
        else if (th === 'mixtape-cassette') {
          ctx.fillStyle = '#1E2430';
          ctx.fillRect(0, 0, width, height);

          ctx.fillStyle = '#EC4899';
          ctx.font = `bold ${width * 0.032}px "Share Tech Mono", monospace`;
          ctx.textAlign = 'center';
          ctx.fillText('SIDE A • CASSETTE MIXTAPE', width / 2, width * 0.055);
        }
        // 10. VIP Concert Pass
        else if (th === 'vip-backstage') {
          const grad = ctx.createLinearGradient(0, 0, width, height);
          grad.addColorStop(0, '#3B0764');
          grad.addColorStop(1, '#701A75');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);

          // Oval punch hole
          ctx.fillStyle = '#0F0419';
          ctx.beginPath();
          ctx.ellipse(width / 2, width * 0.035, width * 0.08, width * 0.02, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#FBBF24';
          ctx.font = `900 ${width * 0.035}px "Plus Jakarta Sans", sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText('★ VIP ALL ACCESS PASS ★', width / 2, width * 0.08);
        }
        // 11. Amalfi Lemon
        else if (th === 'amalfi-lemon') {
          ctx.fillStyle = '#FFFDF5';
          ctx.fillRect(0, 0, width, height);

          ctx.strokeStyle = '#2563EB';
          ctx.lineWidth = isHighRes ? 3 : 1.5;
          ctx.strokeRect(width * 0.03, width * 0.03, width * 0.94, height - width * 0.06);

          ctx.fillStyle = '#CA8A04';
          ctx.font = `italic 700 ${width * 0.035}px "Playfair Display", serif`;
          ctx.textAlign = 'center';
          ctx.fillText('🍋 Dolce Vita • Amalfi Coast 🍋', width / 2, width * 0.055);
        }
        // 12. Sunset Beach Club
        else if (th === 'sunset-beach-club') {
          const grad = ctx.createLinearGradient(0, 0, width, height);
          grad.addColorStop(0, '#FB923C');
          grad.addColorStop(0.5, '#F43F5E');
          grad.addColorStop(1, '#FDE047');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);

          ctx.fillStyle = '#FFFFFF';
          ctx.font = `800 ${width * 0.034}px "Plus Jakarta Sans", sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText('POZIA BEACH CLUB • GOLDEN HOUR', width / 2, width * 0.055);
        }
        // 13. The Pozia Times Newspaper
        else if (th === 'the-pozia-times') {
          ctx.fillStyle = '#F4ECD8';
          ctx.fillRect(0, 0, width, height);

          ctx.fillStyle = '#1A1815';
          ctx.font = `bold ${width * 0.046}px "Playfair Display", serif`;
          ctx.textAlign = 'center';
          ctx.fillText('THE POZIA TIMES', width / 2, width * 0.09);

          ctx.font = `italic ${width * 0.022}px "Playfair Display", serif`;
          ctx.fillText('SPECIAL EDITION — ALL MEMORIES CAPTURED', width / 2, width * 0.125);

          ctx.strokeStyle = '#2B2620';
          ctx.lineWidth = isHighRes ? 3 : 1;
          ctx.beginPath();
          ctx.moveTo(width * 0.06, width * 0.14);
          ctx.lineTo(width * 0.94, width * 0.14);
          ctx.stroke();
        }
        // 14. 35mm Film Contact Sheet
        else if (th === 'film-contact-sheet') {
          ctx.fillStyle = '#121214';
          ctx.fillRect(0, 0, width, height);

          // 35mm film sprockets along both borders
          ctx.fillStyle = '#27272A';
          const sprocketW = width * 0.045;
          const sprocketH = width * 0.035;
          const step = width * 0.07;
          for (let y = width * 0.05; y < height - width * 0.05; y += step) {
            ctx.beginPath();
            ctx.roundRect(width * 0.025, y, sprocketW, sprocketH, 2);
            ctx.fill();
            ctx.beginPath();
            ctx.roundRect(width * 0.93, y, sprocketW, sprocketH, 2);
            ctx.fill();
          }

          ctx.fillStyle = '#F59E0B';
          ctx.font = `bold ${width * 0.025}px "Courier Prime", monospace`;
          ctx.textAlign = 'center';
          ctx.fillText('KODAK TX 400 • ANALOG 35MM', width / 2, width * 0.045);
        }
        // 15. Celestial Tarot
        else if (th === 'celestial-tarot') {
          ctx.fillStyle = '#0B1120';
          ctx.fillRect(0, 0, width, height);

          ctx.strokeStyle = '#F59E0B';
          ctx.lineWidth = isHighRes ? 3 : 1.5;
          ctx.strokeRect(width * 0.03, width * 0.03, width * 0.94, height - width * 0.06);

          ctx.fillStyle = '#FCD34D';
          ctx.font = `italic 700 ${width * 0.035}px "Playfair Display", serif`;
          ctx.textAlign = 'center';
          ctx.fillText('🌙  THE TAROT • CELESTIAL  ☀️', width / 2, width * 0.055);
        }
        // 16. Angelic Clouds
        else if (th === 'angelic-clouds') {
          const grad = ctx.createLinearGradient(0, 0, width, height);
          grad.addColorStop(0, '#FCE7F3');
          grad.addColorStop(1, '#EDE9FE');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);

          ctx.fillStyle = '#7C3AED';
          ctx.font = `600 ${width * 0.032}px "Caveat", cursive`;
          ctx.textAlign = 'center';
          ctx.fillText('heaven sent  •  angelic dream', width / 2, width * 0.055);
        }
        // 17. Noir Minimal
        else if (th === 'noir-minimal') {
          ctx.fillStyle = '#18181B';
          ctx.fillRect(0, 0, width, height);

          ctx.strokeStyle = 'rgba(255,255,255,0.15)';
          ctx.lineWidth = 1;
          ctx.strokeRect(width * 0.04, width * 0.04, width * 0.92, height - width * 0.08);
        }
        // 18. Classic White & Solid default
        else {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);

          ctx.strokeStyle = '#F3F4F6';
          ctx.lineWidth = 1;
          ctx.strokeRect(width * 0.03, width * 0.03, width * 0.94, height - width * 0.06);
        }
      },

      drawSlotAccents(ctx, rect, idx, width, isHighRes) {
        const th = State.frameTheme;
        if (th === 'washi-botanical') {
          ctx.save();
          ctx.translate(rect.x + rect.w * 0.1, rect.y);
          ctx.rotate(-0.08);
          ctx.fillStyle = idx % 2 === 0 ? 'rgba(167, 243, 208, 0.85)' : 'rgba(254, 215, 170, 0.85)';
          ctx.fillRect(-width * 0.06, -width * 0.015, width * 0.12, width * 0.03);
          ctx.restore();
        }
      }
    };

    /* ===================================================
       9. SAVED HISTORY GALLERY MANAGER
       =================================================== */
    const HistoryManager = {
      KEY: 'pozia_saved_history_v3',
      save(dataUrl) {
        try {
          const list = this.getAll();
          list.unshift({
            id: Date.now(),
            date: new Date().toLocaleDateString('id-ID'),
            url: dataUrl
          });
          if (list.length > 20) list.pop();
          localStorage.setItem(this.KEY, JSON.stringify(list));
        } catch (e) { }
      },
      getAll() {
        try {
          const raw = localStorage.getItem(this.KEY);
          return raw ? JSON.parse(raw) : [];
        } catch (e) { return []; }
      },
      clear() {
        const clearMsg = (I18N.current === 'en') ? 'Delete all saved photo history?' : 'Hapus seluruh riwayat foto yang tersimpan?';
        if (confirm(clearMsg)) {
          localStorage.removeItem(this.KEY);
          this.render();
        }
      },
      render() {
        const container = document.getElementById('history-items-grid');
        if (!container) return;
        const list = this.getAll();
        if (list.length === 0) {
          container.innerHTML = '<div class="col-span-3 py-12 text-center text-xs text-gray-400">${I18N.current === "en" ? "No saved photos yet." : "Belum ada foto yang tersimpan."}</div>';
          return;
        }
        container.innerHTML = list.map(item => `
          <div class="relative group rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
            <img src="${item.url}" class="w-full h-auto object-cover block">
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
              <a href="${item.url}" download="Pozia_${item.id}.png"
                class="px-2.5 py-1 rounded-lg bg-pozia-coral text-white text-[10px] font-bold shadow">${I18N.current === "en" ? "Download" : "Unduh"}</a>
            </div>
          </div>
        `).join('');
      }
    };

    /* ===================================================
       10. MASTER APPLICATION ORCHESTRATOR (APP)
       =================================================== */
    const App = {
      init() {
        this.setLayout('1x4');
        const savedLang = (() => {
          try { return localStorage.getItem('pozia_lang'); } catch (e) { return null; }
        })() || 'id';
        I18N.apply(savedLang);
        this.initPWA();
        this.updateSetupPreview();

        // Gallery File Input (Supports multi-file upload)
        document.getElementById('gallery-file-input').addEventListener('change', async (e) => {
          const files = Array.from(e.target.files);
          if (files.length === 0) return;

          // If replacing a specific clicked slot in editor
          if (State.activeSlotToReplace !== null && files.length > 0) {
            const img = await App.loadImageFromFile(files[0]);
            State.photos[State.activeSlotToReplace] = img;
            State.activeSlotToReplace = null;
            if (State.stage === 'editor') EditorStudio.renderCanvas();
            else if (State.stage === 'review') ReviewStudio.render();
            e.target.value = '';
            return;
          }

          // Otherwise adding new photos to slots sequentially
          for (let file of files) {
            if (State.photos.length >= State.targetPoseCount) break;
            const img = await App.loadImageFromFile(file);
            State.photos.push(img);
          }

          if (State.stage === 'editor') {
            EditorStudio.renderCanvas();
          } else if (State.stage === 'home' || State.stage === 'setup') {
            if (State.photos.length > 0) {
              ReviewStudio.openReview();
            }
          } else if (State.photos.length >= State.targetPoseCount) {
            ReviewStudio.openReview();
          } else {
            State.currentPoseIndex = State.photos.length;
            CameraStudio.updatePoseCounter();
          }
          e.target.value = '';
        });

        // Custom PNG Frame Input
        document.getElementById('custom-frame-input').addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              State.customFrameImage = img;
              State.frameTheme = 'custom-png';
              EditorStudio.renderDesignerFramesGrid();
              EditorStudio.renderCanvas();
            };
            img.src = event.target.result;
          };
          reader.readAsDataURL(file);
        });
      },

      toggleLanguage() {
        const next = I18N.current === 'id' ? 'en' : 'id';
        I18N.apply(next);
        CameraStudio.updatePoseCounter();
        if (State.stage === 'review') {
          ReviewStudio.render();
        }
      },

      /* Setup Stage Controllers */
      setSetupLayout(layout) {
        this.setLayout(layout);
        this.updateSetupUI();
      },

      setSetupTheme(themeId) {
        State.frameTheme = themeId;
      },

      updateSetupUI() {
        const layouts = ['1x4', '1x3', '1x2', '2x2', 'polaroid'];
        layouts.forEach(l => {
          const card = document.getElementById(`setup-card-${l}`);
          const ind = document.getElementById(`setup-indicator-${l}`);
          const isSelected = (l === State.layout);
          if (card) {
            card.className = isSelected
              ? 'p-3 sm:p-3.5 rounded-2xl bg-white border-2 border-pozia-coral ring-2 ring-pozia-coral/25 bg-pink-50/20 shadow-md cursor-pointer transition-all flex flex-col items-center justify-between gap-2.5'
              : 'p-3 sm:p-3.5 rounded-2xl bg-white border-2 border-stone-200/90 hover:border-stone-300 shadow-sm cursor-pointer transition-all flex flex-col items-center justify-between gap-2.5';
          }
          if (ind) {
            ind.className = isSelected
              ? 'setup-indicator-badge mt-1 px-2.5 py-0.5 rounded-full bg-pozia-coral text-white text-[10px] font-bold shadow-xs'
              : 'setup-indicator-badge mt-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-500 text-[10px] font-semibold';
            ind.textContent = isSelected ? '✔ Terpilih' : 'Pilih';
          }
        });

        const names = {
          '1x4': 'Strip 4 Pose',
          '1x3': 'Strip 3 Pose',
          '1x2': 'Strip 2 Pose',
          '2x2': 'Grid 2×2',
          'polaroid': 'Polaroid'
        };
        const ratios = {
          '1x4': '1:2.95',
          '1x3': '1:2.3',
          '1x2': '1:1.65',
          '2x2': '1:1 Square',
          'polaroid': 'Classic Chin'
        };
        const descs = {
          '1x4': '4 kali pengambilan foto vertikal photostrip. Desain bingkai bebas dipilih setelah foto selesai.',
          '1x3': '3 kali pengambilan foto vertikal lapang. Desain bingkai bebas dipilih setelah foto selesai.',
          '1x2': '2 kali pengambilan foto cepat vertikal. Desain bingkai bebas dipilih setelah foto selesai.',
          '2x2': '4 foto persegi 2x2 seimbang & modern. Desain bingkai bebas dipilih setelah foto selesai.',
          'polaroid': '1 foto portrait dengan bingkai Polaroid klasik. Desain bingkai bebas dipilih setelah foto selesai.'
        };

        const titleEl = document.getElementById('setup-selected-title');
        const ratioEl = document.getElementById('setup-selected-ratio');
        const descEl = document.getElementById('setup-selected-desc');
        const btnText = document.getElementById('setup-btn-text');

        if (titleEl) titleEl.textContent = names[State.layout] || 'Strip 4 Pose';
        if (ratioEl) ratioEl.textContent = ratios[State.layout] || '1:2.95';
        if (descEl) descEl.textContent = descs[State.layout] || '';
        if (btnText) btnText.textContent = `Buka Kamera (${State.targetPoseCount} Pose)`;

        LayoutSlideshow.init();
      },

      startCameraFromSetup() {
        State.photos = [];
        State.currentPoseIndex = 0;
        State.activeSlotToReplace = null;
        State.isRetakingSingle = false;
        LayoutSlideshow.stop();
        this.navigate('camera');
      },

      startSetupWithFrame(frameId) {
        State.frameTheme = frameId;
        this.navigate('setup');
      },

      setLayout(layout) {
        State.layout = layout;
        if (layout === '1x4') State.targetPoseCount = 4;
        else if (layout === '1x3') State.targetPoseCount = 3;
        else if (layout === '1x2') State.targetPoseCount = 2;
        else if (layout === '2x2') State.targetPoseCount = 4;
        else if (layout === 'polaroid') State.targetPoseCount = 1;
        else State.targetPoseCount = 4;

        // Update Editor layout buttons
        ['1x4', '1x3', '1x2', '2x2', 'polaroid'].forEach(l => {
          const fBtn = document.getElementById(`frame-layout-${l}`);
          if (fBtn) {
            fBtn.className = l === layout
              ? 'px-2.5 py-1 text-xs font-bold rounded-lg bg-pink-50 text-pozia-coral border border-pozia-coral transition-all shrink-0'
              : 'px-2.5 py-1 text-xs font-semibold rounded-lg bg-gray-100 text-gray-600 transition-all shrink-0';
          }
        });
      },

      scrollToSection(id) {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },

      navigate(stage) {
        State.stage = stage;
        ['home', 'setup', 'camera', 'review', 'editor', 'export'].forEach(s => {
          const sec = document.getElementById(`stage-${s}`);
          if (sec) {
            if (s === stage) {
              sec.classList.remove('hidden');
              sec.classList.remove('stage-transition');
              void sec.offsetWidth; // Force reflow to restart CSS animation cleanly
              sec.classList.add('stage-transition');
            } else {
              sec.classList.add('hidden');
              sec.classList.remove('stage-transition');
            }
          }
        });

        const header = document.getElementById('main-header');
        if (stage === 'camera') {
          header.classList.add('hidden');
          CameraStudio.init();
        } else {
          header.classList.remove('hidden');
          CameraStudio.stopStream();
        }

        if (stage === 'setup') {
          this.updateSetupUI();
        } else if (stage === 'review') {
          ReviewStudio.render();
        } else if (stage === 'editor') {
          EditorStudio.init();
        }
      },

      triggerGalleryUpload() {
        document.getElementById('gallery-file-input').click();
      },

      async loadImageFromFile(file) {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = e.target.result;
          };
          reader.readAsDataURL(file);
        });
      },

      async exportFinalImage() {
        if (document.fonts && document.fonts.ready) {
          try { await document.fonts.ready; } catch (e) { }
        }
        const t0 = performance.now();
        const exportCanvas = document.createElement('canvas');
        EditorStudio.renderToCanvas(exportCanvas, true);
        const dataUrl = exportCanvas.toDataURL('image/png', 1.0);
        State.lastRenderTime = Math.round(performance.now() - t0);

        document.getElementById('final-export-img').src = dataUrl;
        document.getElementById('diag-render-time').textContent = `${State.lastRenderTime} ms`;
        HistoryManager.save(dataUrl);
        this.playBTSLoop();
        this.navigate('export');
      },

      downloadFinalImage() {
        const img = document.getElementById('final-export-img');
        const link = document.createElement('a');
        link.download = `Pozia_Studio_${State.layout}_${Date.now()}.png`;
        link.href = img.src;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },

      playBTSLoop() {
        const canvas = document.getElementById('bts-loop-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const allFrames = State.btsBurstGroups.flat();
        if (allFrames.length === 0) {
          document.getElementById('bts-export-box').classList.add('hidden');
          return;
        }
        document.getElementById('bts-export-box').classList.remove('hidden');

        canvas.width = allFrames[0].width;
        canvas.height = allFrames[0].height;
        let idx = 0;
        if (this.btsInterval) clearInterval(this.btsInterval);
        this.btsInterval = setInterval(() => {
          ctx.drawImage(allFrames[idx], 0, 0);
          idx = (idx + 1) % allFrames.length;
        }, 220);
      },

      async exportBTSVideoHD() {
        const allFrames = State.btsBurstGroups.flat();
        if (allFrames.length === 0) return;
        const canvas = document.createElement('canvas');
        canvas.width = allFrames[0].width;
        canvas.height = allFrames[0].height;
        const ctx = canvas.getContext('2d');

        const stream = canvas.captureStream(25);
        let recorder;
        try {
          recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 4000000 });
        } catch (e) {
          recorder = new MediaRecorder(stream);
        }

        const chunks = [];
        recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Pozia_BehindTheScenes_${Date.now()}.webm`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        };

        recorder.start();
        for (let loop = 0; loop < 4; loop++) {
          for (let f of allFrames) {
            ctx.drawImage(f, 0, 0);
            await new Promise(r => setTimeout(r, 200));
          }
        }
        recorder.stop();
      },

      resetAndNew() {
        State.photos = [];
        State.btsBurstGroups = [];
        State.currentPoseIndex = 0;
        State.activeSlotToReplace = null;
        State.isRetakingSingle = false;
        State.currentFilter = FilterPresets[0];
        State.frameTheme = 'pixel-arcade';
        this.navigate('home');
      },

      openDiagnosticsModal() {
        document.getElementById('diagnostics-modal').classList.remove('hidden');
      },
      closeDiagnosticsModal() {
        document.getElementById('diagnostics-modal').classList.add('hidden');
      },
      openHistoryModal() {
        HistoryManager.render();
        document.getElementById('history-modal').classList.remove('hidden');
      },
      closeHistoryModal() {
        document.getElementById('history-modal').classList.add('hidden');
      },

      initPWA() {
        if ('serviceWorker' in navigator) {
          window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js').then(reg => {
              const el = document.getElementById('diag-sw-status');
              if (el) el.textContent = 'Aktif & Siap Offline (PWA v3.2)';
            }).catch(() => { });
          });
        }
      }
    };

    // Initialize application on DOM ready
    window.addEventListener('DOMContentLoaded', () => {
      App.init();
    });
  </script>
</body>
</html>
