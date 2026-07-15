<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router';
import ChatBot from './components/ChatBot.vue';

const route = useRoute();
</script>

<template>
  <div class="app-shell">
    <header class="site-header">
      <RouterLink class="brand" to="/">
        <span class="brand-mark">L</span>
        <span>
          <strong>LocalHub</strong>
          <small>구미/경북</small>
        </span>
      </RouterLink>
      <nav class="top-nav" aria-label="주요 메뉴">
        <RouterLink to="/" :class="{ active: route.name === 'home' }">홈</RouterLink>
        <RouterLink to="/places" :class="{ active: route.name === 'places' }">지역 정보</RouterLink>
        <RouterLink to="/board" :class="{ active: String(route.name).startsWith('board') }">게시판</RouterLink>
        <RouterLink to="/festivals" :class="{ active: route.name === 'festivals' }">축제 캘린더</RouterLink>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>

    <footer class="site-footer">
      <p>출처: 한국관광공사 TourAPI 4.0 공공데이터. 라이선스: 공공누리 제3유형.</p>
      <p>게시글은 별도 서버 없이 사용자의 브라우저 localStorage에 저장됩니다.</p>
    </footer>

    <ChatBot />
  </div>
</template>
