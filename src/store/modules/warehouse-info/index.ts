import { defineStore } from 'pinia';
import { WareHouseRecord } from './types';
import useAppStore from '../app';

const useWarehouseInfoStore = defineStore('warehouseInfo', {
  state: (): WareHouseRecord => ({
    id: undefined,
    name: undefined,
    adminName: undefined,
    adminEmail: undefined,
    province: undefined,
    city: undefined,
    district: undefined,
    totalNumber: undefined,
    useNumber: undefined,
  }),

  getters: {
    warehouseInfo(state: WareHouseRecord): WareHouseRecord {
      return state ;
    },
  },

  actions: {
    // Set user's information
    setInfo(partial: Partial<WareHouseRecord>) {
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },
  },
});

export default useWarehouseInfoStore;
