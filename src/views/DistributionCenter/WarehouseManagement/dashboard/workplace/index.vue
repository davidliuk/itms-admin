<template>
  <div class="container">
    <div class="left-side panel">
      <Banner v-model:shuttle-data="shuttleData" />
      <DataPanel />
      <!--todo: 这个等数据分析的时候在后端拿数据-->
      <StationList />
    </div>
    <div class="right-side">
      <AdminList />
    </div>
  </div>
  <div class="container">
    <a-grid :cols="24" :col-gap="16" :row-gap="16" style="margin-top: 16px">
      <a-grid-item :span="{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }">
        <PopularContent />
      </a-grid-item>
      <a-grid-item :span="{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }">
        <CategoriesPercent />
      </a-grid-item>
    </a-grid>
  </div>
</template>

<script lang="ts" setup>
  import { ShuttleData } from '@/api/dispatch-center';
  import { ref } from 'vue';
  import Banner from './components/banner.vue';
  import DataPanel from './components/data-panel.vue';
  import StationList from './components/stationList.vue';
  import PopularContent from './components/popular-content.vue';
  import CategoriesPercent from './components/categories-percent.vue';
  import AdminList from './components/adminList.vue';

  const props = withDefaults(
    defineProps<{
      shuttleData: ShuttleData;
    }>(),
    {
      shuttleData: undefined,
    }
  );

  const shuttleData = ref(props.shuttleData);
</script>

<script lang="ts">
  export default {
    name: 'Dashboard', // If you want the include property of keep-alive to take effect, you must name the component
  };
</script>

<style lang="less" scoped>
  .container {
    background-color: var(--color-fill-2);
    padding: 16px 20px;
    padding-bottom: 0;
    display: flex;
    align-items: stretch;
  }

  .left-side {
    flex: 1;
    overflow: auto;
    height: 100%;
  }

  .right-side {
    width: 280px;
    margin-left: 16px;
  }

  .horizontal-container {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  .panel {
    background-color: var(--color-bg-2);
    border-radius: 4px;
    overflow: auto;
  }
  :deep(.panel-border) {
    margin-bottom: 0;
    border-bottom: 1px solid rgb(var(--gray-2));
  }
  .moduler-wrap {
    border-radius: 4px;
    background-color: var(--color-bg-2);
    :deep(.text) {
      font-size: 12px;
      text-align: center;
      color: rgb(var(--gray-8));
    }

    :deep(.wrapper) {
      margin-bottom: 8px;
      text-align: center;
      cursor: pointer;

      &:last-child {
        .text {
          margin-bottom: 0;
        }
      }
      &:hover {
        .icon {
          color: rgb(var(--arcoblue-6));
          background-color: #e8f3ff;
        }
        .text {
          color: rgb(var(--arcoblue-6));
        }
      }
    }

    :deep(.icon) {
      display: inline-block;
      width: 32px;
      height: 32px;
      margin-bottom: 4px;
      color: rgb(var(--dark-gray-1));
      line-height: 32px;
      font-size: 16px;
      text-align: center;
      background-color: rgb(var(--gray-1));
      border-radius: 4px;
    }
  }
</style>

<style lang="less" scoped>
  // responsive
  .mobile {
    .container {
      display: block;
    }
    .right-side {
      // display: none;
      width: 100%;
      margin-left: 0;
      margin-top: 16px;
    }
  }
</style>

<!--
    <div class="right-side">
      <a-grid :cols="24" :row-gap="16">
        <a-grid-item :span="24">
          <div class="panel moduler-wrap">
            <QuickOperation />
            <RecentlyVisited />
          </div>
        </a-grid-item>
        <a-grid-item class="panel" :span="24">
          <Carousel />
        </a-grid-item>
        <a-grid-item class="panel" :span="24">
          <Announcement />
        </a-grid-item>
        <a-grid-item class="panel" :span="24">
          <Docs />
        </a-grid-item>
      </a-grid>
    </div>
-->
