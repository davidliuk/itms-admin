<template>
  <a-card class="general-card">
    <template #title>订单商品列表</template>
    <a-spin :loading="loading" style="width: 100%">
      <a-table :data="renderData.orderItemList as unknown as TableData[]">
        <template #columns>
          <a-table-column title="编号" data-index="skuId" />
          <a-table-column title="名称" data-index="skuName" />
          <a-table-column title="分类" data-index="skuType">
            <template #cell="{ record }">
              <div v-if="record.skuType === 'COMMON'">
                <span class="circle"></span>
                <span>普通</span>
              </div>
              <div v-else-if="record.skuType === 'SECKILL'">
                <span class="circle pass"></span>
                <span>秒杀商品</span>
              </div>
              <div v-else>
                <span>其他分类</span>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="数量" data-index="skuNum" />

          <a-table-column title="价格" data-index="skuPrice" />

          <a-table-column title="操作">
            <template #cell>
              <a-button type="text">{{
                $t('basicProfile.cell.view')
              }}</a-button>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-spin>
  </a-card>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { queryOperationLog, operationLogRes } from '@/api/profile';
  import useLoading from '@/hooks/loading';
  import { OrderDetail } from '@/api/orderInfo';
  import { SkuList } from '@/api/orderDetailSkuList';
  import { TableData } from '@arco-design/web-vue/es/table/interface';

  const props = defineProps({
    renderData: {
      type: Object as () => OrderDetail,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  });

  const renderData = ref(props.renderData as OrderDetail);
  console.log(renderData.value);
</script>

<style scoped lang="less">
  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }
</style>
