import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const STATION: AppRouteRecordRaw = {
  path: '/station',
  name: 'station',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.station',
    requiresAuth: true,
    icon: 'icon-list',
    order: 2,
  },
  children: [
    {
      path: 'mission-table', // The midline path complies with SEO specifications
      name: 'MissionTable',
      component: () => import('@/views/station/mission-table/index.vue'),
      meta: {
        locale: 'menu.station.missionTable',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'courier-table', // The midline path complies with SEO specifications
      name: 'CourierTable',
      component: () => import('@/views/station/courier-table/index.vue'),
      meta: {
        locale: 'menu.station.courierTable',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'station-info',
      name: 'StationInfo',
      component: () => import('@/views/station/station-info/index.vue'),
      meta: {
        locale: 'menu.station.stationInfo',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'station-table', // The midline path complies with SEO specifications
      name: 'StationTable',
      component: () => import('@/views/station/station-table/index.vue'),
      meta: {
        locale: 'menu.station.stationTable',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default STATION;
