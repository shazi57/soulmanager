import { createWebHashHistory, createRouter } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SoulListView from '../views/SoulListView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/souls',
    name: 'SoulList',
    component: SoulListView,
    // beforeEnter: (to, from) => {
    //   console.log(to);
    // },
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
