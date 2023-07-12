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
      title: '调拨单',
      data: [
        {
          label: '单据ID',
          value: `${(renderData as OrderDetail).transferOrder?.id}`,
        },
        {
          label: '出库时间',
          value: `${(renderData as OrderDetail).transferOrder?.outTime}`,
        },

        {
          label: '入库时间',
          value: `${(renderData as OrderDetail).transferOrder?.inTime}`,
        },
        {
          label: '物流公司ID',
          value: `${(renderData as OrderDetail).transferOrder?.logisticsId}`,
        },
        {
          label: '物流公司名称',
          value: `${(renderData as OrderDetail).transferOrder?.logisticsName}`,
        },
        {
          label: '物流公司电话',
          value: `${(renderData as OrderDetail).transferOrder?.logisticsPhone}`,
        },
        {
          label: '区域中心仓库ID',
          value: `${(renderData as OrderDetail).transferOrder?.wareId}`,
        },
        {
          label: '区域分仓库ID',
          value: `${(renderData as OrderDetail).transferOrder?.stationId}`,
        },
        {
          label: '相关任务单',
          value: `${(renderData as OrderDetail).transferOrder?.workOrderId}`,
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
