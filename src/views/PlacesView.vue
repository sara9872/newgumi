<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PlaceCard from '../components/PlaceCard.vue';
import { categories, getItemSummary, loadCategory } from '../services/dataService';

const route = useRoute();
const router = useRouter();
const selected = ref(route.params.category || 'attractions');
const query = ref('');
const items = ref([]);
const label = ref('');
const loading = ref(true);

const filteredItems = computed(() => {
  const term = query.value.trim().toLowerCase();
  if (!term) return items.value;
  return items.value.filter((item) =>
    [item.title, item.address, item.tel].some((value) => String(value || '').toLowerCase().includes(term)),
  );
});

async function load() {
  loading.value = true;
  const data = await loadCategory(selected.value);
  label.value = data.label;
  items.value = data.items.map(getItemSummary);
  loading.value = false;
}

function changeCategory(key) {
  selected.value = key;
  router.push(`/places/${key}`);
}

watch(
  () => route.params.category,
  (value) => {
    selected.value = value || 'attractions';
    load();
  },
);

onMounted(load);
</script>

<template>
  <section class="page-header">
    <span class="eyebrow">지역 정보</span>
    <h1>구미/경북 공공데이터</h1>
    <p>제공 JSON 데이터를 프론트엔드에서 직접 불러와 관광지와 생활 정보를 보여줍니다.</p>
  </section>

  <section class="toolbar">
    <div class="tabs">
      <button
        v-for="category in categories"
        :key="category.key"
        type="button"
        :class="{ active: selected === category.key }"
        @click="changeCategory(category.key)"
      >
        {{ category.label }}
      </button>
    </div>
    <input v-model="query" class="search-input" type="search" placeholder="이름, 주소, 전화번호 검색" />
  </section>

  <section class="section">
    <div v-if="loading" class="empty-state">데이터를 불러오는 중입니다.</div>
    <div v-else-if="!filteredItems.length" class="empty-state">검색 결과가 없습니다.</div>
    <div v-else class="card-grid">
      <PlaceCard v-for="item in filteredItems" :key="item.id" :item="item" :label="label" />
    </div>
  </section>
</template>
