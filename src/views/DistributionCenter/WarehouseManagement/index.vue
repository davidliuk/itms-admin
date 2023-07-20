<template>
  <div v-if="shuttleData.showDetailPage">
    <WorkPlace v-model:shuttle-data="shuttleData" />
  </div>
  <div v-else class="container">
    <Breadcrumb
      :items="[
        'menu.DistributionCenter',
        'menu.DistributionCenter.WarehouseManagement',
      ]"
    />
    <a-row :gutter="20" align="stretch">
      <a-col :span="24">
        <a-card class="general-card" :title="$t('menu.list.warehouseList')">
          <a-row justify="space-between">
            <!--            <a-row>-->
            <!--              <a-input-search-->
            <!--                :placeholder="$t('cardList.searchInput.placeholder')"-->
            <!--                style="width: 240px; position: absolute; top: 60px; right: 20px"-->
            <!--              />-->
            <!--            </a-row>-->
          </a-row>
          <a-row>
            <a-col :span="24">
              <DispatchCenterCard v-model:shuttle-data="shuttleData" />
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import DispatchCenterCard from '@/views/DistributionCenter/WarehouseManagement/components/dispatch-center-card.vue';
  import DispatchRegionCard from '@/views/DistributionCenter/WarehouseManagement/components/dispatch-region-card.vue';
  import { Ref, ref } from 'vue';
  import { ShuttleData } from '@/api/dispatch-center';
  import WorkPlace from './dashboard/workplace/index.vue';

  const shuttleData: Ref<ShuttleData> = ref({
    showDetailPage: false,
  });
</script>

<script lang="ts">
  export default {
    name: 'Card',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
    :deep(.arco-list-content) {
      overflow-x: hidden;
    }

    :deep(.arco-card-meta-title) {
      font-size: 14px;
    }
  }
  :deep(.arco-list-col) {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  :deep(.arco-list-item) {
    width: 33%;
  }

  :deep(.block-title) {
    margin: 0 0 12px 0;
    font-size: 14px;
  }
  :deep(.list-wrap) {
    // min-height: 140px;
    .list-row {
      align-items: stretch;
      .list-col {
        margin-bottom: 16px;
      }
    }
    :deep(.arco-space) {
      width: 100%;
      .arco-space-item {
        &:last-child {
          flex: 1;
        }
      }
    }
  }
</style>
