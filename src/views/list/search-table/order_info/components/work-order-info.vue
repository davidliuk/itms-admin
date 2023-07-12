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
      title: '任务单',
      data: [
        {
          label: '单据ID',
          value: `${(renderData as OrderDetail).workOrder?.id}`,
        },
        {
          label: '收件人',
          value: `${(renderData as OrderDetail).workOrder?.name}`,
        },
        {
          label: '收件人电话',
          value: `${(renderData as OrderDetail).workOrder?.phone}`,
        },

        {
          label: '省市地址',
          value: `${(renderData as OrderDetail).workOrder?.province} ${
            (renderData as OrderDetail).workOrder?.city
          } ${(renderData as OrderDetail).workOrder?.district}`,
        },
        {
          label: '详细地址',
          value: `${(renderData as OrderDetail).workOrder?.detailAddress}`,
        },
        {
          label: '邮编',
          value: `${(renderData as OrderDetail).workOrder?.postCode}`,
        },

        {
          label: '物流公司ID',
          value: `${(renderData as OrderDetail).workOrder?.logisticsId}`,
        },
        {
          label: '物流公司名称',
          value: `${(renderData as OrderDetail).workOrder?.logisticsName}`,
        },
        {
          label: '物流公司电话',
          value: `${(renderData as OrderDetail).workOrder?.logisticsPhone}`,
        },

        {
          label: '区域中心仓库',
          value: `${(renderData as OrderDetail).workOrder?.wareId}`,
        },
        {
          label: '区域分仓库',
          value: `${(renderData as OrderDetail).workOrder?.stationId}(${
            (renderData as OrderDetail).workOrder?.stationName
          })`,
        },
        {
          label: '配送员',
          value: `${(renderData as OrderDetail).workOrder?.courierId}`,
        },

        {
          label: '客户满意度',
          value: `${(renderData as OrderDetail).workOrder?.mark}`,
        },
        {
          label: '客户反馈',
          value: `${(renderData as OrderDetail).workOrder?.feedback}`,
        },
        {
          label: '备注',
          value: `${(renderData as OrderDetail).workOrder?.mark}`,
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
