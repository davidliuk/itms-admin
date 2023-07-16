<template>
  <div> </div>
</template>

<script lang="ts" setup>
  import useWarehouseInfoStore from '@/store/modules/warehouse-info';
  import { Ref, ref } from 'vue';
  import {
    queryCategoriesNameList,
    queryWareAdmins,
    queryWareList,
    updateAdmin,
    WareAdmins,
  } from '@/api/dashboard';
  import { isMap } from 'lodash';
  import { ShuttleData } from '@/api/dispatch-center';

  const wareInfo = ref(useWarehouseInfoStore().$state);
  const adminList: Ref<WareAdmins[]> = ref([]);
  const loading = ref(false);

  const props = withDefaults(
    defineProps<{
      idleList: WareAdmins[];
    }>(),
    {
      idleList: undefined,
    }
  );
</script>

<style scoped lang="less">
  .two-side {
    display: flex;
    justify-content: space-between;
  }

  .admin-name {
    margin-left: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 125px;
  }

  .contain-card {
    display: flex;
    flex-wrap: wrap;
    overflow-x: auto;
    max-height: 300px; /* 设置容器的最大高度，超出部分会出现滚动条 */
  }

  .contain-card-item {
    flex: 0 0 calc(25% - 10px); /* 每列占据 25% 的宽度，减去间距的宽度 */
    margin: 5px;
  }
</style>
