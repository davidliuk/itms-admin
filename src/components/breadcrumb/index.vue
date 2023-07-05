<template>
  <a-breadcrumb class="container-breadcrumb">
    <a-breadcrumb-item>
      <icon-apps />
    </a-breadcrumb-item>
    <a-breadcrumb-item v-for="item in items" :key="item">
      {{ $t(item) }}
      <!--  $t(item) 表达式将根据当前的语言环境和翻译配置，
            将item 键名对应的文本翻译为当前语言的对应文本。 -->
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';
  // PropType定义属性类型的辅助类型。
  defineProps({
    items: {
      type: Array as PropType<string[]>,
      default() {
        return [];
      },
    },
  });
</script>

<style scoped lang="less">
  .container-breadcrumb {
    margin: 16px 0;
    :deep(.arco-breadcrumb-item) {
      color: rgb(var(--gray-6));
      &:last-child {
        color: rgb(var(--gray-8));
      }
    }
  }
</style>
