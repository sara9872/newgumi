<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import PlaceCard from '../components/PlaceCard.vue';
import { getItemSummary, loadCategory, formatDate } from '../services/dataService';
import { formatPostDate, getPosts } from '../stores/boardStore';

const attractions = ref([]);
const restaurants = ref([]);
const festivals = ref([]);
const posts = ref([]);
const loading = ref(true);

const weather = ref(null);
const weatherLoading = ref(true);
const weatherError = ref('');

function getWeatherLabel(code) {
  const map = {
    0: '맑음',
    1: '대체로 맑음',
    2: '부분적으로 흐림',
    3: '흐림',
    45: '안개',
    48: '서리 안개',
    51: '가벼운 비',
    61: '비',
    71: '눈',
    95: '천둥번개',
  };
  return map[code] || '기상 상태';
}

async function loadWeather() {
  try {
    const url =
      'https://api.open-meteo.com/v1/forecast?latitude=36.11655&longitude=128.3467778&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,rain,precipitation,precipitation_probability,apparent_temperature,weather_code&current=precipitation,temperature_2m,is_day,rain,apparent_temperature&timezone=Asia%2FTokyo';

    const response = await fetch(url);
    if (!response.ok) throw new Error('날씨를 불러오지 못했습니다.');

    const data = await response.json();
    weather.value = data;
  } catch (error) {
    weatherError.value = error.message;
  } finally {
    weatherLoading.value = false;
  }
}

const nextFestivals = computed(() =>
  festivals.value
    .filter((item) => item.eventstartdate)
    .sort((a, b) => String(a.eventstartdate).localeCompare(String(b.eventstartdate)))
    .slice(0, 3),
);

onMounted(async () => {
  const [attractionData, restaurantData, festivalData] = await Promise.all([
    loadCategory('attractions'),
    loadCategory('restaurants'),
    loadCategory('festivals'),
  ]);
  attractions.value = attractionData.items.slice(0, 3).map(getItemSummary);
  restaurants.value = restaurantData.items.slice(0, 3).map(getItemSummary);
  festivals.value = festivalData.items;
  posts.value = getPosts().slice(0, 4);

  await loadWeather();
  loading.value = false;
});
</script>

<template>
  <section class="hero-section">
    <div class="hero-copy">
      <span class="eyebrow">공공데이터 기반 지역 정보 공유 커뮤니티</span>
      <h1> 구미/경북</h1>
      <p>관광지, 음식점, 축제 정보를 한곳에서 보고 익명 게시판으로 지역 이야기를 나눕니다.</p>
      <div class="hero-actions">
        <RouterLink class="primary-button" to="/places">지역 정보 보기</RouterLink>
        <RouterLink class="secondary-button" to="/board">게시판 가기</RouterLink>
      </div>
    </header>

    <section class="container hero-wrap">
      <div class="hero-card">
        <div class="hero-left">
          <span class="hero-eyebrow">공공데이터 기반 지역 정보 공유 커뮤니티</span>
          <h2 class="hero-title">
            Travel and Local Information
            <br />
            for Gumi & Gyeongbuk
            <br />
            in One Place
          </h2>
          <p class="hero-intro">
            Discover attractions, restaurants, festivals, accommodations, and cultural spots with ease.
          </p>

          <div class="hero-actions">
            <RouterLink class="btn btn-primary" to="/places">Browse Local Information</RouterLink>
            <RouterLink class="btn btn-secondary" to="/board">Visit Community</RouterLink>
          </div>

          <div class="hero-meta">
            <div class="meta-item"><strong>Data</strong><span>관광지 · 음식점 · 축제 · 숙박 · 문화시설</span></div>
            <div class="meta-item"><strong>Updated</strong><span>Public datasets · Realtime weather</span></div>
          </div>
        </div>

        <div class="hero-right">
          <div class="hero-image" role="img" aria-label="Gumi landscape">
            <img
              src="https://img.asiatoday.co.kr/file/2024y/03m/25d/2024032501002404700142291.jpg"
              alt="Gumi landscape"
            />
            <div class="hero-gradient"></div>
          </div>
        </div>
      </div>
    </section>

    <section class="container section gap">
      <div class="category-shortcuts">
        <div class="section-headline">
          <span class="eyebrow">바로가기</span>
          <h3>Explore by Category</h3>
        </div>
        <div class="categories-grid">
          <RouterLink to="/places?cat=attractions" class="category-card">
            <div class="cat-icon" style="background: linear-gradient(135deg,#00BAFF22,#1B449C22)"><svg viewBox="0 0 24 24"><circle cx="12" cy="10" r="3" fill="#00BAFF"/></svg></div>
            <div class="cat-title">Attractions</div>
          </RouterLink>

          <RouterLink to="/places?cat=restaurants" class="category-card">
            <div class="cat-icon" style="background: linear-gradient(135deg,#FF7DC322,#1B449C22)"><svg viewBox="0 0 24 24"><path d="M6 2v20" stroke="#FF7DC3" stroke-width="2" stroke-linecap="round"/></svg></div>
            <div class="cat-title">Restaurants</div>
          </RouterLink>

          <RouterLink to="/festivals" class="category-card">
            <div class="cat-icon" style="background: linear-gradient(135deg,#FDB20022,#FF7DC322)"><svg viewBox="0 0 24 24"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" fill="#FDB200"/></svg></div>
            <div class="cat-title">Festivals</div>
          </RouterLink>

          <RouterLink to="/places?cat=accommodations" class="category-card">
            <div class="cat-icon" style="background: linear-gradient(135deg,#00953122,#1B449C22)"><svg viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="10" fill="#009531"/></svg></div>
            <div class="cat-title">Accommodations</div>
          </RouterLink>

          <RouterLink to="/places?cat=cultural" class="category-card">
            <div class="cat-icon" style="background: linear-gradient(135deg,#8A704D22,#1B449C22)"><svg viewBox="0 0 24 24"><path d="M3 21h18" stroke="#8A704D" stroke-width="2"/></svg></div>
            <div class="cat-title">Cultural Facilities</div>
          </RouterLink>

          <RouterLink to="/places?cat=leisure" class="category-card">
            <div class="cat-icon" style="background: linear-gradient(135deg,#00BAFF22,#FF7DC322)"><svg viewBox="0 0 24 24"><path d="M4 12h16" stroke="#00BAFF" stroke-width="2"/></svg></div>
            <div class="cat-title">Leisure & Sports</div>
          </RouterLink>

          <RouterLink to="/places?cat=shopping" class="category-card">
            <div class="cat-icon" style="background: linear-gradient(135deg,#FF7DC322,#00BAFF22)"><svg viewBox="0 0 24 24"><path d="M6 6h12l1 14H5z" fill="#FF7DC3"/></svg></div>
            <div class="cat-title">Shopping</div>
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="container section">
      <div class="section-heading">
        <div>
          <span class="eyebrow">추천</span>
          <h3>Featured Attractions</h3>
        </div>
        <RouterLink to="/places">View All</RouterLink>
      </div>

      <div v-if="loading" class="empty-state">데이터를 불러오는 중입니다.</div>

      <div v-else class="card-grid places-grid">
        <PlaceCard
          v-for="item in attractions"
          :key="`a-${item.id}`"
          :item="item"
          label="관광지"
          class="animated-card"
        />
        <PlaceCard
          v-for="item in restaurants"
          :key="`r-${item.id}`"
          :item="item"
          label="음식점"
          class="animated-card warm"
        />
      </div>
    </section>

    <section class="container section">
      <div class="two-column">
        <div>
          <div class="section-heading compact">
            <div>
              <span class="eyebrow">축제</span>
              <h3>Upcoming Festivals</h3>
            </div>
            <RouterLink to="/festivals">More</RouterLink>
          </div>

          <div class="festival-list">
            <article
              v-for="festival in nextFestivals"
              :key="festival.contentid"
              class="festival-card"
            >
              <div class="poster">
                <img :src="festival.firstimage || ''" alt="" />
              </div>
              <div class="festival-body">
                <strong class="festival-title">{{ festival.title }}</strong>
                <div class="festival-meta">
                  <time>{{ formatDate(festival.eventstartdate) }}</time>
                  <span class="dot">·</span>
                  <span>{{ festival.eventplace || festival.addr1 }}</span>
                </div>
              </div>
            </article>
          </div>
        </div>

        <div>
          <div class="section-heading compact">
            <div>
              <span class="eyebrow">커뮤니티</span>
              <h3>Recent Posts</h3>
            </div>
            <RouterLink to="/board/new">Write</RouterLink>
          </div>

          <div class="posts-list">
            <RouterLink
              v-for="post in posts"
              :key="post.id"
              :to="`/board/${post.id}`"
              class="post-card"
            >
              <div class="post-left">
                <div class="post-title">{{ post.title }}</div>
                <div class="post-excerpt">{{ post.content }}</div>
              </div>
              <div class="post-meta">
                <small>{{ formatPostDate(post.createdAt) }}</small>
                <div class="likes">❤ {{ post.likes }}</div>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <section class="container section">
      <div class="weather-panel">
        <div class="weather-card glass">
          <div v-if="weatherLoading" class="weather-loading">Loading weather…</div>
          <div v-else-if="weatherError" class="weather-error">{{ weatherError }}</div>
          <div v-else class="weather-inner">
            <div class="weather-main">
              <div class="temp">{{ Math.round(weather.current.temperature_2m) }}°</div>
              <div class="cond">
                <img :src="`/assets/weather-icons/${weather.current.weather_code || 0}.svg`" alt="" />
                <div class="cond-text">{{ getWeatherLabel(weather.current.weather_code) }}</div>
              </div>
            </div>
            <div class="weather-stats">
              <div class="stat"><small>Precip</small><strong>{{ weather.current.precipitation }} mm</strong></div>
              <div class="stat"><small>High</small><strong>{{ weather.daily?.temperature_2m_max?.[0] ?? '-' }}°</strong></div>
              <div class="stat"><small>Low</small><strong>{{ weather.daily?.temperature_2m_min?.[0] ?? '-' }}°</strong></div>
            </div>
          </div>
        </div>

        <div class="mini-cards">
          <div class="mini-card">Popular · <strong>Park</strong></div>
          <div class="mini-card">Trending · <strong>Restaurant</strong></div>
        </div>
      </div>
    </section>

    <footer class="site-footer">
      <div class="container footer-inner">
        <div>© LocalHub Gumi</div>
        <div class="footer-links">
          <RouterLink to="/about">About</RouterLink>
          <RouterLink to="/privacy">Privacy</RouterLink>
        </div>
      </div>
    </footer>
  </main>
</template>

<style scoped>
/* Fonts */
@font-face {
  font-family: 'RomanticGumi';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2410-1@1.0/GumiRomanceTTF.woff2') format('woff2');
  font-display: swap;
}
@font-face {
  font-family: 'GumiDodum';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2410-1@1.0/GumiDotumTTF.woff2') format('woff2');
  font-display: swap;
}

/* Tokens */
:root {
  --bg: #F7F9FC;
  --primary: #00BAFF;
  --navy: #1B449C;
  --pink: #FF7DC3;
  --muted: #8E9295;
  --card-radius: 18px;
  --container-max: 1400px;
  --gap: 24px;
  --section-gap: 64px;
}

.home-root {
  background: var(--bg);
  color: #0b1020;
  font-family: GumiDodum, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  min-height: 100vh;
}

/* Container */
.container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 32px;
}

/* Header */
.site-header {
  backdrop-filter: blur(6px);
  background: transparent;
  padding: 18px 0;
  position: sticky;
  top: 0;
  z-index: 30;
}
.header-inner {
  display: flex;
  align-items: center;
  gap: 16px;
}
.brand-link { display:flex; align-items:center; gap:12px; text-decoration:none; color:inherit; }
.brand-mark {
  width:44px; height:44px; border-radius:10px;
  background: linear-gradient(135deg,var(--primary),var(--navy));
  box-shadow: 0 6px 18px rgba(27,68,156,0.14);
}
.brand-title {
  font-family: RomanticGumi, GumiDodum, sans-serif;
  font-size:18px;
  margin:0;
  letter-spacing: -0.02em;
}
.header-nav { margin-left: 24px; display:flex; gap:18px; align-items:center; color:var(--muted); }
.header-nav a { color:var(--muted); text-decoration:none; font-weight:500; }
.header-cta { margin-left:auto; }

/* Hero */
.hero-wrap { padding-top: 12px; padding-bottom: 12px; }
.hero-card {
  display:flex;
  gap: 28px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  height: 430px;
  box-shadow: 0 8px 30px rgba(8,28,80,0.06);
}
.hero-left {
  padding: 40px;
  width: 55%;
  display:flex;
  flex-direction:column;
  justify-content:center;
  gap: 18px;
}
.hero-eyebrow { color:var(--muted); font-size:13px; }
.hero-title {
  font-family: RomanticGumi, GumiDodum;
  font-size:50px;
  line-height:1.02;
  margin:0;
  color:var(--navy);
}
.hero-intro {
  font-size:16px;
  color:#1f2a44;
  max-width:640px;
}
.hero-actions { display:flex; gap:12px; margin-top:10px; }
.btn { padding:12px 20px; border-radius:999px; display:inline-flex; align-items:center; justify-content:center; font-weight:600; transition: all .18s ease; text-decoration:none; }
.btn-primary { background:var(--primary); color:white; box-shadow: 0 8px 24px rgba(0,186,255,0.16); transform-origin:center; }
.btn-primary:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 14px 40px rgba(0,186,255,0.18); }
.btn-secondary { background:white; border:2px solid var(--primary); color:var(--navy); }
.btn-secondary:hover { background:var(--primary); color:white; transform: translateY(-3px); }

/* hero-right image */
.hero-right { width:45%; position:relative; display:flex; align-items:center; justify-content:center; padding:16px; }
.hero-image { width:100%; height:100%; border-radius:20px; overflow:hidden; position:relative; box-shadow: 0 12px 40px rgba(12,38,80,0.06); }
.hero-image img { width:100%; height:100%; object-fit:cover; display:block; transition: transform .6s ease; }
.hero-image:hover img { transform: scale(1.03); }
.hero-gradient {
  position:absolute;
  inset:0;
  background: linear-gradient(90deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.2) 30%, rgba(255,255,255,0) 60%);
  pointer-events:none;
}

/* Category shortcuts */
.section { margin-top: var(--section-gap); margin-bottom: var(--section-gap); }
.category-shortcuts .section-headline { display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; }
.categories-grid {
  display:grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 16px;
}
.category-card {
  display:flex;
  align-items:center;
  gap:12px;
  padding:14px;
  border-radius:16px;
  background:white;
  box-shadow: 0 6px 18px rgba(11,18,36,0.04);
  text-decoration:none;
  color:inherit;
  transition: transform .25s ease, box-shadow .25s ease;
}
.category-card:hover { transform: translateY(-6px); box-shadow: 0 18px 40px rgba(11,18,36,0.08); }
.cat-icon { width:56px; height:56px; border-radius:12px; display:flex; align-items:center; justify-content:center; }
.cat-title { font-weight:600; font-size:15px; font-family: RomanticGumi, GumiDodum; }

/* Card grid for places */
.card-grid { display:grid; gap:24px; }
.places-grid { grid-template-columns: repeat(4, 1fr); align-items:start; }
.animated-card { transition: transform .24s ease, box-shadow .24s ease; }
.animated-card:hover { transform: translateY(-6px); box-shadow: 0 18px 40px rgba(11,18,36,0.10); }
.animated-card.warm { box-shadow: 0 8px 18px rgba(255,125,195,0.06); }

/* Two-column festival + posts */
.two-column { display:grid; grid-template-columns: 1fr 1fr; gap:28px; align-items:start; }
.section-heading { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
.section-heading.compact h3 { font-size:22px; margin:6px 0 0; }

/* Festival list */
.festival-list { display:flex; flex-direction:column; gap:16px; }
.festival-card {
  display:flex; gap:14px; align-items:center;
  background:white; border-radius:16px; padding:12px;
  box-shadow: 0 8px 30px rgba(8,28,80,0.04); transition: transform .2s ease;
}
.festival-card:hover { transform: translateY(-6px); }
.poster { width:96px; height:72px; border-radius:10px; overflow:hidden; background:#f2f4f8; flex-shrink:0; }
.poster img { width:100%; height:100%; object-fit:cover; }

/* Posts list */
.posts-list { display:flex; flex-direction:column; gap:12px; }
.post-card {
  display:flex; justify-content:space-between; gap:14px;
  padding:14px; border-radius:12px; background:white;
  border-left:4px solid rgba(0,186,255,0.18);
  text-decoration:none; color:inherit;
  transition: background .18s ease, transform .18s ease;
  box-shadow: 0 6px 18px rgba(11,18,36,0.04);
}
.post-card:hover { transform: translateY(-6px); background: linear-gradient(180deg, #fff 0%, #fbfdff 100%); box-shadow: 0 18px 40px rgba(11,18,36,0.08); }
.post-left { max-width:72%; }
.post-title { font-weight:700; margin-bottom:6px; }
.post-excerpt { color:var(--muted); font-size:14px; }

/* Weather glass card */
.weather-panel { display:flex; gap:20px; align-items:flex-start; justify-content:space-between; }
.weather-card.glass {
  padding:18px;
  border-radius:18px;
  background: linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.4));
  box-shadow: 0 12px 40px rgba(8,28,80,0.06);
  backdrop-filter: blur(8px) saturate(120%);
  width: 420px;
}
.weather-inner { display:flex; flex-direction:column; gap:12px; }
.weather-main { display:flex; align-items:center; gap:14px; }
.temp { font-size:48px; font-weight:800; color:var(--navy); font-family: RomanticGumi, GumiDodum; }
.cond { display:flex; align-items:center; gap:8px; color:var(--muted); }
.cond img { width:36px; height:36px; }
.weather-stats { display:flex; gap:10px; margin-top:4px; }
.stat small { display:block; color:var(--muted); font-size:12px; }
.stat strong { font-size:16px; color:#111827; }

/* footer */
.site-footer { margin-top: var(--section-gap); padding: 28px 0; color:var(--muted); }
.footer-inner { display:flex; justify-content:space-between; align-items:center; }

/* Utility */
.eyebrow { font-size:13px; color:var(--muted); display:block; }
.empty-state { padding:32px; text-align:center; color:var(--muted); }

/* Responsive */
@media (max-width: 1200px) {
  .places-grid { grid-template-columns: repeat(3,1fr); }
  .categories-grid { grid-template-columns: repeat(4,1fr); }
  .hero-left { width:60%; }
  .hero-right { width:40%; }
  .weather-card.glass { width:360px; }
}
@media (max-width: 900px) {
  .places-grid { grid-template-columns: repeat(2,1fr); }
  .two-column { grid-template-columns: 1fr; }
  .categories-grid { grid-template-columns: repeat(3,1fr); }
  .hero-card { flex-direction:column; height:auto; }
  .hero-left, .hero-right { width:100%; }
  .hero-left { padding:28px; }
  .hero-image { height:320px; }
}
@media (max-width: 520px) {
  .categories-grid { grid-template-columns: repeat(2,1fr); }
  .places-grid { grid-template-columns: 1fr; }
  .category-card { padding:12px; }
  .hero-title { font-size:34px; }
  .container { padding:20px; }
}
</style>