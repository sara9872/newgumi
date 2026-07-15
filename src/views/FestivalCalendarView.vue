<script setup>
import { computed, onMounted, ref } from 'vue';
import { formatDate, loadCategory } from '../services/dataService';

const festivals = ref([]);
const selected = ref(null);
const current = ref(new Date());

const monthTitle = computed(() =>
  new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long' }).format(current.value),
);

const calendarDays = computed(() => {
  const year = current.value.getFullYear();
  const month = current.value.getMonth();
  const first = new Date(year, month, 1);
  const start = new Date(year, month, 1 - first.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const dateKey = toKey(date);
    return {
      date,
      key: dateKey,
      inMonth: date.getMonth() === month,
      festivals: festivals.value.filter((festival) => inRange(dateKey, festival.eventstartdate, festival.eventenddate)),
    };
  });
});

function toKey(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

function inRange(key, start, end) {
  if (!start) return false;
  const finish = end || start;
  return key >= start && key <= finish;
}

function moveMonth(offset) {
  current.value = new Date(current.value.getFullYear(), current.value.getMonth() + offset, 1);
}

onMounted(async () => {
  const data = await loadCategory('festivals');
  festivals.value = data.items
    .filter((item) => item.eventstartdate)
    .sort((a, b) => String(a.eventstartdate).localeCompare(String(b.eventstartdate)));
  selected.value = festivals.value[0] || null;
  if (selected.value?.eventstartdate) {
    const text = selected.value.eventstartdate;
    current.value = new Date(Number(text.slice(0, 4)), Number(text.slice(4, 6)) - 1, 1);
  }
});
</script>

<template>
  <section class="page-header">
    <span class="eyebrow">선택 기능</span>
    <h1>축제 캘린더</h1>
    <p>구미/경북 축제공연행사 JSON의 시작일과 종료일을 월별 달력으로 보여줍니다.</p>
  </section>

  <section class="calendar-layout">
    <div class="calendar-box">
      <div class="calendar-header">
        <button type="button" aria-label="이전 달" @click="moveMonth(-1)">‹</button>
        <h2>{{ monthTitle }}</h2>
        <button type="button" aria-label="다음 달" @click="moveMonth(1)">›</button>
      </div>

      <div class="calendar-grid weekdays">
        <strong v-for="day in ['일', '월', '화', '수', '목', '금', '토']" :key="day">{{ day }}</strong>
      </div>
      <div class="calendar-grid">
        <button
          v-for="day in calendarDays"
          :key="day.key"
          type="button"
          class="calendar-day"
          :class="{ muted: !day.inMonth, hasEvent: day.festivals.length }"
          @click="selected = day.festivals[0] || selected"
        >
          <span>{{ day.date.getDate() }}</span>
          <small v-for="festival in day.festivals.slice(0, 2)" :key="festival.contentid">{{ festival.title }}</small>
        </button>
      </div>
    </div>

    <aside class="festival-detail">
      <template v-if="selected">
        <img v-if="selected.firstimage" :src="selected.firstimage" :alt="selected.title" />
        <span class="chip">축제공연행사</span>
        <h2>{{ selected.title }}</h2>
        <dl class="detail-list">
          <div>
            <dt>기간</dt>
            <dd>{{ formatDate(selected.eventstartdate) }} - {{ formatDate(selected.eventenddate) }}</dd>
          </div>
          <div>
            <dt>장소</dt>
            <dd>{{ selected.eventplace || selected.addr1 || '정보 없음' }}</dd>
          </div>
          <div>
            <dt>시간</dt>
            <dd>{{ selected.playtime || '정보 없음' }}</dd>
          </div>
          <div>
            <dt>요금</dt>
            <dd>{{ selected.usetimefestival || '정보 없음' }}</dd>
          </div>
          <div>
            <dt>문의</dt>
            <dd>{{ selected.tel || selected.sponsor1tel || '정보 없음' }}</dd>
          </div>
        </dl>
        <p v-if="selected.program" class="program-text">{{ selected.program }}</p>
      </template>
      <div v-else class="empty-state">표시할 축제가 없습니다.</div>
    </aside>
  </section>
</template>
