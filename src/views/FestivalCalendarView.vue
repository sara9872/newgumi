<script setup>
import { computed, onMounted, ref } from 'vue';
import { formatDate, loadCategory } from '../services/dataService';

const festivals = ref([]);

/*
 * 기존에는 축제 하나만 저장했지만,
 * 같은 날짜의 여러 축제를 저장하기 위해 배열로 변경합니다.
 */
const selectedFestivals = ref([]);

const current = ref(new Date());

const monthTitle = computed(() =>
  new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
  }).format(current.value),
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
      festivals: festivals.value.filter((festival) =>
        inRange(
          dateKey,
          festival.eventstartdate,
          festival.eventenddate,
        ),
      ),
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
  current.value = new Date(
    current.value.getFullYear(),
    current.value.getMonth() + offset,
    1,
  );
}

/*
 * 해당 날짜의 축제가 하나 이상 있으면
 * 그 날짜에 포함된 축제 전체를 선택합니다.
 *
 * 축제가 없는 날짜를 눌렀을 때는
 * 기존 선택 상태를 그대로 유지합니다.
 */
function selectDayFestivals(dayFestivals) {
  if (dayFestivals.length > 0) {
    selectedFestivals.value = dayFestivals;
  }
}

onMounted(async () => {
  const data = await loadCategory('festivals');

  festivals.value = data.items
    .filter((item) => item.eventstartdate)
    .sort((a, b) =>
      String(a.eventstartdate).localeCompare(
        String(b.eventstartdate),
      ),
    );

  /*
   * 처음에는 기존과 동일하게 첫 번째 축제를 보여주되,
   * 배열 형태로 저장합니다.
   */
  selectedFestivals.value = festivals.value[0]
    ? [festivals.value[0]]
    : [];

  const firstSelected = selectedFestivals.value[0];

  if (firstSelected?.eventstartdate) {
    const text = firstSelected.eventstartdate;

    current.value = new Date(
      Number(text.slice(0, 4)),
      Number(text.slice(4, 6)) - 1,
      1,
    );
  }
});
</script>

<template>
  <section class="page-header">
    <span class="eyebrow">선택 기능</span>
    <h1>축제 캘린더</h1>
    <p>
      구미/경북 축제공연행사 일정을
      월별 달력으로 보여줍니다.
    </p>
  </section>

  <section class="calendar-layout">
    <div class="calendar-box">
      <div class="calendar-header">
        <button
          type="button"
          aria-label="이전 달"
          @click="moveMonth(-1)"
        >
          ‹
        </button>

        <h2>{{ monthTitle }}</h2>

        <button
          type="button"
          aria-label="다음 달"
          @click="moveMonth(1)"
        >
          ›
        </button>
      </div>

      <div class="calendar-grid weekdays">
        <strong
          v-for="day in ['일', '월', '화', '수', '목', '금', '토']"
          :key="day"
        >
          {{ day }}
        </strong>
      </div>

      <div class="calendar-grid">
        <button
          v-for="day in calendarDays"
          :key="day.key"
          type="button"
          class="calendar-day"
          :class="{
            muted: !day.inMonth,
            hasEvent: day.festivals.length,
          }"
          @click="selectDayFestivals(day.festivals)"
        >
          <span>{{ day.date.getDate() }}</span>

          <small v-if="day.festivals.length">
  {{ day.festivals[0].title }}
</small>

<small
  v-if="day.festivals.length > 1"
  class="more-events"
>
  +{{ day.festivals.length - 1 }}
</small>
        </button>
      </div>
    </div>

   <aside class="festival-detail-list">
  <template v-if="selectedFestivals.length">
    <article
      v-for="festival in selectedFestivals"
      :key="
        festival.contentid ||
        `${festival.title}-${festival.eventstartdate}`
      "
      class="festival-detail"
    >
      <img
        v-if="festival.firstimage"
        :src="festival.firstimage"
        :alt="festival.title"
      />

      <span class="chip">축제공연행사</span>

      <h2>{{ festival.title }}</h2>

      <dl class="detail-list">
        <div>
          <dt>기간</dt>
          <dd>
            {{ formatDate(festival.eventstartdate) }}
            -
            {{
              formatDate(
                festival.eventenddate ||
                  festival.eventstartdate,
              )
            }}
          </dd>
        </div>

        <div>
          <dt>장소</dt>
          <dd>
            {{
              festival.eventplace ||
              festival.addr1 ||
              '정보 없음'
            }}
          </dd>
        </div>

        <div>
          <dt>시간</dt>
          <dd>{{ festival.playtime || '정보 없음' }}</dd>
        </div>

        <div>
          <dt>요금</dt>
          <dd>{{ festival.usetimefestival || '정보 없음' }}</dd>
        </div>

        <div>
          <dt>문의</dt>
          <dd>
            {{
              festival.tel ||
              festival.sponsor1tel ||
              '정보 없음'
            }}
          </dd>
        </div>
      </dl>

      <p v-if="festival.program" class="program-text">
        {{ festival.program }}
      </p>
    </article>
  </template>

  <div v-else class="festival-detail empty-state">
    표시할 축제가 없습니다.
  </div>
</aside>
  </section>
</template>
