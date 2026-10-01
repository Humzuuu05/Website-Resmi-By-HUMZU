/**
 * Jatiluwih Organik - Master Interactive Scripts (Bahasa Indonesia)
 * Menangani transisi header, navigasi drawer, katalog 7 varian produk organik,
 * filter kategori, modal detail produk (Quick View), pembaca artikel, tab toko, dan formulir kontak.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileDrawer();
  initSmoothScroll();
  initProductCatalog();
  initStoresTabs();
  initModals();
  initContactForm();
  initNewsletter();
  initProcessBand();
});

/* ==========================================================================
   1. HEADER SCROLL & ACTIVE LINK STATE
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const isBottom = (scrollY + windowHeight) >= (docHeight - 80);

    if (isBottom) {
      header.classList.add('at-bottom');
    } else {
      header.classList.remove('at-bottom');
    }

    if (scrollY > 50) {
      header.classList.add('scrolled');
      header.classList.remove('transparent-mode');
    } else {
      header.classList.remove('scrolled');
      header.classList.add('transparent-mode');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Scrollspy active nav links
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   2. NAVIGASI DRAWER MOBILE
   ========================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobileToggle');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const closeBtn = document.getElementById('drawerClose');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!toggleBtn || !drawer || !overlay) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   3. SMOOTH SCROLL
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   4. KATALOG 10 PRODUK RESMI PT PANGAN MASA DEPAN (BAHASA INDONESIA)
   ========================================================================== */
const PRODUCTS_DATA = [
  {
    id: 'prod-cruise',
    name: 'Beras Cruise',
    subName: 'Premium Quality Rice',
    category: 'premium',
    categoryLabel: 'Beras Premium',
    badge: 'Produk Unggulan',
    badgeClass: '',
    image: 'assets/images/mockups/pouch_cruise_front.png',
    summary: 'Beras mutu premium dengan bulir utuh, putih bening alami, dan diproses dengan teknologi penggilingan modern berstandar tinggi.',
    benefits: [
      'Bulir putih bening utuh dengan derajat sosoh optimal 95%',
      'Tekstur nasi sangat pulen, wangi, dan lembut alami',
      'Bebas dari bahan pengawet, pewarna, & pengharum sintetis',
      'Pilihan utama untuk sajian istimewa keluarga'
    ],
    details: 'Beras Cruise adalah lini produk beras kualitas tertinggi dari PT Pangan Masa Depan. Diproduksi dari varietas padi unggulan yang diolah melalui mesin penggilingan presisi modern di fasilitas Indramayu, menghasilkan butiran beras bersih murni dengan cita rasa pulen terbaik.',
    netto: '5 Kg',
    origin: 'Kandanghaur, Indramayu, Jawa Barat'
  },
  {
    id: 'prod-pagi-jaya',
    name: 'Beras Pagi Jaya',
    subName: 'Beras Keluarga Berkualitas',
    category: 'harian',
    categoryLabel: 'Beras Harian',
    badge: 'Paling Laris',
    badgeClass: '',
    image: 'assets/images/mockups/pouch_pagijaya_front.png',
    summary: 'Beras keluarga berkualitas dengan jaminan mutu konsisten, tekstur pulen nikmat, dan harga yang sangat bersahabat.',
    benefits: [
      'Tekstur pulen nikmat khas selera keluarga Indonesia',
      'Derajat sosoh 95% dengan butir patah rendah (maks. 15%)',
      'Tanpa pengawet, tanpa pewarna, dan tanpa pengharum',
      'Pilihan ekonomis dengan jaminan mutu teruji'
    ],
    details: 'Beras Pagi Jaya merupakan produk andalan keluarga yang diproses dari gabah segar pilihan petani lumbung pangan Indramayu. Memberikan santapan lezat, sehat, dan berenergi setiap hari.',
    netto: '5 Kg',
    origin: 'Kandanghaur, Indramayu, Jawa Barat'
  },
  {
    id: 'prod-bintang-mahkota',
    name: 'Bintang Mahkota',
    subName: 'Beras Premium Pulen Harum',
    category: 'premium',
    categoryLabel: 'Beras Premium',
    badge: 'Bersih Pulen Harum',
    badgeClass: 'gold',
    image: 'assets/images/mockups/pouch_bintangmahkota_front.png',
    summary: 'Beras premium dengan bulir bersih, tekstur pulen alami, dan aroma harum segar yang menggugah selera.',
    benefits: [
      'Bersih, pulen, dan harum alami dari bulir pilihan',
      'Derajat sosoh 95% dengan butir patah minimal 15%',
      'Bebas pengawet, pewangi, dan pewarna kimiawi',
      'Sangat nikmat disantap hangat bersama lauk nusantara'
    ],
    details: 'Beras Bintang Mahkota diproduksi dengan standar higienitas tinggi. Menghadirkan nasi putih mengembang pulen yang harum dan lembut di setiap suapan keluarga.',
    netto: '5 Kg',
    origin: 'Kandanghaur, Indramayu, Jawa Barat'
  },
  {
    id: 'prod-bpj',
    name: 'Beras BPJ',
    subName: 'Naga Bintang Mahkota',
    category: 'harian',
    categoryLabel: 'Beras Harian',
    badge: 'Premium Quality',
    badgeClass: 'gold',
    image: 'assets/images/mockups/pouch_bpj_front.png',
    summary: 'Beras mutu premium Naga Bintang Mahkota dengan daya kembang nasi tinggi, pulen pas, dan performa tanak stabil.',
    benefits: [
      'Nasi mengembang banyak dan mekar sempurna',
      'Tekstur pulen pas, sangat cocok untuk keluarga dan usaha kuliner',
      'Tanpa bahan kimia pemutih, pewarna, dan pengharum',
      'Kualitas konsisten berstandar SNI beras premium'
    ],
    details: 'Beras BPJ (Naga Bintang Mahkota) menghadirkan kepuasan rasa dengan butiran yang rapi dan bersih. Pilihan tepat untuk konsumsi harian keluarga maupun kebutuhan bisnis makanan.',
    netto: '5 Kg',
    origin: 'Kandanghaur, Indramayu, Jawa Barat'
  },
  {
    id: 'prod-macan-pandan',
    name: 'Macan Manis Cantik',
    subName: 'Beras Pandan Wangi',
    category: 'khusus',
    categoryLabel: 'Beras Aromatik',
    badge: 'Pandan Wangi',
    badgeClass: '',
    image: 'assets/images/mockups/pouch_macan_front.png',
    summary: 'Beras varietas pandan wangi istimewa dengan aroma harum semerbak alami dan tekstur pulen legit lembut.',
    benefits: [
      'Wangi pandan murni semerbak saat nasi ditanak',
      'Bulir bulat lonjong bening khas pandan wangi asli',
      'Tekstur pulen legit, sangat lembut di lidah',
      '100% alami tanpa penambahan esens kimiawi buatan'
    ],
    details: 'Beras Macan Manis Cantik menghadirkan kemewahan aroma pandan wangi alami langsung dari tanah subur Jawa Barat. Menjadikan setiap santapan istimewa layaknya hidangan restoran ternama.',
    netto: '5 Kg',
    origin: 'Kandanghaur, Indramayu, Jawa Barat'
  },
  {
    id: 'prod-donga-kyai',
    name: 'Beras Donga Kyai',
    subName: 'Long Grain Rice Premium',
    category: 'khusus',
    categoryLabel: 'Beras Long Grain',
    badge: 'Pilihan Berkah',
    badgeClass: '',
    image: 'assets/images/mockups/pouch_dongakyai_front.png',
    summary: 'Beras bulir panjang (long grain) pilihan dengan rasa gurih bersih, pulen nikmat, dan kebaikan berkah nusantara.',
    benefits: [
      'Bulir beras panjang ramping, utuh dan bersih murni',
      'Tekstur pulen harum, tidak mudah benyek saat dimasak',
      'Tanpa pengawet, tanpa pewangi, dan tanpa pewarna',
      'Sangat cocok untuk sajian nasi kebuli, briyani, maupun nasi putih harian'
    ],
    details: 'Beras Donga Kyai diproses khusus dari varietas long grain pilihan melalui sortasi warna optik berteknologi tinggi, menghasilkan beras bulir panjang bermutu tinggi yang bersih dan berkah.',
    netto: '5 Kg',
    origin: 'Kandanghaur, Indramayu, Jawa Barat'
  },
  {
    id: 'prod-sultan-beras',
    name: 'Sultan Beras',
    subName: 'Beras Super Berasnya Sultan',
    category: 'premium',
    categoryLabel: 'Beras Super',
    badge: 'Berasnya Sultan',
    badgeClass: 'gold',
    image: 'assets/images/mockups/pouch_sultanberas_front.png',
    summary: 'Beras kelas super dengan bulir berkilau jernih, kepulenan maksimal, dan cita rasa gurih istimewa para sultan.',
    benefits: [
      'Bulir jernih utuh dengan derajat sosoh prima 95%',
      'Rasa nasi gurih pulen istimewa yang memanjakan lidah',
      'Bebas dari bahan pengawet, pewarna, dan pengharum sintetis',
      'Diolah di fasilitas pabrik modern milik bangsa (PMD)'
    ],
    details: 'Sultan Beras adalah mahakarya beras premium dengan standar mutu tertinggi. Setiap bulir dipilih secara ketat untuk menghadirkan santapan berkelas yang mewah di meja makan keluarga Anda.',
    netto: '5 Kg',
    origin: 'Kandanghaur, Indramayu, Jawa Barat'
  },
  {
    id: 'prod-nickwell',
    name: 'Beras Nick Well',
    subName: 'Selected Quality Rice',
    category: 'premium',
    categoryLabel: 'Beras Premium',
    badge: '100% Guaranteed',
    badgeClass: 'gold',
    image: 'assets/images/mockups/pouch_nickwell_front.png?v=rice',
    summary: 'Beras berbutir rapi dan mengkilap alami, diproduksi dengan kontrol kualitas yang sangat ketat dan terjamin.',
    benefits: [
      'Bulir beras teratur, bersih, dan bebas debu bekatul',
      'Tekstur pulen mantap dan tidak lengket berlebihan',
      'Aroma nasi harum segar alami tanpa bahan kimia',
      'Derajat sosoh 95% dengan jaminan mutu 100%'
    ],
    details: 'Beras Nick Well dirancang untuk memenuhi ekspektasi konsumen yang mendambakan kepuasan rasa dan tampilan nasi yang menggugah selera. Diolah secara presisi untuk mempertahankan nutrisi alami beras.',
    netto: '5 Kg',
    origin: 'Kandanghaur, Indramayu, Jawa Barat'
  },
  {
    id: 'prod-mamaku',
    name: 'Beras Mamaku',
    subName: '100% Bulir Pilihan Keluarga',
    category: 'harian',
    categoryLabel: 'Beras Keluarga',
    badge: 'Kasih Ibu',
    badgeClass: '',
    image: 'assets/images/mockups/pouch_mamaku_front.png',
    summary: 'Beras pilihan penuh kehangatan keluarga dengan bulir pulen lembut, putih bersih, dan disukai anak-anak hingga orang tua.',
    benefits: [
      '100% bulir pilihan dengan tekstur bersih, pulen, dan harum',
      'Nasi tetap lembut dan empuk meski sudah dingin',
      'Tanpa pengawet, pewangi, dan pewarna sintetis',
      'Sangat pas untuk bekal sekolah dan santapan keluarga sehari-hari'
    ],
    details: 'Beras Mamaku menghadirkan kehangatan masakan rumah dengan cita rasa nasi yang pulen dan lembut. Diproses secara higienis untuk menjaga kesehatan dan nutrisi seluruh anggota keluarga.',
    netto: '5 Kg',
    origin: 'Kandanghaur, Indramayu, Jawa Barat'
  },
  {
    id: 'prod-walemu',
    name: 'Beras Wa Lemu',
    subName: 'Beras Premium Rasa Gurih',
    category: 'premium',
    categoryLabel: 'Beras Premium',
    badge: 'Favorit Konsumen',
    badgeClass: 'gold',
    image: 'assets/images/mockups/pouch_walemu_front.png',
    summary: 'Beras berkualitas super dengan tingkat kepulenan pas, rasa gurih alami, dan kadar patahan yang sangat minim.',
    benefits: [
      'Kadar patahan (broken) sangat rendah dan seragam (maks 15%)',
      'Tekstur empuk, pulen, dan mengembang sempurna',
      'Higienis dengan proses seleksi bulir otomatis',
      'Tidak mudah basi atau berair saat disimpan di rice cooker'
    ],
    details: 'Beras Wa Lemu menghadirkan kelezatan nasi putih bermutu tinggi yang telah teruji dan menjadi favorit ribuan keluarga. Sangat cocok dipadukan dengan berbagai hidangan nusantara maupun sajian modern.',
    netto: '5 Kg',
    origin: 'Kandanghaur, Indramayu, Jawa Barat'
  }
];

function initProductCatalog() {
  const track = document.getElementById('productCarouselTrack');
  const wrapper = document.querySelector('.product-carousel-wrapper');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsContainer = document.getElementById('carouselDots');

  if (!track) return;

  // Duplikasi 2 set 9 produk agar looping berjalan tanpa jeda (seamless infinite marquee)
  const carouselList = [...PRODUCTS_DATA, ...PRODUCTS_DATA];

  track.innerHTML = carouselList.map((prod, index) => `
    <div class="carousel-pouch-item" data-id="${prod.id}" data-index="${index % PRODUCTS_DATA.length}" role="button" tabindex="0" title="Klik untuk spesifikasi ${prod.name}">
      <div class="pouch-img-wrap">
        <img src="${prod.image}" alt="${prod.name}" loading="lazy" draggable="false" />
      </div>
      <div class="carousel-pouch-info">
        <h3 class="carousel-pouch-title">${prod.name}</h3>
        <span class="carousel-pouch-sub">${prod.categoryLabel}</span>
      </div>
    </div>
  `).join('');

  // Render 9 titik indikator pagination
  if (dotsContainer) {
    dotsContainer.innerHTML = PRODUCTS_DATA.map((_, index) => `
      <button class="carousel-dot ${index === 0 ? 'active' : ''}" data-index="${index}" aria-label="Lihat produk ke-${index + 1}"></button>
    `).join('');
  }

  const pouchItems = track.querySelectorAll('.carousel-pouch-item');
  const dots = dotsContainer ? dotsContainer.querySelectorAll('.carousel-dot') : [];

  let isPaused = false;
  let isDragging = false;
  let startX = 0;
  let scrollStart = 0;
  const scrollSpeed = 0.85; // Kecepatan geser otomatis yang lembut

  // Auto-scrolling looping animation via requestAnimationFrame
  function autoScrollStep() {
    if (!isPaused && !isDragging) {
      track.scrollLeft += scrollSpeed;
      const halfWidth = track.scrollWidth / 2;
      if (track.scrollLeft >= halfWidth) {
        track.scrollLeft -= halfWidth;
      }
    }
    requestAnimationFrame(autoScrollStep);
  }
  requestAnimationFrame(autoScrollStep);

  // Update indikator titik aktif
  const updateDots = () => {
    const halfWidth = track.scrollWidth / 2;
    if (halfWidth <= 0) return;
    const currentScroll = track.scrollLeft % halfWidth;
    const itemStep = halfWidth / PRODUCTS_DATA.length;
    const activeIndex = Math.min(
      PRODUCTS_DATA.length - 1,
      Math.max(0, Math.floor((currentScroll + itemStep * 0.35) / itemStep))
    );
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === activeIndex);
    });
  };

  track.addEventListener('scroll', updateDots, { passive: true });

  // Jeda saat mouse melayang (hover pause)
  if (wrapper) {
    wrapper.addEventListener('mouseenter', () => { isPaused = true; });
    wrapper.addEventListener('mouseleave', () => { if (!isDragging) isPaused = false; });
  }

  // Tombol panah geser kiri dan kanan
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const halfWidth = track.scrollWidth / 2;
      if (track.scrollLeft <= 20) {
        track.scrollLeft += halfWidth;
      }
      track.scrollBy({ left: -280, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const halfWidth = track.scrollWidth / 2;
      if (track.scrollLeft >= halfWidth - 20) {
        track.scrollLeft -= halfWidth;
      }
      track.scrollBy({ left: 280, behavior: 'smooth' });
    });
  }

  // Klik dot untuk berpindah langsung ke produk tersebut
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.getAttribute('data-index'), 10);
      const halfWidth = track.scrollWidth / 2;
      const itemStep = halfWidth / PRODUCTS_DATA.length;
      track.scrollTo({ left: index * itemStep, behavior: 'smooth' });
    });
  });

  // Fitur drag mouse untuk geser leluasa
  track.addEventListener('mousedown', (e) => {
    isDragging = true;
    isPaused = true;
    startX = e.pageX - track.offsetLeft;
    scrollStart = track.scrollLeft;
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      setTimeout(() => { isPaused = false; }, 1000);
    }
  });

  track.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollStart - walk;
    const halfWidth = track.scrollWidth / 2;
    if (track.scrollLeft >= halfWidth) track.scrollLeft -= halfWidth;
    if (track.scrollLeft < 0) track.scrollLeft += halfWidth;
  });

  // Touch event mobile
  track.addEventListener('touchstart', () => { isPaused = true; }, { passive: true });
  track.addEventListener('touchend', () => {
    setTimeout(() => { isPaused = false; }, 1500);
  }, { passive: true });

  // Klik pouch untuk membuka katalog produk lengkap di products.html
  pouchItems.forEach(item => {
    const handleOpen = () => {
      const prodId = item.getAttribute('data-id');
      window.location.href = `products.html#${prodId}`;
    };

    item.addEventListener('click', handleOpen);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOpen();
      }
    });
  });

  // Resume auto-scroll saat modal ditutup
  const modalBackdrop = document.getElementById('appModal');
  if (modalBackdrop) {
    const observer = new MutationObserver(() => {
      if (!modalBackdrop.classList.contains('active')) {
        isPaused = false;
      }
    });
    observer.observe(modalBackdrop, { attributes: true, attributeFilter: ['class'] });
  }
}

/* ==========================================================================
   5. LOKASI TOKO & TAB MARKETPLACE (BAHASA INDONESIA)
   ========================================================================== */
const ONLINE_STORES = [
  { name: 'Shopee Official (Jakarta)', region: 'Jakarta & Jawa Barat', desc: 'Pengiriman sameday & reguler cepat ke seluruh Jabodetabek', link: 'https://shopee.co.id', icon: 'fas fa-shopping-bag', badge: 'Sameday' },
  { name: 'Tokopedia Official (Jakarta)', region: 'Jakarta & Jawa Barat', desc: 'Official Store terverifikasi dengan layanan Bebas Ongkir', link: 'https://tokopedia.com', icon: 'fas fa-store', badge: 'Official Store' },
  { name: 'Shopee Official (Surabaya)', region: 'Jawa Timur & Bali', desc: 'Pengiriman langsung dari gudang regional Jawa Timur', link: 'https://shopee.co.id', icon: 'fas fa-shopping-bag', badge: 'Kirim Cepat' },
  { name: 'Tokopedia Official (Surabaya)', region: 'Jawa Timur & Bali', desc: 'Kemasan vacuum pack aman untuk pengiriman antarkota', link: 'https://tokopedia.com', icon: 'fas fa-store', badge: 'Official Store' },
  { name: 'Shopee Official (Bali)', region: 'Bali & Nusra', desc: 'Langsung dari gudang distribusi utama Kota Denpasar, Bali', link: 'https://shopee.co.id', icon: 'fas fa-shopping-bag', badge: 'Asli Bali' },
  { name: 'Blibli Official Store', region: 'Seluruh Indonesia', desc: 'Jaminan produk 100% original dengan gratis ongkir se-Indonesia', link: 'https://blibli.com', icon: 'fas fa-tag', badge: 'Terverifikasi' }
];

const SUPERMARKETS = [
  { name: 'Grand Lucky Superstore', city: 'jakarta', address: 'SCBD, Radio Dalam, BSD, Cinere - Jakarta', desc: 'Koleksi lengkap 7 varietas beras organik Jatiluwih', icon: 'fas fa-store-alt' },
  { name: 'Kem Chicks', city: 'jakarta', address: 'Pacific Place & Kemang - Jakarta Selatan', desc: 'Tersedia kemasan khusus beras hitam & beras merah', icon: 'fas fa-store-alt' },
  { name: 'Ranch Market', city: 'jakarta', address: 'Pondok Indah, Grand Indonesia, Senayan - Jakarta', desc: 'Mitra supermarket organik premium terpercaya', icon: 'fas fa-store-alt' },
  { name: 'The Food Hall', city: 'jakarta', address: 'Plaza Senayan, Senayan City, Kelapa Gading - Jakarta', desc: 'Area Organic & Healthy Food section', icon: 'fas fa-store-alt' },
  { name: 'Market City', city: 'jakarta', address: 'Pantai Indah Kapuk (PIK) & Muara Karang - Jakarta', desc: 'Stok beras segar selalu tersedia setiap pekan', icon: 'fas fa-store-alt' },
  { name: 'Farmers Market', city: 'jakarta', address: 'Bintaro, Serpong, Kelapa Gading - Jabodetabek', desc: 'Tersedia pilihan beras harian dan beras sehat', icon: 'fas fa-store-alt' },
  { name: 'Pepito Supermarket', city: 'bali', address: 'Canggu, Seminyak, Sanur, Ubud - Bali', desc: 'Jaringan supermarket premium terbesar di Pulau Bali', icon: 'fas fa-store-alt' },
  { name: 'Bintang Supermarket', city: 'bali', address: 'Seminyak, Ubud, Hayam Wuruk - Bali', desc: 'Favorit wisatawan mancanegara & pecinta gaya hidup sehat', icon: 'fas fa-store-alt' },
  { name: 'Popular Deli', city: 'bali', address: 'Sanur & Nusa Dua - Bali', desc: 'Kemasan vacuum 1 Kg selalu tersedia segar', icon: 'fas fa-store-alt' },
  { name: 'Hokky Supermarket', city: 'surabaya', address: 'Graha Family, Darmo Harapan, Merr - Surabaya', desc: 'Supermarket gourmet terkemuka di Kota Surabaya', icon: 'fas fa-store-alt' },
  { name: 'Ranch Market Surabaya', city: 'surabaya', address: 'Galaxy Mall & Basuki Rahmat - Surabaya', desc: 'Pilihan lengkap varietas beras organik Jatiluwih', icon: 'fas fa-store-alt' }
];

function initStoresTabs() {
  const onlineTabBtn = document.getElementById('tabOnline');
  const supermarketTabBtn = document.getElementById('tabSupermarket');
  const cityFilterWrap = document.getElementById('cityFilterContainer');
  const storesGrid = document.getElementById('storesGrid');
  const cityPills = document.querySelectorAll('.city-pill');

  if (!storesGrid) return;

  let currentTab = 'online';
  let currentCity = 'all';

  const renderStores = () => {
    if (currentTab === 'online') {
      cityFilterWrap.style.display = 'none';
      storesGrid.innerHTML = ONLINE_STORES.map(store => `
        <div class="store-card">
          <div class="store-icon"><i class="${store.icon}"></i></div>
          <div class="store-info">
            <span class="store-badge">${store.badge}</span>
            <h4>${store.name}</h4>
            <p>${store.desc}</p>
            <a href="${store.link}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding: 6px 16px; font-size: 0.78rem; margin-top: 6px;">
              Buka Toko Online <i class="fas fa-external-link-alt" style="font-size: 0.7rem; margin-left: 4px;"></i>
            </a>
          </div>
        </div>
      `).join('');
    } else {
      cityFilterWrap.style.display = 'flex';
      const filtered = currentCity === 'all'
        ? SUPERMARKETS
        : SUPERMARKETS.filter(s => s.city === currentCity);

      storesGrid.innerHTML = filtered.map(s => `
        <div class="store-card">
          <div class="store-icon" style="color: var(--color-paddy-green);"><i class="${s.icon}"></i></div>
          <div class="store-info">
            <span class="store-badge" style="background-color: rgba(90, 50, 24, 0.1); color: var(--color-terracotta);">${s.city.toUpperCase()}</span>
            <h4>${s.name}</h4>
            <p style="margin-bottom: 4px; font-weight: 500;">${s.address}</p>
            <p style="font-size: 0.78rem;">${s.desc}</p>
          </div>
        </div>
      `).join('');
    }
  };

  renderStores();

  if (onlineTabBtn && supermarketTabBtn) {
    onlineTabBtn.addEventListener('click', () => {
      onlineTabBtn.classList.add('active');
      supermarketTabBtn.classList.remove('active');
      currentTab = 'online';
      renderStores();
    });

    supermarketTabBtn.addEventListener('click', () => {
      supermarketTabBtn.classList.add('active');
      onlineTabBtn.classList.remove('active');
      currentTab = 'supermarket';
      renderStores();
    });
  }

  cityPills.forEach(pill => {
    pill.addEventListener('click', () => {
      cityPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCity = pill.getAttribute('data-city');
      renderStores();
    });
  });
}

/* ==========================================================================
   6. DIALOG MODAL (DETAIL PRODUK & ARTIKEL)
   ========================================================================== */
function initModals() {
  const modalBackdrop = document.getElementById('appModal');
  const modalClose = document.getElementById('modalClose');

  if (!modalBackdrop) return;

  const closeModal = () => {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });

  // Event listener artikel
  document.querySelectorAll('.article-card').forEach(card => {
    card.addEventListener('click', () => {
      const articleId = card.getAttribute('data-article-id');
      openArticleModal(articleId);
    });
  });
}

function openQuickViewModal(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  const modalBackdrop = document.getElementById('appModal');
  const modalBody = document.getElementById('modalDynamicContent');

  if (!product || !modalBackdrop || !modalBody) return;

  const waText = encodeURIComponent(`Halo PT Pangan Masa Depan, saya ingin bertanya dan memesan produk ${product.name}. Mohon informasi harga dan ketersediaan stok.`);

  modalBody.innerHTML = `
    <div class="quickview-layout">
      <div class="quickview-image-wrap">
        <img src="${product.image}" alt="${product.name}" />
      </div>
      <div class="quickview-details">
        <span class="quickview-tag">${product.categoryLabel.toUpperCase()} • ${product.badge}</span>
        <h3>${product.name}</h3>
        <h4 style="font-size: 1rem; color: var(--color-warm-amber); margin-bottom: 12px; font-weight: 500;">${product.subName}</h4>
        <p>${product.details}</p>
        <div style="background-color: var(--bg-primary); padding: 14px 18px; border-radius: 8px; margin-bottom: 20px; font-size: 0.85rem;">
          <div style="margin-bottom: 5px;"><strong>Berat Kemasan:</strong> ${product.netto}</div>
          <div style="margin-bottom: 5px;"><strong>Fasilitas Pengolahan:</strong> ${product.origin}</div>
          <div style="margin-bottom: 5px;"><strong>Standar Mutu:</strong> SNI Beras Premium & Harian, Bebas Kimia/Pemutih</div>
          <div><strong>Keunggulan:</strong> ${product.benefits.slice(0, 2).join(' • ')}</div>
        </div>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <a href="https://wa.me/6281138800034?text=${waText}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="flex: 1;">
            <i class="fab fa-whatsapp"></i> Pesan via WhatsApp
          </a>
          <a href="#contact" class="btn btn-secondary" style="flex: 1;" onclick="document.getElementById('appModal').classList.remove('active'); document.body.style.overflow='';">
            <i class="fas fa-envelope"></i> Hubungi Sales
          </a>
        </div>
      </div>
    </div>
  `;

  modalBackdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

const ARTICLES_DATA = {
  'art-1': {
    title: 'Beras Hitam: Bulir-Bulir Kuno yang Juara Reputasinya',
    tag: 'Nutrisi & Sejarah',
    date: '14 Juni 2026',
    image: 'assets/images/blog-1.jpg',
    content: `
      <p>Dulu hanya boleh dikonsumsi oleh kalangan kaisar dan bangsawan kerajaan di Asia kuno, beras hitam menyimpan warisan gizi yang tak tertandingi. Mengapa varietas ini dijuluki sebagai bulir terlarang? Karena kelangkaannya serta khasiatnya yang luar biasa dalam memperpanjang usia dan menjaga vitalitas fisik.</p>
      <h4 style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--color-terracotta); margin: 20px 0 10px;">Kekuatan Pigmen Antosianin Alami</h4>
      <p>Warna ungu kehitaman pada Beras Hitam Jatiluwih berasal dari pigmen antosianin alami yang sama persis seperti pada buah blueberry murni, namun dengan konsentrasi yang jauh lebih padat. Antosianin dikenal sebagai salah satu antioksidan terkuat yang membantu menangkal radikal bebas, memperkuat dinding pembuluh darah, dan menjaga kesehatan kardiovaskular.</p>
      <h4 style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--color-terracotta); margin: 20px 0 10px;">Tips Memasak Beras Hitam</h4>
      <p>Rendam beras hitam selama 20–30 menit sebelum dimasak dengan perbandingan air 1:2. Aromanya yang manis gurih seperti kacang panggang sangat cocok dinikmati sebagai hidangan utama maupun bubur sehat bernutrisi tinggi.</p>
    `
  },
  'art-2': {
    title: 'Rahasia Perawatan Kulit yang Tersembunyi di Stoples Beras Anda',
    tag: 'Kecantikan & Kesehatan',
    date: '08 Juni 2026',
    image: 'assets/images/blog-2.jpg',
    content: `
      <p>Air cucian beras telah menjadi rahasia kecantikan wanita di Asia selama berabad-abad. Dari putri keraton di Jawa hingga wanita di pedesaan Bali, air beras organik murni digunakan sebagai toner alami dan masker pencerah wajah.</p>
      <h4 style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--color-terracotta); margin: 20px 0 10px;">Kandungan Vitamin B & Asam Ferulat</h4>
      <p>Beras organik yang bebas dari residu pestisida kimia menghasilkan air beras yang kaya akan allantoin, asam ferulat, serta vitamin E. Kandungan ini meredakan kemerahan, mengecilkan pori-pori, dan memberikan kelembapan intens pada lapisan epidermis kulit.</p>
    `
  },
  'art-3': {
    title: 'Nasi Putih Tanpa Lonjakan Gula Darah — Apakah Itu Mungkin?',
    tag: 'Sains & Gaya Hidup',
    date: '28 Mei 2026',
    image: 'assets/images/blog-3.jpg',
    content: `
      <p>Bagi sebagian orang, menikmati sepiring nasi putih hangat sering kali diiringi rasa cemas akan lonjakan gula darah dan kantuk setelah makan. Namun, Beras Organik Sehat Jatiluwih menghadirkan terobosan dengan skor Indeks Glikemik 34.</p>
      <h4 style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--color-terracotta); margin: 20px 0 10px;">Mengapa Skor GI 34 Begitu Penting?</h4>
      <p>Secara ilmiah, makanan dengan GI di bawah 55 dikategorikan sebagai Low GI. Pada Beras Sehat Jatiluwih, karbohidrat dicerna secara perlahan dan bertahap ke dalam aliran darah, menjaga pasokan energi stabil sepanjang hari tanpa menyebabkan lonjakan insulin yang tajam.</p>
    `
  },
  'art-4': {
    title: 'Dari Ladang di Bali dan Jawa ke Meja Makan Anda',
    tag: 'Komunitas & Warisan',
    date: '15 Mei 2026',
    image: 'assets/images/blog-4.jpg',
    content: `
      <p>Bersertifikat organik sejak 2004, Beras Organik Jatiluwih bukan sekadar beras di rak toko; ini adalah dedikasi ratusan keluarga petani lokal yang menjaga sistem irigasi Subak — warisan budaya dunia UNESCO yang telah lestari lebih dari 10 abad.</p>
      <h4 style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--color-terracotta); margin: 20px 0 10px;">Filosofi Tri Hita Karana</h4>
      <p>Setiap bulir padi dibudidayakan dengan menghormati keselarasan antara manusia dengan Tuhan, manusia dengan sesama, dan manusia dengan alam semesta. Melalui pembelian beras organik, Anda turut menjamin kesejahteraan petani dan keberlanjutan tanah Bali untuk generasi mendatang.</p>
    `
  }
};

function openArticleModal(articleId) {
  const article = ARTICLES_DATA[articleId];
  const modalBackdrop = document.getElementById('appModal');
  const modalBody = document.getElementById('modalDynamicContent');

  if (!article || !modalBackdrop || !modalBody) return;

  modalBody.innerHTML = `
    <div class="article-modal-content">
      <div style="height: 280px; overflow: hidden; border-radius: 12px; margin-bottom: 24px;">
        <img src="${article.image}" alt="${article.title}" style="width: 100%; height: 100%; object-fit: cover;" />
      </div>
      <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 12px;">
        <span class="quickview-tag" style="margin-bottom: 0;">${article.tag}</span>
        <span style="font-size: 0.82rem; color: var(--text-light);"><i class="far fa-calendar-alt"></i> ${article.date}</span>
      </div>
      <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--color-terracotta); line-height: 1.25; margin-bottom: 20px;">${article.title}</h2>
      <div style="font-size: 0.98rem; color: var(--text-main); line-height: 1.8;">
        ${article.content}
      </div>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.85rem; color: var(--text-muted);">Jatiluwih Organik Insights</span>
        <button class="btn btn-primary" onclick="document.getElementById('modalClose').click();" style="padding: 8px 20px; font-size: 0.85rem;">
          Tutup Bacaan
        </button>
      </div>
    </div>
  `;

  modalBackdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/* ==========================================================================
   7. FORMULIR KONTAK
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#contactName').value.trim();
    const email = form.querySelector('#contactEmail').value.trim();
    const message = form.querySelector('#contactMessage').value.trim();

    if (!name || !email || !message) {
      showToast('Mohon lengkapi semua kolom yang wajib diisi.');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
      form.reset();
      showToast(`Terima kasih, ${name}! Pesan Anda telah berhasil dikirim.`);
    }, 1200);
  });
}

/* ==========================================================================
   8. LANGGANAN NAWALA (NEWSLETTER)
   ========================================================================== */
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = form.querySelector('.newsletter-input');
    const email = emailInput.value.trim();

    if (!email || !email.includes('@')) {
      showToast('Silakan masukkan alamat email yang valid.');
      return;
    }

    emailInput.value = '';
    showToast('Terima kasih! Anda telah terdaftar dalam nawala Jatiluwih Organik.');
  });
}

/* ==========================================================================
   9. NOTIFIKASI TOAST
   ========================================================================== */
function showToast(message) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* ==========================================================================
   10. PROCESS BAND — DIAGRAM ALUR PRODUKSI (PAPAN PROSES 04)
   ========================================================================== */
const PROCESS_DATA = {
  title: "Dari Gabah ke Beras Kemasan",
  note: "Alur kerja terintegrasi 8 stasiun pengolahan modern di fasilitas PMD Kandanghaur — setiap batch terukur, tercatat, dan dapat ditelusuri dari gabah basah hingga beras kemasan bermerk.",
  moreLabel: "Rincian",
  closeLabel: "Tutup",
  from: {
    label: "Padi",
    image: "assets/images/tanaman-padi-transparent.png",
  },
  to: {
    label: "Beras kemasan",
    image: "assets/images/mockups/pouch_cruise_front.png",
  },
  steps: [
    {
      step: "01", title: "Intake / Reception", unit: "PMD-1",
      body: "Timbang, uji mutu, dan penomoran batch.",
      image: "images/feature-milling.jpg",
      detail: {
        body: ["Padi melewati jembatan timbang dan titik uji mutu sebelum dibongkar. Kadar air, kebersihan, dan varietas diukur di tempat, lalu seluruh hasilnya terikat pada satu nomor batch yang mengikuti padi itu sampai keluar sebagai beras kemasan."],
        points: ["Diukur: berat, kadar air, varietas, dan asal", "Masuk: padi dari petani, kelompok tani, dan pemasok"],
      },
    },
    {
      step: "02", title: "Cleaning & Aspiration", unit: "PMD-1",
      body: "Ayakan bertingkat dan hisapan udara sebelum pengeringan.",
      image: "images/facility-cleaning.jpg",
      detail: {
        body: ["Padi dibersihkan sebelum mencapai pengering. Ayakan bertingkat dan hisapan udara memisahkan jerami, debu, batu, dan partikel logam, sehingga yang dikeringkan hanya padi — sekaligus menjaga presisi mesin pada tahap-tahap berikutnya."],
        points: ["Dipisahkan: jerami, debu, batu, dan partikel logam", "Keluar: padi bersih siap dikeringkan"],
      },
    },
    {
      step: "03", title: "Drying", unit: "PMD-1",
      body: "Penurunan kadar air bertahap dengan suhu terkendali.",
      image: "images/facility-drying.jpg",
      detail: {
        body: ["Pengeringan berjalan bertahap dengan suhu dan laju yang dikendalikan. Penurunan kadar air yang terlalu cepat menimbulkan retakan di dalam butir, sehingga prosesnya diatur untuk menjaga butir tetap utuh sampai penggilingan, bukan untuk mengejar waktu."],
        points: ["Dikendalikan: suhu, laju, dan lama pengeringan", "Dicatat: kadar air masuk dan keluar per batch"],
      },
    },
    {
      step: "04", title: "Hulling", unit: "PMD-1",
      body: "Pelepasan sekam pada tekanan rol yang diatur.",
      image: "images/facility-hulling.jpg",
      detail: {
        body: ["Sekam dilepas dari butir beras pada tekanan rol yang diatur agar butir tidak ikut pecah. Sekam yang terpisah tidak berakhir sebagai limbah: ia dikumpulkan sebagai bahan baku pelet energi terbarukan."],
        points: ["Keluar: beras pecah kulit — bahan baku tahap penyosohan", "Hasil samping: sekam, bahan baku pelet energi terbarukan"],
      },
    },
    {
      step: "05", title: "Whitening & Polishing", unit: "PMD-2",
      body: "Pelepasan kulit ari melalui beberapa lintasan.",
      image: "images/facility-whitening.jpg",
      detail: {
        body: ["Lapisan kulit ari dilepas melalui beberapa lintasan, bukan sekaligus, sehingga derajat sosoh dapat disetel sesuai tingkat mutu yang dituju. Bekatul yang terpisah dikumpulkan sebagai produk tersendiri, bukan sebagai sisa."],
        points: ["Disetel: derajat sosoh sesuai tingkat mutu", "Hasil samping: bekatul, kaya serat dan vitamin B kompleks"],
      },
    },
    {
      step: "06", title: "Grading", unit: "PMD-2",
      body: "Pemisahan menurut ukuran dan keutuhan butir.",
      image: "images/facility-grading.jpg",
      detail: {
        body: ["Butir dipisahkan menurut ukuran dan keutuhannya. Hasil pengukuran inilah yang menentukan tingkat mutu — dari Medium sampai Premium Super — sehingga mutu yang tercetak pada kemasan berasal dari angka, bukan dari perkiraan."],
        points: ["Ditetapkan: tingkat mutu, dari Medium sampai Premium Super", "Hasil samping: broken dan menir"],
      },
    },
    {
      step: "07", title: "Sorting", unit: "PMD-2",
      body: "Pemeriksaan butir demi butir menurut warna dan bentuk.",
      image: "images/gallery-7.jpg",
      detail: {
        body: ["Beras diperiksa butir demi butir menurut warna dan bentuknya. Butir yang menyimpang serta benda asing yang masih tersisa dikeluarkan secara otomatis, menghasilkan kemurnian yang dituntut industri pangan dan pasar premium."],
        points: ["Dikeluarkan: butir menyimpang warna dan benda asing", "Hasil samping: beras reject"],
      },
    },
    {
      step: "08", title: "Packing", unit: "PMD-2",
      body: "Pengemasan menurut tingkat mutu, klasifikasi, dan merk.",
      image: "images/facility-packing.jpg",
      detail: {
        body: ["Beras dikemas menurut tingkat mutu, klasifikasi, dan merk dalam ukuran 5 sampai 50 kilogram. Nomor batch dari tahap penerimaan ikut sampai ke karung, sehingga setiap kemasan tetap dapat ditelusuri setelah meninggalkan pabrik."],
        points: ["Keluar: beras kemasan 5, 10, 25, dan 50 kg", "Ditelusuri: nomor batch dari penerimaan sampai pengiriman"],
      },
    },
  ],
};

function initProcessBand() {
  const rail = document.getElementById("pb-rail");
  if (!rail) return;

  const data = PROCESS_DATA;
  const titleEl = document.getElementById("pb-title");
  if (titleEl) titleEl.textContent = data.title;
  if (data.note) {
    const noteEl = document.getElementById("pb-note");
    if (noteEl) noteEl.textContent = data.note;
  }

  document.documentElement.style.setProperty("--step-count", data.steps.length);
  document.querySelector(".rail-stations")?.remove();

  rail.innerHTML = "";

  if (data.from) {
    rail.insertAdjacentHTML("beforeend", `
      <div class="rail-end rail-start" aria-hidden="true">
        <img src="${data.from.image}" alt="">
        <span class="rail-end-label">${data.from.label}</span>
      </div>`);
  }

  const ol = document.createElement("ol");
  ol.className = "rail-stations";
  ol.style.gridTemplateColumns = `repeat(${data.steps.length}, minmax(0, 1fr))`;
  data.steps.forEach((step) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <button type="button" class="station" data-step="${step.step}"
              aria-label="Stasiun ${step.step}: ${step.title}">
        <span class="station-well" aria-hidden="true"><img src="${step.image}" alt="${step.title}"></span>
        <span class="station-body">
          <span class="station-label">${step.title}</span>
          <span class="station-tick"><span class="station-no">${step.step}</span></span>
          ${step.unit ? `<span class="station-unit">${step.unit}</span>` : ""}
        </span>
      </button>`;
    ol.appendChild(li);
  });
  rail.appendChild(ol);

  if (data.to) {
    rail.insertAdjacentHTML("beforeend", `
      <div class="rail-end rail-final" aria-hidden="true">
        <img src="${data.to.image}" alt="">
        <span class="rail-end-label">${data.to.label}</span>
      </div>`);
  }

  let activeStep = null;
  const detailWrap = document.getElementById("process-detail");
  const detailInner = document.getElementById("pb-detail-inner");

  function renderStepDetail(stepId) {
    if (!detailWrap || !detailInner) return;
    if (!stepId) {
      activeStep = null;
      detailWrap.hidden = true;
      rail.querySelectorAll(".station").forEach((b) => b.classList.remove("active"));
      return;
    }

    activeStep = stepId;
    rail.querySelectorAll(".station").forEach((b) => {
      b.classList.toggle("active", b.dataset.step === activeStep);
    });

    const active = data.steps.find((s) => s.step === activeStep);
    if (!active) return;

    detailInner.innerHTML = `
      <div class="process-detail-media">
        <img src="${active.image}" alt="${active.title}">
        <div class="process-detail-badge">${active.step} / 08 · ${active.unit || "PMD"}</div>
      </div>
      <div class="process-detail-copy">
        <div class="process-detail-meta">
          <span class="process-detail-step-tag">TAHAP ${active.step} ${active.unit ? `· ${active.unit}` : ""}</span>
          <button type="button" class="process-detail-close-btn" id="pb-close-btn" aria-label="Tutup Rincian">
            <i class="fas fa-times"></i> Tutup
          </button>
        </div>
        <h3>${active.title}</h3>
        <p class="process-detail-lead">${active.body}</p>
        ${active.detail.body.map((p) => `<p class="process-detail-text">${p}</p>`).join("")}
        ${active.detail.points && active.detail.points.length
          ? `<ul class="process-detail-points">${active.detail.points.map((p) => `<li>${p}</li>`).join("")}</ul>`
          : ""}
      </div>`;

    detailWrap.hidden = false;

    // Reset animasi agar transisi antar stasiun terasa halus
    detailInner.style.animation = "none";
    detailInner.offsetHeight; // trigger reflow
    detailInner.style.animation = "processFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards";

    const closeBtn = document.getElementById("pb-close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        renderStepDetail(null);
      });
    }
  }

  rail.querySelectorAll(".station").forEach((btn) => {
    const stepId = btn.dataset.step;

    // 1. Sentuh / Hover (Pointerenter / Mouseenter) - langsung tampil tanpa harus klik
    btn.addEventListener("pointerenter", () => {
      if (activeStep !== stepId) {
        renderStepDetail(stepId);
      }
    });

    // 2. Sentuhan layar sentuh mobile / tablet
    btn.addEventListener("touchstart", () => {
      if (activeStep !== stepId) {
        renderStepDetail(stepId);
      }
    }, { passive: true });

    // 3. Klik tombol (tetap aktif jika pengguna ingin klik, atau toggle jika diklik ulang)
    btn.addEventListener("click", () => {
      if (activeStep === stepId) {
        renderStepDetail(null);
      } else {
        renderStepDetail(stepId);
      }
    });

    // 4. Fokus navigasi keyboard (Accessibility)
    btn.addEventListener("focus", () => {
      if (activeStep !== stepId) {
        renderStepDetail(stepId);
      }
    });
  });
}
