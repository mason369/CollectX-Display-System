// 路由模块
import { RouteRecordRaw } from 'vue-router';

export const routes: Array<RouteRecordRaw> = [
    {
        // 首页
        path: '/',
        name: 'Home',
        component: () => import('../views/Home/index.vue'),
    },
];
