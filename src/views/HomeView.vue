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
      <h1>LocalHub 구미/경북</h1>
      <p>관광지, 음식점, 축제 정보를 한곳에서 보고 익명 게시판으로 지역 이야기를 나눕니다.</p>
      <div class="hero-actions">
        <RouterLink class="primary-button" to="/places">지역 정보 보기</RouterLink>
        <RouterLink class="secondary-button" to="/board">게시판 가기</RouterLink>
      </div>
    </div>
    <div class="hero-panel">
      <strong>제공 데이터</strong>
      <span>관광지 · 음식점 · 축제 · 숙박 · 문화시설 · 쇼핑 · 레포츠 · 여행코스</span>
    </div>
  </section>


  <section class="section">
  <div class="weather-card">
    <div v-if="weatherLoading">날씨 정보를 불러오는 중입니다...</div>
    <div v-else-if="weatherError">{{ weatherError }}</div>
    <div v-else>
      <h3>구미 날씨</h3>
      <p class="weather-temp">{{ weather.current.temperature_2m }}°C</p>
      <p>{{ getWeatherLabel(weather.current.weather_code) }}</p>
      <small>강수량 {{ weather.current.precipitation }}mm</small>
    </div>
  </div>
</section>

  <section class="section">
    <div class="section-heading">
      <div>
        <span class="eyebrow">추천</span>
        <h2>구미/경북 둘러보기</h2>
      </div>
      <RouterLink to="/places">전체 보기</RouterLink>
    </div>
    <div v-if="loading" class="empty-state">데이터를 불러오는 중입니다.</div>
    <div v-else class="card-grid">
      <PlaceCard v-for="item in attractions" :key="`a-${item.id}`" :item="item" label="관광지" />
      <PlaceCard v-for="item in restaurants" :key="`r-${item.id}`" :item="item" label="음식점" />
    </div>
  </section>

  <section class="two-column section">
    <div>
      <div class="section-heading compact">
        <div>
          <span class="eyebrow">축제</span>
          <h2>다가오는 일정</h2>
        </div>
        <RouterLink to="/festivals">캘린더</RouterLink>
      </div>
      <div class="stack-list">
        <article v-for="festival in nextFestivals" :key="festival.contentid" class="list-card">
          <strong>{{ festival.title }}</strong>
          <span>{{ formatDate(festival.eventstartdate) }} - {{ formatDate(festival.eventenddate) }}</span>
          <small>{{ festival.eventplace || festival.addr1 }}</small>
        </article>
      </div>
    </div>

    <div>
      <div class="section-heading compact">
        <div>
          <span class="eyebrow">커뮤니티</span>
          <h2>최근 게시글</h2>
        </div>
        <RouterLink to="/board/new">글쓰기</RouterLink>
      </div>
      <div class="stack-list">
        <RouterLink v-for="post in posts" :key="post.id" class="list-card" :to="`/board/${post.id}`">
          <strong>{{ post.title }}</strong>
          <span>{{ post.content }}</span>
          <small>{{ formatPostDate(post.createdAt) }} · 좋아요 {{ post.likes }}</small>
        </RouterLink>
      </div>
    </div>
  </section>
</template>
