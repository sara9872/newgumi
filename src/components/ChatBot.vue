<script setup>
import { nextTick, ref } from 'vue';
import { askOpenAI } from '../services/chatService';

const open = ref(false);
const input = ref('');
const loading = ref(false);
const messages = ref([
  {
    role: 'assistant',
    content: '안녕하세요. 구미/경북 관광지, 음식점, 축제, 게시판 글을 물어보세요.',
  },
]);
const logEl = ref(null);

const examples = ['구미 축제 추천해줘', '가족이 갈 관광지 알려줘', '음식점 찾아줘', '게시판 글 검색해줘'];

async function scrollToBottom() {
  await nextTick();
  if (logEl.value) logEl.value.scrollTop = logEl.value.scrollHeight;
}

async function send(text = input.value) {
  const content = text.trim();
  if (!content || loading.value) return;

  input.value = '';
  messages.value.push({ role: 'user', content });
  loading.value = true;
  await scrollToBottom();

  try {
    const answer = await askOpenAI(messages.value);
    messages.value.push({ role: 'assistant', content: answer });
  } catch {
    messages.value.push({
      role: 'assistant',
      content: '현재 답변을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.',
    });
  } finally {
    loading.value = false;
    await scrollToBottom();
  }
}
</script>

<template>
  <button v-if="!open" class="chat-fab" type="button" aria-label="챗봇 열기" @click="open = true">AI</button>

  <section v-else class="chat-panel" aria-label="LocalHub 챗봇">
    <header class="chat-header">
      <div>
        <strong>LocalHub AI</strong>
        <small>구미/경북 데이터 안내</small>
      </div>
      <button type="button" aria-label="챗봇 닫기" @click="open = false">×</button>
    </header>

    <div ref="logEl" class="chat-log">
      <div v-for="(message, index) in messages" :key="index" class="chat-message" :class="message.role">
        {{ message.content }}
      </div>
      <div v-if="loading" class="chat-message assistant">답변을 준비하고 있습니다...</div>
    </div>

    <div class="chat-examples">
      <button v-for="example in examples" :key="example" type="button" @click="send(example)">
        {{ example }}
      </button>
    </div>

    <form class="chat-form" @submit.prevent="send()">
      <input v-model="input" type="text" placeholder="질문을 입력하세요" />
      <button type="submit" :disabled="loading">전송</button>
    </form>
  </section>
</template>
