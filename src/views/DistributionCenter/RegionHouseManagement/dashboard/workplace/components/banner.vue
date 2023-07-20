<template>
  <a-col class="banner">
    <a-row class="two-side">
      <a-col :span="8">
        <a-typography-title
          v-model:editText="inputRes"
          :heading="5"
          style="margin-top: 0"
          editable
          @edit-start="handleEditStart"
          @edit-end="handleEditName"
        >
          {{ wareInfo.name }}
        </a-typography-title>
      </a-col>
      <a-col :span="3">
        <a-button type="outline" :loading="loadingBack" @click="handleBack">
          <template #icon>
            <icon-undo />
          </template>
          返回
        </a-button>
      </a-col>
    </a-row>
    <a-divider class="panel-border" />
  </a-col>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { useWarehouseStore } from '@/store';
  import {
    updateWareHouseInfo,
    getWareHouseInfo,
    WarehouseInfo,
  } from '@/api/dashboard';
  import { ShuttleData } from '@/api/dispatch-center';

  const props = withDefaults(
    defineProps<{
      shuttleData: ShuttleData;
    }>(),
    {
      shuttleData: undefined,
    }
  );

  const shuttleData = ref(props.shuttleData);

  const wareInfo = ref(useWarehouseStore().$state);

  const inputRes = ref('');
  const loadingBack = ref(false);

  const handleEditName = async () => {
    wareInfo.value.name = inputRes.value;
    const { data } = await getWareHouseInfo(wareInfo.value.id as string);
    const tempInfo: WarehouseInfo = data;
    tempInfo.name = inputRes.value;
    await updateWareHouseInfo(tempInfo);
  };

  const handleEditStart = () => {
    inputRes.value = wareInfo.value.name as string;
  };

  const handleBack = () => {
    loadingBack.value = true;
    shuttleData.value.showDetailPage = false;
  };
</script>

<style scoped lang="less">
  .banner {
    width: 100%;
    padding: 20px 20px 0 20px;
    background-color: var(--color-bg-2);
    border-radius: 4px 4px 0 0;
  }

  :deep(.arco-icon-home) {
    margin-right: 6px;
  }

  .two-side {
    display: flex;
    justify-content: space-between;
  }
</style>
