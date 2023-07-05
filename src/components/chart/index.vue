<template>
  <VCharts
    v-if="renderChart"
    :option="options"
    :autoresize="autoResize"
    :style="{ width, height }"
  />
</template>

<script lang="ts" setup>
  import { ref, nextTick } from 'vue';
  import VCharts from 'vue-echarts';
  // import { useAppStore } from '@/store';//框架自己注释的

  defineProps({
    options: {
      type: Object,
      default() {
        return {};
      },
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '100%',
    },
  });
  // const appStore = useAppStore();
  // const theme = computed(() => {
  //   if (appStore.theme === 'dark') return 'dark';
  //   return '';
  // });//框架自己注释的
  const renderChart = ref(false);
  // wait container expand
  nextTick(() => {
    renderChart.value = true;
  });
  // 在下一个 DOM 更新周期（nextTick）中，等待容器扩展完成后，
  // 通过回调函数设置 renderChart.value 为 true
  // 目的：是在容器扩展完成后再渲染图表，
  // 以确保图表能够正确地获取到容器的尺寸和位置信息。
</script>

<style scoped lang="less"></style>
