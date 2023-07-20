<template>
  <a-col class="banner">
    <a-row class="two-side">
      <a-col :span="18">
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
      <a-col :span="3">
        <a-button
          status="danger"
          :type="isChecking ? 'outline' : 'text'"
          @click="handleDelete"
        >
          <template #icon>
            <div v-if="!isChecking"><icon-delete /></div>
            <div v-else><icon-check /></div>
          </template>
          <div v-if="!isChecking">删除</div>
          <div v-else>确认删除</div>
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
    deleteWareHouse,
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

  const isChecking = ref(false);

  const handleIfDelete = () => {
    isChecking.value = true;
  };

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

  const handleDelete = async () => {
    if (isChecking.value) {
      isChecking.value = false;
      await deleteWareHouse(wareInfo.value.id as string);
      handleBack();
    } else {
      isChecking.value = true;
    }
  };
</script>

<style scoped lang="less">
  .banner {
    width: 100%;
    padding: 20px 20px 0 20px;
    background-color: var(--color-bg-2);
    border-radius: 4px 4px 0 0;
  }

  .input,
  .label {
    width: 250px;
  }
  :deep(.arco-icon-home) {
    margin-right: 6px;
  }

  .two-side {
    display: flex;
    justify-content: space-between;
  }
</style>
