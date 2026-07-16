<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faHeart, faStar } from '@fortawesome/free-solid-svg-icons';
import {
  checkPassword,
  deletePost,
  formatPostDate,
  getBookmarks,
  getPost,
  increaseViews,
  likePost,
  markPostAsRead,
  toggleBookmark,
} from '../stores/boardStore';

const byPrefixAndName = {
  fas: {
    heart: faHeart,
    star: faStar,
  },
};

const route = useRoute();
const router = useRouter();
const post = ref(null);
const bookmarks = ref([]);
const password = ref('');
const error = ref('');
const authMode = ref(null);
const showAuthModal = ref(false);

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

function openAuthModal(mode) {
  authMode.value = mode;
  showAuthModal.value = true;
  password.value = '';
  error.value = '';
}

function closeAuthModal() {
  authMode.value = null;
  showAuthModal.value = false;
  password.value = '';
  error.value = '';
}

function confirmAuth() {
  error.value = '';

  if (!password.value.trim()) {
    error.value = '비밀번호를 입력해 주세요.';
    return;
  }

  if (authMode.value === 'delete') {
    if (!deletePost(route.params.id, password.value)) {
      error.value = '비밀번호가 일치하지 않습니다.';
      return;
    }
    closeAuthModal();
    router.push('/board');
    return;
  }

  if (authMode.value === 'edit') {
    if (!checkPassword(route.params.id, password.value)) {
      error.value = '비밀번호가 일치하지 않습니다.';
      return;
    }
    closeAuthModal();
    router.push(`/board/${route.params.id}/edit`);
  }
}

onMounted(() => {
  increaseViews(route.params.id);
  markPostAsRead(route.params.id);
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
      <button class="secondary-button" type="button" @click="onLike">
        <FontAwesomeIcon
          :icon="byPrefixAndName.fas['heart']"
          :style="{ color: post.liked ? '#ff33ad' : '#bdbdbd' }"
        />
        <span>{{ post.likes || 0 }}</span>
      </button>

      <button class="secondary-button" type="button" @click="onBookmark">
        <FontAwesomeIcon
          :icon="byPrefixAndName.fas['star']"
          :style="{ color: bookmarks.includes(post.id) ? '#ffd53d' : '#bdbdbd' }"
        />
      </button>

      <button class="secondary-button" type="button" @click="openAuthModal('edit')">수정</button>
      <button class="secondary-button" type="button" @click="openAuthModal('delete')">삭제</button>
    </div>

    <div v-if="showAuthModal" class="modal-backdrop" @click.self="closeAuthModal">
      <div class="modal-card">
        <h3>{{ authMode === 'edit' ? '게시글 수정' : '게시글 삭제' }}</h3>
        <p>{{ authMode === 'edit' ? '수정하려면 비밀번호를 입력해 주세요.' : '삭제하려면 비밀번호를 입력해 주세요.' }}</p>

        <div class="inline-form">
          <input v-model="password" type="password" placeholder="비밀번호" />
          <button class="primary-button" type="button" @click="confirmAuth">
            {{ authMode === 'edit' ? '수정 확인' : '삭제 확인' }}
          </button>
          <button class="secondary-button" type="button" @click="closeAuthModal">취소</button>
        </div>

        <small v-if="error" class="form-error">{{ error }}</small>
      </div>
    </div>
  </section>

  <section v-else class="empty-state">게시글을 찾을 수 없습니다.</section>
</template>