<template>
  <a-card
    class="general-card"
    :title="$t('stationInfo.quick.operation')"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{ padding: '24px 20px 0 20px' }"
  >
    <template #extra>
      <a-link>{{ $t('stationInfo.quickOperation.setup') }}</a-link>
    </template>
    <a-row :gutter="8">
      <a-col v-for="link in links" :key="link.text" :span="8" class="wrapper">
        <div class="icon">
          <component :is="link.icon" />
        </div>
        <a-typography-paragraph class="text">
          {{ $t(link.text) }}
        </a-typography-paragraph>
      </a-col>
    </a-row>
    <a-divider class="split-line" style="margin: 0" />
  </a-card>
</template>

<script lang="ts" setup>
  const links = [
    { text: 'stationInfo.contentManagement', icon: 'icon-file' },
    { text: 'stationInfo.contentStatistical', icon: 'icon-storage' },
    { text: 'stationInfo.advanced', icon: 'icon-settings' },
    { text: 'stationInfo.onlinePromotion', icon: 'icon-mobile' },
    { text: 'stationInfo.contentPutIn', icon: 'icon-fire' },
  ];
</script>

<style scoped lang="less"></style>
