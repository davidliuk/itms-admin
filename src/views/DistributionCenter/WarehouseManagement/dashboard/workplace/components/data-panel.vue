<template>
  <a-grid :cols="24" :row-gap="16" class="panel">
    <a-grid-item
      class="panel-col"
      :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 6 }"
    >
      <a-space>
        <a-avatar
          :size="64"
          style="display: flex; justify-content: center; align-items: center"
        >
          <img
            alt="avatar"
            src="./svg-img/logo.svg"
            style="transform: scale(0.75)"
          />
        </a-avatar>
        <a-statistic
          title="商品总量"
          :value="3.5"
          :precision="1"
          :value-from="0"
          animation
          show-group-separator
        >
          <template #suffix> W <span class="unit">件</span> </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item
      class="panel-col"
      :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 6 }"
    >
      <a-space>
        <a-avatar
          :size="64"
          style="display: flex; justify-content: center; align-items: center"
        >
          <img alt="avatar" src="./svg-img/toAdd.svg" />
        </a-avatar>
        <a-statistic
          title="待补商品"
          :value="368"
          :value-from="0"
          animation
          show-group-separator
        >
          <template #suffix>
            <span class="unit">件</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item
      class="panel-col"
      :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 6 }"
    >
      <a-space>
        <a-avatar
          :size="64"
          style="display: flex; justify-content: center; align-items: center"
        >
          <img
            alt="avatar"
            src="./svg-img/import.svg"
            style="transform: scale(0.6)"
          />
        </a-avatar>
        <a-statistic
          title="今日进货量"
          :value="8874"
          :value-from="0"
          animation
          show-group-separator
        >
          <template #suffix>
            <span class="unit">件</span>
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
        <a-avatar
          :size="64"
          style="display: flex; justify-content: center; align-items: center"
        >
          <img
            alt="avatar"
            src="./svg-img/export.svg"
            style="transform: scaleX(-1) scale(0.7)"
          />
        </a-avatar>
        <a-statistic title="今日出库量" :value="2800" :value-from="0" animation>
          <!--          <template #suffix> 件 <icon-caret-up class="up-icon" /> </template>-->
          <template #suffix>
            <span class="unit">件</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item :span="24">
      <a-divider class="panel-border" />
    </a-grid-item>
  </a-grid>
</template>

<script lang="ts" setup></script>

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
