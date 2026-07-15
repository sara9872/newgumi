<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import {
  deletePost,
  formatPostDate,
  getBookmarks,
  getPost,
  increaseViews,
  likePost,
  toggleBookmark,
} from '../stores/boardStore';

const route = useRoute();
const router = useRouter();
const post = ref(null);
const bookmarks = ref([]);
const password = ref('');
const error = ref('');

function refresh() {
  post.value = getPost(route.params.id);
  bookmarks.value = getBookmarks();
}

function onLike() {
  post.value = likePost(route.params.id);
}

function onBookmark() {
  bookmarks.value = toggleBookmark(route.params.id);
}

function onDelete() {
  error.value = '';
  if (!password.value.trim()) {
    error.value = '비밀번호를 입력해 주세요.';
    return;
  }
  if (!deletePost(route.params.id, password.value)) {
    error.value = '비밀번호가 일치하지 않습니다.';
    return;
  }
  router.push('/board');
}

onMounted(() => {
  increaseViews(route.params.id);
  refresh();
});
</script>

<template>
  <section v-if="post" class="detail-page">
    <div class="detail-header">
      <RouterLink to="/board">← 목록</RouterLink>
      <h1>{{ post.title }}</h1>
      <p>{{ formatPostDate(post.createdAt) }} · 조회 {{ post.views || 0 }} · 좋아요 {{ post.likes || 0 }}</p>
    </div>

    <article class="post-content">{{ post.content }}</article>

    <div class="action-row">
      <button class="secondary-button" type="button" @click="onLike">좋아요 {{ post.likes || 0 }}</button>
      <button class="secondary-button" type="button" @click="onBookmark">
        {{ bookmarks.includes(post.id) ? '북마크 해제' : '북마크' }}
      </button>
      <RouterLink class="secondary-button" :to="`/board/${post.id}/edit`">수정</RouterLink>
    </div>

    <form class="password-panel" @submit.prevent="onDelete">
      <h2>게시글 삭제</h2>
      <p>작성할 때 입력한 수정용 비밀번호가 필요합니다.</p>
      <div class="inline-form">
        <input v-model="password" type="password" placeholder="비밀번호" />
        <button class="danger-button" type="submit">삭제</button>
      </div>
      <small v-if="error" class="form-error">{{ error }}</small>
    </form>
  </section>

  <section v-else class="empty-state">게시글을 찾을 수 없습니다.</section>
</template>
