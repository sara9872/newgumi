<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faHeart, faStar } from '@fortawesome/free-solid-svg-icons';
import {
  addComment,
  checkPassword,
  deleteComment,
  deletePost,
  formatPostDate,
  getBookmarks,
  getPost,
  increaseViews,
  likePost,
  markPostAsRead,
  toggleBookmark,
  updateComment,
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

const commentDraft = ref('');
const commentPassword = ref('');
const commentError = ref('');
const editingCommentId = ref(null);
const editingCommentContent = ref('');
const showCommentAuthModal = ref(false);
const commentAuthMode = ref(null);
const commentAuthTarget = ref(null);
const commentAuthPassword = ref('');
const commentAuthError = ref('');

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

function submitComment() {
  commentError.value = '';
  const content = commentDraft.value.trim();
  const password = commentPassword.value.trim();

  if (!content || !password) {
    commentError.value = '댓글 내용과 비밀번호를 모두 입력해 주세요.';
    return;
  }

  const comment = addComment(route.params.id, { content, password });
  if (!comment) {
    commentError.value = '댓글 등록에 실패했습니다.';
    return;
  }

  post.value = getPost(route.params.id);
  commentDraft.value = '';
  commentPassword.value = '';
}

function startEditComment(comment) {
  editingCommentId.value = comment.id;
  editingCommentContent.value = comment.content;
}

function cancelEditComment() {
  editingCommentId.value = null;
  editingCommentContent.value = '';
}

function submitEditComment(commentId) {
  if (!editingCommentContent.value.trim()) {
    commentError.value = '수정할 댓글 내용을 입력해 주세요.';
    return;
  }
  commentError.value = '';
  openCommentAuthModal('edit', commentId);
}

function openCommentAuthModal(mode, commentId) {
  commentAuthMode.value = mode;
  commentAuthTarget.value = commentId;
  showCommentAuthModal.value = true;
  commentAuthPassword.value = '';
  commentAuthError.value = '';
}

function closeCommentAuthModal() {
  commentAuthMode.value = null;
  commentAuthTarget.value = null;
  showCommentAuthModal.value = false;
  commentAuthPassword.value = '';
  commentAuthError.value = '';
}

function confirmCommentAuth() {
  commentAuthError.value = '';

  if (!commentAuthPassword.value.trim()) {
    commentAuthError.value = '비밀번호를 입력해 주세요.';
    return;
  }

  if (commentAuthMode.value === 'delete') {
    const updated = deleteComment(route.params.id, commentAuthTarget.value, commentAuthPassword.value);
    if (!updated) {
      commentAuthError.value = '비밀번호가 일치하지 않습니다.';
      return;
    }
    post.value = getPost(route.params.id);
    closeCommentAuthModal();
    return;
  }

  if (commentAuthMode.value === 'edit') {
    const updated = updateComment(route.params.id, commentAuthTarget.value, {
      content: editingCommentContent.value,
      password: commentAuthPassword.value,
    });
    if (!updated) {
      commentAuthError.value = '비밀번호가 일치하지 않습니다.';
      return;
    }
    post.value = getPost(route.params.id);
    editingCommentId.value = null;
    editingCommentContent.value = '';
    closeCommentAuthModal();
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

    <section class="comment-section">
      <h3>댓글 {{ post.comments?.length || 0 }}</h3>

      <form class="comment-form" @submit.prevent="submitComment">
        <textarea v-model="commentDraft" rows="3" placeholder="댓글을 남겨보세요."></textarea>
        <div class="comment-form-footer">
          <input v-model="commentPassword" type="password" placeholder="비밀번호" />
          <button class="primary-button" type="submit">댓글 등록</button>
        </div>
        <small v-if="commentError" class="form-error">{{ commentError }}</small>
      </form>

      <div v-if="post.comments?.length" class="comment-list">
        <article v-for="comment in post.comments" :key="comment.id" class="comment-item">
          <div class="comment-meta">
            <strong>{{ comment.author }}</strong>
            <span>{{ formatPostDate(comment.createdAt) }}</span>
          </div>

          <p v-if="editingCommentId !== comment.id">{{ comment.content }}</p>
          <textarea v-else v-model="editingCommentContent" rows="3"></textarea>

          <div class="comment-actions">
            <button v-if="editingCommentId !== comment.id" class="secondary-button" type="button" @click="startEditComment(comment)">
              수정
            </button>
            <button v-else class="primary-button" type="button" @click="submitEditComment(comment.id)">
              수정 완료
            </button>
            <button v-if="editingCommentId === comment.id" class="secondary-button" type="button" @click="cancelEditComment">
              취소
            </button>
            <button class="secondary-button" type="button" @click="openCommentAuthModal('delete', comment.id)">
              삭제
            </button>
          </div>
        </article>
      </div>
      <div v-else class="empty-state">아직 댓글이 없습니다.</div>
    </section>

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

    <div v-if="showCommentAuthModal" class="modal-backdrop" @click.self="closeCommentAuthModal">
      <div class="modal-card">
        <h3>{{ commentAuthMode === 'edit' ? '댓글 수정' : '댓글 삭제' }}</h3>
        <p>{{ commentAuthMode === 'edit' ? '수정하려면 비밀번호를 입력해 주세요.' : '삭제하려면 비밀번호를 입력해 주세요.' }}</p>

        <div class="inline-form">
          <input v-model="commentAuthPassword" type="password" placeholder="비밀번호" />
          <button class="primary-button" type="button" @click="confirmCommentAuth">
            {{ commentAuthMode === 'edit' ? '수정 확인' : '삭제 확인' }}
          </button>
          <button class="secondary-button" type="button" @click="closeCommentAuthModal">취소</button>
        </div>

        <small v-if="commentAuthError" class="form-error">{{ commentAuthError }}</small>
      </div>
    </div>
  </section>

  <section v-else class="empty-state">게시글을 찾을 수 없습니다.</section>
</template>