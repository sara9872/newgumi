const POSTS_KEY = 'localhub_posts';
const BOOKMARKS_KEY = 'localhub_bookmarks';

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
      title: '금오산 산책 코스 추천해요',
      content: '초보자도 걷기 좋은 코스가 많고, 오후에는 금오지가 특히 예쁩니다.',
      password: '1234',
      createdAt: now,
      updatedAt: now,
      views: 0,
      likes: 3,
      liked: false,
    },
    {
      id: crypto.randomUUID(),
      title: '구미라면 축제 같이 갈 사람 있나요?',
      content: '축제 일정 확인하고 맛집도 같이 둘러보면 좋을 것 같아요.',
      password: '1234',
      createdAt: now,
      updatedAt: now,
      views: 0,
      likes: 5,
      liked: true,
    },
  ];
}

export function getPosts() {
  let posts = readJson(POSTS_KEY, null);
  if (!posts) {
    posts = seedPosts();
    writeJson(POSTS_KEY, posts);
  }
  return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getPost(id) {
  return getPosts().find((post) => post.id === id);
}

export function savePost(payload, id = null) {
  const posts = getPosts();
  const now = new Date().toISOString();

  if (id) {
    const next = posts.map((post) =>
      post.id === id
        ? { ...post, title: payload.title, content: payload.content, password: payload.password, updatedAt: now }
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

    const liked = Boolean(post.liked ?? false);

    return {
      ...post,
      liked: !liked,
      likes: Math.max(0, Number(post.likes || 0) + (liked ? -1 : 1)),
    };
  });

  writeJson(POSTS_KEY, next);
  return next.find((post) => post.id === id);
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
