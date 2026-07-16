const POSTS_KEY = 'localhub_posts';
const BOOKMARKS_KEY = 'localhub_bookmarks';
const READ_POSTS_KEY = 'localhub_read_posts';

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function seedPosts() {
  const now = new Date().toISOString();
  return [
    {
      id: crypto.randomUUID(),
      title: '누가 요즘 제주도가냐? 구미 가지',
      content: '마이구미 최고.',
      password: '1234',
      createdAt: '2025-09-02 14:20',
      updatedAt: '2025-09-02 14:20',
      views: 128,
      likes: 23,
      liked: false,
      comments: [
        {
          id: crypto.randomUUID(),
          author: '익명1',
          content: '구미 분위기 정말 좋죠! 저도 자주 가요.',
          password: '1234',
          createdAt: '2025-09-02 14:35',
          updatedAt: '2025-09-02 14:35',
        },
        {
          id: crypto.randomUUID(),
          author: '익명2',
          content: '이번 주말에도 가보고 싶네요.',
          password: '1234',
          createdAt: '2025-09-02 15:10',
          updatedAt: '2025-09-02 15:10',
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      title: '구미에서 가족이 가기 좋은 맛집 있을까요?',
      content: '아이들과 함께 갈 예정인데 주차 편하고 가족 단위로 방문하기 좋은 식당 추천 부탁드립니다.',
      password: '1234',
      createdAt: '2025-09-03 18:45',
      updatedAt: '2025-09-03 18:45',
      views: 94,
      likes: 11,
      liked: false,
      comments: [
        {
          id: crypto.randomUUID(),
          author: '익명1',
          content: '아이들과 가기 좋아요. 주차 편한 곳 위주로 찾는 게 핵심이에요.',
          password: '1234',
          createdAt: '2025-09-03 19:05',
          updatedAt: '2025-09-03 19:05',
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      title: '수성못페스티벌 다녀오신 분 후기 궁금합니다',
      content: '올해 처음 가보려고 하는데 사람이 많이 붐비나요? 주차 팁도 알려주세요.',
      password: '1234',
      createdAt: '2025-09-04 10:12',
      updatedAt: '2025-09-04 10:12',
      views: 203,
      likes: 41,
      liked: false,
      comments: [],
    },
    {
      id: crypto.randomUUID(),
      title: '구미역 근처 혼밥 맛집 추천',
      content: '출장으로 구미에 가는데 혼자 편하게 먹을 수 있는 식당 있으면 추천 부탁드립니다.',
      password: '1234',
      createdAt: '2025-09-05 12:30',
      updatedAt: '2025-09-05 12:30',
      views: 77,
      likes: 9,
      liked: false,
      comments: [],
    },
    {
      id: crypto.randomUUID(),
      title: 'Gumi, THE best place to visit with kids!',
      content: 'People are awesome here, and the food is delicious. Highly recommend visiting the local markets and parks.',
      password: '1234',
      createdAt: '2025-09-06 09:18',
      updatedAt: '2025-09-06 09:18',
      views: 156,
      likes: 18,
      liked: false,
      comments: [],
    },
    {
      id: crypto.randomUUID(),
      title: '칠곡보 자전거 코스 정말 좋네요!',
      content: '주말에 다녀왔는데 강바람도 시원하고 길도 잘 되어 있어서 라이딩하기 정말 좋았습니다.',
      password: '1234',
      createdAt: '2025-09-07 16:52',
      updatedAt: '2025-09-07 16:52',
      views: 265,
      likes: 52,
      liked: false,
      comments: [],
    },
    {
      id: crypto.randomUUID(),
      title: '구미 카페 추천 받아요 ☕',
      content: '사진 찍기 좋은 감성 카페나 디저트 맛있는 곳 추천 부탁드립니다.',
      password: '1234',
      createdAt: '2025-09-08 13:40',
      updatedAt: '2025-09-08 13:40',
      views: 121,
      likes: 16,
      liked: false,
      comments: [],
    },
    {
      id: crypto.randomUUID(),
      title: '가을에 가기 좋은 경북 드라이브 코스',
      content: '이번 주말 부모님과 드라이브 갈 예정인데 풍경 좋은 코스 추천해주세요.',
      password: '1234',
      createdAt: '2025-09-09 08:22',
      updatedAt: '2025-09-09 08:22',
      views: 318,
      likes: 67,
      liked: false,
      comments: [],
    },
    {
      id: crypto.randomUUID(),
      title: '남구청년예술제 기대 이상이었어요!',
      content: '공연 퀄리티가 생각보다 훨씬 좋았고 현장 분위기도 정말 즐거웠습니다.',
      password: '1234',
      createdAt: '2025-09-10 21:05',
      updatedAt: '2025-09-10 21:05',
      views: 174,
      likes: 39,
      liked: false,
      comments: [],
    },
    {
      id: crypto.randomUUID(),
      title: '구미 야경 명소 어디가 좋을까요?',
      content: '사진 찍기 좋은 야경 스팟이나 데이트하기 좋은 장소 추천 부탁드립니다.',
      password: '1234',
      createdAt: '2025-09-11 19:15',
      updatedAt: '2025-09-11 19:15',
      views: 142,
      likes: 21,
      liked: false,
      comments: [],
    },
    {
      id: crypto.randomUUID(),
      title: '성주 참외축제 처음 가봤습니다',
      content: '볼거리도 많고 시식 행사도 있어서 가족들과 즐겁게 다녀왔습니다.',
      password: '1234',
      createdAt: '2025-09-12 15:47',
      updatedAt: '2025-09-12 15:47',
      views: 196,
      likes: 35,
      liked: false,
      comments: [],
    },
    {
      id: crypto.randomUUID(),
      title: '비 오는 날 가기 좋은 실내 관광지 추천',
      content: '주말에 비 예보가 있어서 실내에서 즐길 수 있는 관광지나 전시관 추천 부탁드립니다.',
      password: '1234',
      createdAt: '2025-09-13 11:10',
      updatedAt: '2025-09-13 11:10',
      views: 87,
      likes: 13,
      liked: false,
      comments: [],
    },
    {
      id: crypto.randomUUID(),
      title: '구미 여행 1박 2일 코스 공유합니다',
      content: '금오산 → 금오지 → 맛집 → 카페 순으로 다녀왔는데 동선도 좋고 만족스러웠습니다.',
      password: '1234',
      createdAt: '2025-09-14 17:25',
      updatedAt: '2025-09-14 17:25',
      views: 402,
      likes: 88,
      liked: false,
      comments: [],
    },
    {
      id: crypto.randomUUID(),
      title: '주차하기 편한 관광지 추천해주세요',
      content: '부모님 모시고 갈 예정이라 주차가 편하고 이동하기 쉬운 관광지를 찾고 있습니다.',
      password: '1234',
      createdAt: '2025-09-15 10:50',
      updatedAt: '2025-09-15 10:50',
      views: 109,
      likes: 15,
      liked: false,
      comments: [],
    },
    {
      id: crypto.randomUUID(),
      title: '구미 시민운동장 근처 맛집 후기',
      content: '경기 보고 들렀는데 가격도 괜찮고 음식도 맛있었습니다. 재방문 의사 있습니다.',
      password: '1234',
      createdAt: '2025-09-16 20:08',
      updatedAt: '2025-09-16 20:08',
      views: 137,
      likes: 24,
      liked: false,
      comments: [],
    },
  ];
}

export function getPosts() {
  let posts = readJson(POSTS_KEY, null);
  if (!posts) {
    posts = seedPosts();
    writeJson(POSTS_KEY, posts);
  }

  const readPosts = getReadPosts();
  return posts
    .map((post) => ({
      ...post,
      liked: Boolean(post.liked),
      read: readPosts.includes(post.id),
      comments: Array.isArray(post.comments)
        ? post.comments.map((comment) => ({ ...comment }))
        : [],
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getReadPosts() {
  return readJson(READ_POSTS_KEY, []);
}

export function markPostAsRead(id) {
  const readPosts = getReadPosts();
  if (readPosts.includes(id)) return readPosts;

  const next = [...readPosts, id];
  writeJson(READ_POSTS_KEY, next);
  return next;
}

export function getPost(id) {
  return getPosts().find((post) => post.id === id);
}

export function savePost(payload, id = null) {
  const posts = getPosts();
  const now = new Date().toISOString();

  if (id) {
    const existing = posts.find((post) => post.id === id);
    const next = posts.map((post) =>
      post.id === id
        ? {
            ...post,
            title: payload.title,
            content: payload.content,
            password: existing?.password || payload.password,
            updatedAt: now,
            comments: existing?.comments || [],
          }
        : post,
    );
    writeJson(POSTS_KEY, next);
    return next.find((post) => post.id === id);
  }

  const post = {
    id: crypto.randomUUID(),
    title: payload.title,
    content: payload.content,
    password: payload.password,
    createdAt: now,
    updatedAt: now,
    views: 0,
    likes: 0,
    liked: false,
    comments: [],
  };
  writeJson(POSTS_KEY, [post, ...posts]);
  return post;
}

export function deletePost(id, password) {
  const post = getPost(id);
  if (!post || post.password !== password) return false;

  writeJson(
    POSTS_KEY,
    getPosts().filter((item) => item.id !== id),
  );
  return true;
}

export function checkPassword(id, password) {
  const post = getPost(id);
  return Boolean(post && post.password === password);
}

export function increaseViews(id) {
  const posts = getPosts();
  const next = posts.map((post) => (post.id === id ? { ...post, views: Number(post.views || 0) + 1 } : post));
  writeJson(POSTS_KEY, next);
}

export function likePost(id) {
  const posts = getPosts();
  const next = posts.map((post) => {
    if (post.id !== id) return post;

    const isLiked = Boolean(post.liked);
    return {
      ...post,
      liked: !isLiked,
      likes: Math.max(0, Number(post.likes || 0) + (isLiked ? -1 : 1)),
    };
  });

  writeJson(POSTS_KEY, next);
  return next.find((post) => post.id === id);
}

export function addComment(postId, payload) {
  const content = String(payload?.content || '').trim();
  const password = String(payload?.password || '').trim();
  if (!content || !password) return null;

  const posts = getPosts();
  const post = posts.find((item) => item.id === postId);
  if (!post) return null;

  const comments = Array.isArray(post.comments) ? post.comments : [];
  const comment = {
    id: crypto.randomUUID(),
    author: `익명${comments.length + 1}`,
    content,
    password,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const nextPosts = posts.map((item) =>
    item.id === postId ? { ...item, comments: [...comments, comment] } : item,
  );

  writeJson(POSTS_KEY, nextPosts);
  return comment;
}

export function updateComment(postId, commentId, payload) {
  const content = String(payload?.content || '').trim();
  const password = String(payload?.password || '').trim();
  if (!content || !password) return null;

  const posts = getPosts();
  const post = posts.find((item) => item.id === postId);
  if (!post) return null;

  const comments = Array.isArray(post.comments) ? post.comments : [];
  const target = comments.find((comment) => comment.id === commentId);
  if (!target || target.password !== password) return null;

  const nextComments = comments.map((comment) =>
    comment.id === commentId
      ? { ...comment, content, updatedAt: new Date().toISOString() }
      : comment,
  );

  const nextPosts = posts.map((item) =>
    item.id === postId ? { ...item, comments: nextComments } : item,
  );

  writeJson(POSTS_KEY, nextPosts);
  return nextComments.find((comment) => comment.id === commentId);
}

export function deleteComment(postId, commentId, password) {
  const posts = getPosts();
  const post = posts.find((item) => item.id === postId);
  if (!post) return null;

  const comments = Array.isArray(post.comments) ? post.comments : [];
  const target = comments.find((comment) => comment.id === commentId);
  if (!target || target.password !== password) return null;

  const nextComments = comments.filter((comment) => comment.id !== commentId);
  const nextPosts = posts.map((item) =>
    item.id === postId ? { ...item, comments: nextComments } : item,
  );

  writeJson(POSTS_KEY, nextPosts);
  return nextComments;
}

export function getBookmarks() {
  return readJson(BOOKMARKS_KEY, []);
}

export function toggleBookmark(id) {
  const bookmarks = getBookmarks();
  const next = bookmarks.includes(id) ? bookmarks.filter((item) => item !== id) : [...bookmarks, id];
  writeJson(BOOKMARKS_KEY, next);
  return next;
}

export function formatPostDate(value) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}