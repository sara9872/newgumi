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

const quickCategoryCards = [
  { key: 'attractions', label: '관광지', desc: '명소와 힐링 스팟', icon: '🏛️' },
  { key: 'restaurants', label: '음식점', desc: '맛집과 숨은 맛집', icon: '🍽️' },
  { key: 'festivals', label: '축제 행사', desc: '다가오는 행사 일정', icon: '🎉' },
  { key: 'culture', label: '문화시설', desc: '전시·체험 공간', icon: '🎭' },
  { key: 'leisure', label: '레포츠', desc: '액티비티와 야외 활동', icon: '🚲' },
  { key: 'shopping', label: '쇼핑', desc: '쇼핑과 로컬 스폿', icon: '🛍️' },
  { key: 'hotels', label: '숙박', desc: '편안한 휴식처', icon: '🏨' },
  { key: 'courses', label: '여행코스', desc: '하루 코스 추천', icon: '🗺️' },
];

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

const featuredItems = computed(() => {
  const items = [];
  if (attractions.value[0]) {
    items.push({ ...attractions.value[0], _label: '관광지' });
  }
  if (restaurants.value[0]) {
    items.push({ ...restaurants.value[0], _label: '음식점' });
  }
  return items;
});

onMounted(async () => {
  const [attractionData, restaurantData, festivalData] = await Promise.all([
    loadCategory('attractions'),
    loadCategory('restaurants'),
    loadCategory('festivals'),
  ]);

  attractions.value = attractionData.items.slice(0, 2).map(getItemSummary);
  restaurants.value = restaurantData.items.slice(0, 2).map(getItemSummary);
  festivals.value = festivalData.items;
  posts.value = getPosts().slice(0, 3);

  await loadWeather();
  loading.value = false;
});
</script>

<template>
  <section class="hero-section">
    <div class="hero-copy">
      <span class="eyebrow">구미/경북 지역 정보와 익명 커뮤니티</span>
      <h1>구미·경북을 더 가깝게</h1>
      <p>관광지, 음식점, 축제 정보를 한곳에서 보고 익명 게시판으로 지역 이야기를 나눕니다.</p>
      <div class="hero-actions">
        <RouterLink class="primary-button" to="/places">지역 정보 보기</RouterLink>
        <RouterLink class="secondary-button" to="/board">게시판 가기</RouterLink>
      </div>
    </div>

    <div class="hero-highlight">
      <div class="weather-card">
        <p class="weather-title">오늘의 구미</p>
        <div v-if="weatherLoading">날씨 정보를 불러오는 중입니다...</div>
        <div v-else-if="weatherError">{{ weatherError }}</div>
        <div v-else>
          <h3>구미 날씨</h3>
          <p class="weather-temp">{{ Number(weather.current.temperature_2m).toFixed(0) }}°C</p>
          <p>{{ getWeatherLabel(weather.current.weather_code) }}</p>
          <small>강수량 {{ weather.current.precipitation }}mm</small>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="section-heading">
      <div>
        <span class="eyebrow">바로가기</span>
        <h2>카테고리 둘러보기</h2>
      </div>
    </div>

    <div class="category-grid">
      <RouterLink
        v-for="card in quickCategoryCards"
        :key="card.key"
        class="category-card"
        :to="`/places/${card.key}`"
      >
        <span class="category-icon">{{ card.icon }}</span>
        <strong>{{ card.label }}</strong>
        <p>{{ card.desc }}</p>
      </RouterLink>
    </div>
  </section>

  <section class="section">
    <div class="recommend-layout">
      <div class="recommend-panel">
        <div class="section-heading compact">
          <div>
            <span class="eyebrow">추천</span>
            <h2>핵심 정보</h2>
          </div>
          <RouterLink to="/places">전체 보기</RouterLink>
        </div>

        <div v-if="loading" class="empty-state">데이터를 불러오는 중입니다.</div>
        <div v-else class="recommend-cards">
          <PlaceCard
            v-for="item in featuredItems"
            :key="`${item.id}-${item._label}`"
            :item="item"
            :label="item._label"
          />
        </div>
      </div>

      <div class="side-stack">
        <div class="side-card">
          <div class="section-heading compact">
            <div>
              <span class="eyebrow">축제</span>
              <h2>다가오는 일정</h2>
            </div>
            <RouterLink to="/festivals">캘린더</RouterLink>
          </div>

          <div class="stack-list">
            <RouterLink
              v-for="festival in nextFestivals"
              :key="festival.contentid"
              class="list-card"
              to="/festivals"
            >
              <strong>{{ festival.title }}</strong>
              <span>{{ formatDate(festival.eventstartdate) }} - {{ formatDate(festival.eventenddate) }}</span>
              <small>{{ festival.eventplace || festival.addr1 }}</small>
            </RouterLink>
          </div>
        </div>

        <div class="side-card">
          <div class="section-heading compact">
            <div>
              <span class="eyebrow">커뮤니티</span>
              <h2>최근 게시글</h2>
            </div>
            <RouterLink to="/board/new">글쓰기</RouterLink>
          </div>

          <div class="stack-list">
            <RouterLink
              v-for="post in posts"
              :key="post.id"
              class="list-card"
              :to="`/board/${post.id}`"
            >
              <strong>{{ post.title }}</strong>
              <span>{{ post.content }}</span>
              <small>{{ formatPostDate(post.createdAt) }} · 좋아요 {{ post.likes }}</small>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>