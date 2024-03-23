import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const COMP: AppRouteRecordRaw = {
  path: '/comp',
  name: 'comp ',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.comp',
    requiresAuth: true,
    icon: 'icon-dashboard',
    order: 0,
  },
  children: [
    {
      path: 'myComp',
      name: 'myComp',
      component: () => import('@/views/comp/myComp/index.vue'),
      meta: {
        locale: 'menu.comp.myComp',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'createComp',
      name: 'createComp',
      component: () => import('@/views/comp/compCreate/index.vue'),
      meta: {
        locale: 'menu.comp.createComp',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default COMP;
