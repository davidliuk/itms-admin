<template>
  <div class="container">
    <!--    <Breadcrumb :items="['menu.profile', 'menu.profile.basic']" />-->
    <a-space direction="vertical" :size="16" fill>
      <a-card class="head-card">
        <a-space v-if="stepAndString.step == -2" class="progressOnLoading">
          <a-skeleton :animation="true" :loading="true">
            <a-row class="progressOnLoading" justify="space-between">
              <a-skeleton-shape shape="circle" size="small" />
              <a-skeleton-line :widths="['100px']" :rows="1" :line-height="2" />
              <a-skeleton-shape shape="circle" size="small" />
              <a-skeleton-line :widths="['100px']" :rows="1" :line-height="2" />
              <a-skeleton-shape shape="circle" size="small" />
              <a-skeleton-line :widths="['100px']" :rows="1" :line-height="2" />
              <a-skeleton-shape shape="circle" size="small" />
              <a-skeleton-line :widths="['100px']" :rows="1" :line-height="2" />
              <a-skeleton-shape shape="circle" size="small" />
              <a-skeleton-line :widths="['100px']" :rows="1" :line-height="2" />
              <a-skeleton-shape shape="circle" size="small" />
            </a-row>
          </a-skeleton>
        </a-space>
        <a-space v-if="stepAndString.step == 0" class="canceled">
          <icon-close-circle-fill size="25" class="canceledIcon" />
          客户已取消订单
        </a-space>
        <a-space v-if="stepAndString.step == -1" class="refund">
          <icon-info-circle-fill size="25" class="refundIcon" />
          客户已退货
        </a-space>
        <a-space v-if="stepAndString.step > 0" class="steps">
          <a-steps
            :current="stepAndString.step == 7 ? 6 : stepAndString.step"
            label-placement="vertical"
            :status="stepAndString.step == 7 ? 'finish' : 'process'"
          >
            <a-step v-for="index in 6" :key="index">
              {{ (stepAndString as StepData).strList[index] }}
              <template #description>
                <a-space align="center" direction="vertical" size="mini">
                  <a-row>{{
                    (stepAndString as StepData).description[index]
                  }}</a-row>
                  <a-row>
                    <a-popover>
                      <a-button type="text">{{
                        (stepAndString as StepData).descriptionB[index]
                      }}</a-button>
                      <template #content>
                        <a-row
                          v-for="dataToShow in (stepAndString as StepData).popupStr[index]"
                          :key="dataToShow"
                        >
                          {{ dataToShow.label }}:
                          {{ dataToShow.val }}
                        </a-row>
                      </template>
                    </a-popover>
                  </a-row>
                </a-space>
              </template>
            </a-step>
          </a-steps>
        </a-space>
      </a-card>

      <!-- 以下部分分为： 调度单、配送信息（任务单）-->
      <a-space>
        <a-card class="general-card">
          <TransferOrderInfo :loading="loading" :render-data="orderDetail" />
        </a-card>
      </a-space>

      <a-space>
        <a-card class="general-card">
          <WorkOrderInfo :loading="loading" :render-data="orderDetail" />
        </a-card>
      </a-space>

      <SkuList :loading="loading" :render-data="orderDetail" />
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, Ref, ref } from 'vue';

  import useLoading from '@/hooks/loading';
  import { useOrderInfoStore } from '@/store';
  import {
    OrderStateGetStepAndString,
    StepData,
  } from '@/utils/lsp-utils/order_state_to_string';
  import { Pagination } from '@/types/global';
  import { OrderDetail, queryOrderDetail } from '@/api/orderInfo';
  import TransferOrderInfo from '@/views/list/search-table/order_info/components/transfer-order-info.vue';
  import WorkOrderInfo from '@/views/list/search-table/order_info/components/work-order-info.vue';
  import SkuList from '@/views/list/search-table/order_info/components/sku-list.vue';

  const orderStore = useOrderInfoStore();

  const { loading, setLoading } = useLoading(true);
  const { loading: preLoading, setLoading: preSetLoading } = useLoading(true);
  const currentData = orderStore.$state;

  // 这是两个按钮的相关属性绑定
  const backButtonLoading = ref(false); // 返回键的"运行中"状态
  const taskButtonDisabled = ref(false); // 手工调度的"禁用"状态

  const orderDetail = ref({}); // 以下是单件详情
  const stepAndString = ref({ step: -2, description: [''], strList: [''] });
  // let stepAndString: Ref<StepData>; // 以下是步骤文档
  const fetchOrderDetail = async (orderId: string) => {
    setLoading(true); // todo:记得搞好加载页面
    try {
      const { data } = await queryOrderDetail(orderId);
      orderDetail.value = data;
      // console.log(orderDetail);
      stepAndString.value = reactive(
        OrderStateGetStepAndString(orderDetail.value)
      );
      console.log(stepAndString.value);
    } catch (err) {
      // you can report use errorHandler or other
      console.log(`ERROR : fetch OrderDetail, err= ${err}`);
    } finally {
      setLoading(false);
    }
  };
  fetchOrderDetail(currentData.orderNo as string);
</script>

<script lang="ts">
  export default {
    name: 'Basic',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }

  .refund,
  .completed,
  .canceled,
  .steps {
    display: flex;
    justify-content: center;
    align-items: center;
    //height: 100vh; /* 假设需要居中整个屏幕高度，可以根据实际情况调整 */
  }

  .canceledIcon {
    color: orangered;
  }

  .refundIcon {
    color: cornflowerblue;
  }

  .completedIcon {
    color: limegreen;
  }

  .head-card {
    border-radius: 4px;
    border: none;
    & > .arco-card-header {
      height: auto;
      padding: 20px;
      border: none;
    }
    & > .arco-card-body {
      padding: 0 20px 20px 20px;
    }
  }

  .progressOnLoading {
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
  }
</style>
