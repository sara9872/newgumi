<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPost, savePost } from '../stores/boardStore';

const route = useRoute();
const router = useRouter();
const editMode = computed(() => Boolean(route.params.id));
const title = ref('');
const content = ref('');
const password = ref('');
const error = ref('');

function submit() {
  error.value = '';

  if (!title.value.trim() || !content.value.trim()) {
    error.value = '제목과 내용을 모두 입력해 주세요.';
    return;
  }

  if (!editMode.value && !password.value.trim()) {
    error.value = '수정용 비밀번호를 입력해 주세요.';
    return;
  }

  const post = savePost(
    {
      title: title.value.trim(),
      content: content.value.trim(),
      password: password.value.trim(),
    },
    route.params.id,
  );
  router.push(`/board/${post.id}`);
}

onMounted(() => {
  if (!editMode.value) return;

  const post = getPost(route.params.id);
  if (!post) {
    router.push('/board');
    return;
  }

  title.value = post.title;
  content.value = post.content;
});
</script>

<template>
  <section class="page-header">
    <span class="eyebrow">게시판</span>
    <h1>{{ editMode ? '게시글 수정' : '게시글 작성' }}</h1>
    <p>비밀번호는 수정과 삭제 확인에만 사용되며 브라우저 localStorage에 저장됩니다.</p>
  </section>

  <form class="post-form" @submit.prevent="submit">
    <label>
      제목
      <input v-model="title" type="text" maxlength="80" placeholder="제목을 입력하세요" />
    </label>

    <label>
      내용
      <textarea v-model="content" rows="10" placeholder="내용을 입력하세요"></textarea>
    </label>

    <label v-if="!editMode">
      수정용 비밀번호
      <input v-model="password" type="password" placeholder="비밀번호" />
    </label>

    <small v-if="error" class="form-error">{{ error }}</small>

    <div class="action-row">
      <button class="primary-button" type="submit">{{ editMode ? '수정 완료' : '등록' }}</button>
      <RouterLink class="secondary-button" to="/board">취소</RouterLink>
    </div>
  </form>
</template>