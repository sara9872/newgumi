<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { formatPostDate, getBookmarks, getPosts, toggleBookmark } from '../stores/boardStore';

const posts = ref([]);
const bookmarks = ref([]);
const query = ref('');
const showBookmarksOnly = ref(false);

const filteredPosts = computed(() => {
  const term = query.value.trim().toLowerCase();
  return posts.value.filter((post) => {
    const matchesText = !term || [post.title, post.content].some((value) => value.toLowerCase().includes(term));
    const matchesBookmark = !showBookmarksOnly.value || bookmarks.value.includes(post.id);
    return matchesText && matchesBookmark;
  });
});

function refresh() {
  posts.value = getPosts();
  bookmarks.value = getBookmarks();
}

function onBookmark(id) {
  bookmarks.value = toggleBookmark(id);
}

onMounted(refresh);
</script>

<template>
  <section class="page-header">
    <span class="eyebrow">익명 커뮤니티</span>
    <h1>구미/경북 게시판</h1>
    <p>회원가입 없이 제목, 내용, 수정용 비밀번호만으로 글을 작성합니다.</p>
  </section>

  <section class="toolbar board-toolbar">
    <input v-model="query" class="search-input" type="search" placeholder="제목 또는 내용 검색" />
    <button class="secondary-button" type="button" @click="showBookmarksOnly = !showBookmarksOnly">
      {{ showBookmarksOnly ? '전체 글 보기' : '북마크만 보기' }}
    </button>
    <RouterLink class="primary-button" to="/board/new">글쓰기</RouterLink>
  </section>

  <section class="section">
    <div v-if="!filteredPosts.length" class="empty-state">표시할 게시글이 없습니다.</div>
    <div v-else class="board-list">
      <article v-for="post in filteredPosts" :key="post.id" class="board-row">
        <RouterLink :to="`/board/${post.id}`" class="board-main">
          <strong>{{ post.title }}</strong>
          <span>{{ post.content }}</span>
          <small>{{ formatPostDate(post.createdAt) }} · 조회 {{ post.views || 0 }} · 좋아요 {{ post.likes || 0 }}</small>
        </RouterLink>
        <button
          class="icon-button"
          type="button"
          :aria-label="bookmarks.includes(post.id) ? '북마크 해제' : '북마크 추가'"
          @click="onBookmark(post.id)"
        >
          {{ bookmarks.includes(post.id) ? '★' : '☆' }}
        </button>
      </article>
    </div>
  </section>
</template>
