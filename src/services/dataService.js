const DATA_FILES = {
  attractions: { label: '관광지', file: '구미_경북권_관광지.json' },
  restaurants: { label: '음식점', file: '구미_경북권_음식점.json' },
  festivals: { label: '축제공연행사', file: '구미_경북권_축제공연행사.json' },
  hotels: { label: '숙박', file: '구미_경북권_숙박.json' },
  culture: { label: '문화시설', file: '구미_경북권_문화시설.json' },
  shopping: { label: '쇼핑', file: '구미_경북권_쇼핑.json' },
  leisure: { label: '레포츠', file: '구미_경북권_레포츠.json' },
  courses: { label: '여행코스', file: '구미_경북권_여행코스.json' },
};

const cache = new Map();

export const categories = Object.entries(DATA_FILES).map(([key, value]) => ({
  key,
  label: value.label,
}));

export async function loadCategory(key) {
  const entry = DATA_FILES[key] || DATA_FILES.attractions;
  if (cache.has(key)) return cache.get(key);

  const response = await fetch(encodeURI(`/data/${entry.file}`));
  if (!response.ok) {
    throw new Error(`${entry.label} 데이터를 불러오지 못했습니다.`);
  }
  const data = await response.json();
  const items = Array.isArray(data.items) ? data.items : [];
  const result = { ...data, label: entry.label, items };
  cache.set(key, result);
  return result;
}

export async function loadAllData() {
  const entries = await Promise.all(categories.map((category) => loadCategory(category.key)));
  return categories.reduce((acc, category, index) => {
    acc[category.key] = entries[index];
    return acc;
  }, {});
}

export function normalizeText(value) {
  return String(value || '').trim();
}

export function formatDate(value) {
  const text = normalizeText(value);
  if (!/^\d{8}$/.test(text)) return '일정 미정';
  return `${text.slice(0, 4)}.${text.slice(4, 6)}.${text.slice(6, 8)}`;
}

export function getItemSummary(item) {
  return {
    id: item.contentid,
    title: normalizeText(item.title),
    address: normalizeText([item.addr1, item.addr2].filter(Boolean).join(' ')),
    tel: normalizeText(item.tel),
    image: normalizeText(item.firstimage || item.firstimage2),
    mapx: normalizeText(item.mapx),
    mapy: normalizeText(item.mapy),
  };
}
