<template>
  <a-grid :cols="24" :row-gap="16" class="panel">
    <a-grid-item
      class="panel-col"
      :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 6 }"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img
            alt="avatar"
            src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/288b89194e657603ff40db39e8072640.svg~tplv-49unhts6dw-image.image"
          />
        </a-avatar>
        <a-statistic
          :title="$t('stationInfo.missionTotal')"
          :value="statistics.missionTotal"
          :precision="1"
          :value-from="0"
          animation
          show-group-separator
        >
          <template #suffix>
            <span class="unit">{{ $t('stationInfo.pecs') }}</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item
      class="panel-col"
      :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 6 }"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img
            alt="avatar"
            src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/fdc66b07224cdf18843c6076c2587eb5.svg~tplv-49unhts6dw-image.image"
          />
        </a-avatar>
        <a-statistic
          :title="$t('stationInfo.receipts')"
          :value="statistics.receipts"
          :value-from="0"
          animation
          show-group-separator
        >
          <template #suffix>
            <span class="unit">{{ $t('stationInfo.pecs') }}</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item
      class="panel-col"
      :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 6 }"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img
            alt="avatar"
            src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/77d74c9a245adeae1ec7fb5d4539738d.svg~tplv-49unhts6dw-image.image"
          />
        </a-avatar>
        <a-statistic
          :title="$t('stationInfo.couriers')"
          :value="statistics.couriers"
          :value-from="0"
          animation
          show-group-separator
        >
          <template #suffix>
            <span class="unit">人</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item
      class="panel-col"
      :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 6 }"
      style="border-right: none"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img
            alt="avatar"
            src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/c8b36e26d2b9bb5dbf9b74dd6d7345af.svg~tplv-49unhts6dw-image.image"
          />
        </a-avatar>
        <a-statistic
          :title="$t('stationInfo.products')"
          :value="statistics.products"
          :precision="1"
          :value-from="0"
          animation
        >
          <template #suffix>
            <span class="unit">次</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item :span="24">
      <a-divider class="panel-border" />
    </a-grid-item>
  </a-grid>
</template>

<script lang="ts" setup>
  import { computed, reactive } from 'vue';
  import { useUserStore } from '@/store';
  import {
    Courier,
    queryCourierList,
    queryReceiptList,
    queryWorkOrderList,
    Receipt,
    WorkOrder,
  } from '@/api/station';
  import useLoading from '@/hooks/loading';
  import { queryStorageOrderList, StorageOrder } from '@/api/center';

  const { loading, setLoading } = useLoading(true);
  const userStore = useUserStore();
  const statistics = reactive({
    missionTotal: 0,
    couriers: 0,
    products: 0,
    receipts: 0,
  });
  const userInfo = computed(() => {
    return {
      name: userStore.name,
    };
  });
  // const statistics = computed(() => {
  //   return {
  //     missionTotal:queryWorkOrderList(1, 1, {stationId:1}),
  //     couriers:0,
  //     products:0,
  //     receipts:0,
  //   };
  // });

  const fetchDataMission = async (
    current: number,
    pageSize: number,
    params: Partial<WorkOrder>
  ) => {
    setLoading(true);
    try {
      const { data } = await queryWorkOrderList(current, pageSize, params);
      statistics.missionTotal = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  fetchDataMission(1, 1, { stationId: 1 });
  const fetchDataCourier = async (
    current: number,
    pageSize: number,
    params: Partial<Courier>
  ) => {
    setLoading(true);
    try {
      const { data } = await queryCourierList(current, pageSize, params);
      statistics.couriers = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  fetchDataCourier(1, 1, { stationId: 1 });
  const fetchDataStorage = async (
    current: number,
    pageSize: number,
    params: Partial<StorageOrder>
  ) => {
    setLoading(true);
    try {
      const { data } = await queryStorageOrderList(current, pageSize, params);
      statistics.products = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  fetchDataStorage(1, 1, { stationId: 1 });
  const fetchDataReciept = async (
    current: number,
    pageSize: number,
    params: Partial<Receipt>
  ) => {
    setLoading(true);
    try {
      const { data } = await queryReceiptList(current, pageSize, params);
      statistics.receipts = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  fetchDataReciept(1, 1, { stationId: 1 });
</script>

<style lang="less" scoped>
  .arco-grid.panel {
    margin-bottom: 0;
    padding: 16px 20px 0 20px;
  }
  .panel-col {
    padding-left: 43px;
    border-right: 1px solid rgb(var(--gray-2));
  }
  .col-avatar {
    margin-right: 12px;
    background-color: var(--color-fill-2);
  }
  .up-icon {
    color: rgb(var(--red-6));
  }
  .unit {
    margin-left: 8px;
    color: rgb(var(--gray-8));
    font-size: 12px;
  }
  :deep(.panel-border) {
    margin: 4px 0 0 0;
  }
</style>
