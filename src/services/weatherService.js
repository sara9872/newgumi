const WEATHER_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=36.11655&longitude=128.3467778&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,rain,precipitation,precipitation_probability,apparent_temperature,weather_code&current=precipitation,temperature_2m,is_day,rain,apparent_temperature&timezone=Asia%2FTokyo';

function getWeatherLabel(code) {
  const map = {
    0: '맑음',
    1: '대체로 맑음',
    2: '부분적으로 흐림',
    3: '흐림',
    45: '안개',
    48: '서리 안개',
    51: '가벼운 비',
    61: '비',
    71: '눈',
    95: '천둥번개',
  };
  return map[code] || '기상 상태';
}

export async function getWeatherSummary() {
  try {
    const response = await fetch(WEATHER_URL);
    if (!response.ok) throw new Error('날씨 API 실패');

    const data = await response.json();
    const current = data.current || {};

    const temp = current.temperature_2m ?? '-';
    const precipitation = current.precipitation ?? 0;
    const weatherCode = current.weather_code;
    const weatherLabel = getWeatherLabel(weatherCode);

    let advice = '오늘은 비교적 쾌적한 날씨입니다.';
    if (precipitation > 1) {
      advice = '비나 강수가 있어 야외 활동보다는 실내 활동을 추천합니다.';
    } else if (temp >= 30) {
      advice = '더우니 실내 활동이나 충분한 수분 섭취가 좋습니다.';
    } else if (temp <= 5) {
      advice = '추우니 따뜻한 옷과 실내 활동을 추천합니다.';
    }

    return `오늘 구미 날씨: ${weatherLabel}, 기온 ${temp}°C, 강수량 ${precipitation}mm. ${advice}`;
  } catch (error) {
    return '오늘 날씨 정보를 가져오지 못했습니다.';
  }
}