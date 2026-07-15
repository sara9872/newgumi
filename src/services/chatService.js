import { loadAllData } from './dataService';
import { getPosts } from '../stores/boardStore';

function compactItem(item) {
  return [item.title, item.addr1, item.eventstartdate, item.eventenddate, item.eventplace, item.tel]
    .filter(Boolean)
    .join(' / ');
}

export async function buildLocalContext() {
  const data = await loadAllData();
  const attractions = data.attractions.items.slice(0, 12).map(compactItem);
  const restaurants = data.restaurants.items.slice(0, 12).map(compactItem);
  const festivals = data.festivals.items.slice(0, 12).map(compactItem);
  const posts = getPosts()
    .slice(0, 10)
    .map((post) => `${post.title}: ${post.content.slice(0, 80)}`);

  return [
    '지역: 구미/경북권. 포함 지역: 구미, 대구 칠곡, 성주, 고령.',
    `관광지 예시: ${attractions.join(' | ')}`,
    `음식점 예시: ${restaurants.join(' | ')}`,
    `축제 예시: ${festivals.join(' | ')}`,
    `커뮤니티 최근 글: ${posts.join(' | ')}`,
  ].join('\n');
}

export async function askOpenAI(messages) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    return 'OpenAI API 키가 설정되지 않았습니다. .env에 VITE_OPENAI_API_KEY를 추가하면 데이터 기반 답변을 받을 수 있습니다.';
  }

  const context = await buildLocalContext();
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content:
            '너는 구미/경북 LocalHub 안내 챗봇이다. 제공된 지역 데이터와 커뮤니티 글을 바탕으로 짧고 구체적으로 한국어로 답한다. 모르는 정보는 추측하지 않는다.',
        },
        { role: 'system', content: context },
        ...messages.slice(-8),
      ],
    }),
  });

  if (!response.ok) {
    throw new Error('OpenAI API 호출 실패');
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '답변을 만들지 못했습니다.';
}
