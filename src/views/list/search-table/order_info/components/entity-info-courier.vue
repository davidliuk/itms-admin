<template>
  <div class="item-container">
    <a-space :size="16" direction="vertical" fill>
      <a-descriptions
        :label-style="{
          textAlign: 'right',
          width: '200px',
          paddingRight: '10px',
          color: 'rgb(var(--gray-8))',
        }"
        :value-style="{ width: '400px' }"
        :title="blockDataList.title"
        :data="blockDataList.data"
        :column="1"
      >
        <template #value="{ value }">
          <a-skeleton v-if="loading" :animation="true">
            <a-skeleton-line :widths="['200px']" :rows="1" />
          </a-skeleton>
          <span v-else>{{ value }}</span>
        </template>
      </a-descriptions>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import { computed, PropType } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { ProfileBasicRes } from '@/api/profile';
  import { OrderDetail } from '@/api/orderInfo';

  type BlockList = {
    title: string;
    data: {
      label: string;
      value: string;
    }[];
  };

  const props = defineProps({
    type: {
      type: String,
      default: '',
    },
    renderData: {
      type: Object,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  });
  const { t } = useI18n();
  const blockDataList = computed<BlockList>(() => {
    const { renderData } = props;
    const result = {
      title:
        props.type === 'pre'
          ? t('basicProfile.title.preVideo')
          : t('basicProfile.title.video'),
      data: [
        {
          label: t('basicProfile.label.video.mode'),
          value: renderData?.video?.mode || '-',
        },
        {
          label: t('basicProfile.label.video.acquisition.resolution'),
          value: renderData?.video?.acquisition.resolution || '-',
        },
        {
          label: t('basicProfile.label.video.acquisition.frameRate'),
          value: `${renderData?.video?.acquisition.frameRate || '-'} fps`,
        },
      ],
    };
    return result;
  });
</script>

<style scoped lang="less">
  .item-container {
    padding-top: 20px;
    :deep(.arco-descriptions-item-label) {
      font-weight: normal;
    }
  }
</style>
