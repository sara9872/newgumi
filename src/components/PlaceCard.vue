<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <article class="place-card">
    <div class="place-image">
      <img
        v-if="item.image"
        :src="item.image"
        :alt="item.title"
        loading="lazy"
      />
      <span v-else>LocalHub</span>
    </div>

    <div class="place-body">
      <div class="chip-row">
        <span v-if="label" class="chip">
          {{ label }}
        </span>
      </div>

      <h3>{{ item.title || '이름 없음' }}</h3>

      <p>{{ item.address || '주소 정보 없음' }}</p>

      <dl class="meta-list">
        <div v-if="item.tel">
          <dt>전화</dt>
          <dd>{{ item.tel }}</dd>
        </div>
      </dl>
    </div>
  </article>
</template>