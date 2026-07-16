import { loadAllData } from './dataService';
import { getPosts } from '../stores/boardStore';
import { getWeatherSummary } from './weatherService';

/**
 * 장소 데이터를 AI가 읽기 쉬운 한 줄 형식으로 변환합니다.
 */
function compactItem(item) {
  return [
    item?.title,
    item?.addr1,
    item?.eventstartdate,
    item?.eventenddate,
    item?.eventplace,
    item?.tel,
  ]
    .filter(Boolean)
    .join(' / ');
}

/**
 * LocalHub의 관광지, 음식점, 축제, 게시글 데이터를
 * OpenAI에 전달할 문맥으로 구성합니다.
 */
export async function buildLocalContext() {
  const data = await loadAllData();

  const attractions = (data?.attractions?.items ?? [])
    .slice(0, 12)
    .map(compactItem);

  const restaurants = (data?.restaurants?.items ?? [])
    .slice(0, 12)
    .map(compactItem);

  const festivals = (data?.festivals?.items ?? [])
    .slice(0, 12)
    .map(compactItem);

  const boardPosts = getPosts();

  const weatherSummary = await getWeatherSummary();

  const posts = (Array.isArray(boardPosts) ? boardPosts : [])
    .slice(0, 10)
    .map((post) => {
      const title =
        typeof post?.title === 'string' && post.title.trim()
          ? post.title.trim()
          : '제목 없음';

      const content =
        typeof post?.content === 'string'
          ? post.content.trim().slice(0, 100)
          : '';

      return content ? `${title}: ${content}` : title;
    });

  return [
    '[서비스 지역]',
    '구미 및 경북권',
    '포함 지역: 구미, 대구, 칠곡, 성주, 고령',
    '',
    '[오늘 날씨]',
    weatherSummary,
    '',
    '[관광지 데이터]',
    attractions.length > 0
      ? attractions.join('\n')
      : '등록된 관광지 데이터 없음',
    '',
    '[음식점 데이터]',
    restaurants.length > 0
      ? restaurants.join('\n')
      : '등록된 음식점 데이터 없음',
    '',
    '[축제 데이터]',
    festivals.length > 0
      ? festivals.join('\n')
      : '등록된 축제 데이터 없음',
    '',
    '[커뮤니티 최근 글]',
    posts.length > 0
      ? posts.join('\n')
      : '등록된 게시글 없음',
  ].join('\n');
}

/**
 * OpenAI에 질문을 전달하고 답변을 반환합니다.
 */
export async function askOpenAI(messages) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'OpenAI API 키가 설정되지 않았습니다. 프로젝트 루트의 .env 파일을 확인해 주세요.',
    );
  }

  const context = await buildLocalContext();

  const recentMessages = (Array.isArray(messages) ? messages : [])
    .slice(-8)
    .filter(
      (message) =>
        message &&
        ['user', 'assistant'].includes(message.role) &&
        typeof message.content === 'string' &&
        message.content.trim(),
    )
    .map((message) => ({
      role: message.role,
      content: message.content.trim(),
    }));

  const requestBody = {
    model: 'gpt-5-mini',

    /*
     * gpt-5-mini는 현재 temperature 0.5, 0.6 등의 값을
     * 지원하지 않고 기본값 1만 허용하므로 temperature를 넣지 않습니다.
     */

    messages: [
      {
        role: 'system',
        content: `
너는 LocalHub의 구미·경북 지역 정보 안내 챗봇이다.

너의 역할은 LocalHub에서 제공한 관광지, 음식점, 축제, 지역 행사,
커뮤니티 게시글 데이터를 검색하고 사용자의 질문에 맞게 정리하는 것이다.

반드시 아래 규칙을 지켜라.

[1. 사용할 수 있는 정보]
- 아래에 제공된 LocalHub 데이터만 사용한다.
- 모델이 알고 있는 일반 지식이나 외부 정보를 추가하지 않는다.
- 데이터에 없는 정보는 사실처럼 말하지 않는다.
- 장소명, 주소, 전화번호, 날짜, 운영시간, 가격, 메뉴를 임의로 만들지 않는다.
- 날씨 정보를 제공할 때는 반드시 weatherService.js에서 가져온 오늘 날씨 요약만 사용한다.
- 날씨 정보를 바탕으로 강수, 기온, 야외 활동 여부에 대한 조언을 제공할 수 있다.

[2. 정보를 찾지 못한 경우]
- 질문과 관련된 정보를 제공 데이터에서 찾을 수 없다면
  반드시 "해당 내용을 찾을 수 없습니다."라고 답한다.
- 비슷한 장소나 내용을 임의로 대신 제시하지 않는다.
- 정보가 부족하더라도 추측해서 답하지 않는다.

[3. 관광지 추천]
- 사용자의 질문과 관련 있는 관광지가 여러 개라면 최대 3개만 안내한다.
- 가능한 경우 장소명, 주소, 연락처 순서로 정리한다.
- 데이터에 없는 항목은 생략한다.

[4. 음식점 안내]
- 음식점명과 주소를 우선 안내한다.
- 대표 메뉴, 가격, 영업시간이 데이터에 없으면 언급하지 않는다.
- "가족과 갈 음식점", "데이트 음식점"처럼 조건이 있는 질문은
  제공 데이터에서 그 조건을 확인할 수 있을 때만 추천한다.

[5. 축제 안내]
- 축제명, 시작일, 종료일, 개최 장소를 우선 안내한다.
- 현재 진행 중인지 여부는 날짜 데이터로 판단할 수 있을 때만 말한다.
- 날짜가 없거나 불명확하면 진행 여부를 추측하지 않는다.

[6. 게시판 안내]
- 게시판 관련 질문에는 제공된 게시글 제목과 내용만 사용한다.
- 게시글에 적혀 있지 않은 내용을 추가하지 않는다.

[7. 질문이 모호한 경우]
- "음식점 찾아줘", "관광지 추천해줘"처럼 질문 범위가 넓다면
  데이터에 있는 결과를 최대 3개 보여준다.
- 필요하다면 지역, 방문 목적 또는 원하는 조건을 물어본다.

[8. 답변 형식]
- 한국어로 답한다.
- 짧고 명확하게 답한다.
- 여러 결과가 있으면 번호를 사용한다.
- 장소별 정보를 구분해서 보여준다.
- 불필요한 인사말이나 긴 설명은 생략한다.
- 제공 데이터에 있는 정보만 사용한다.
        `.trim(),
      },
      {
        role: 'system',
        content: `
아래는 현재 LocalHub에서 제공하는 데이터이다.

${context}
        `.trim(),
      },
      ...recentMessages,
    ],
  };

  let response;

  try {
    response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      },
    );
  } catch (error) {
    console.error('OpenAI 네트워크 요청 실패:', error);

    throw new Error(
      `OpenAI 서버에 연결하지 못했습니다: ${
        error instanceof Error
          ? error.message
          : '알 수 없는 네트워크 오류'
      }`,
    );
  }

  const responseData = await response.json().catch((error) => {
    console.error('OpenAI 응답 JSON 변환 실패:', error);
    return null;
  });

  if (!response.ok) {
    console.error('OpenAI API 상태 코드:', response.status);
    console.error(
      'OpenAI API 오류 메시지:',
      responseData?.error?.message,
    );
    console.error(
      'OpenAI API 오류 파라미터:',
      responseData?.error?.param,
    );
    console.error('OpenAI API 전체 오류:', responseData);

    throw new Error(
      responseData?.error?.message ||
        `OpenAI API 호출 실패 (${response.status})`,
    );
  }

  const answer =
    responseData?.choices?.[0]?.message?.content?.trim();

  if (!answer) {
    console.error('예상하지 못한 OpenAI 응답:', responseData);
    throw new Error(
      'OpenAI 응답에서 답변 내용을 찾지 못했습니다.',
    );
  }

  return answer;
}