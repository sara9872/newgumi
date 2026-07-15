import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import HomeView from './views/HomeView.vue';
import PlacesView from './views/PlacesView.vue';
import BoardListView from './views/BoardListView.vue';
import BoardFormView from './views/BoardFormView.vue';
import BoardDetailView from './views/BoardDetailView.vue';
import FestivalCalendarView from './views/FestivalCalendarView.vue';
import './styles.css';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/places/:category?', name: 'places', component: PlacesView },
  { path: '/board', name: 'board', component: BoardListView },
  { path: '/board/new', name: 'board-new', component: BoardFormView },
  { path: '/board/:id', name: 'board-detail', component: BoardDetailView },
  { path: '/board/:id/edit', name: 'board-edit', component: BoardFormView },
  { path: '/festivals', name: 'festivals', component: FestivalCalendarView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

createApp(App).use(router).mount('#app');
