<template>
  <div class="container">
    <!--    <Breadcrumb :items="['menu.profile', 'menu.profile.basic']" />-->
    <a-space direction="vertical" :size="16" fill>
      <a-card class="head-card">
        <a-space v-if="stepAndString.step == 0" class="canceled">
          <icon-close-circle-fill size="25" class="canceledIcon" />
          客户已取消订单
        </a-space>
        <a-space v-if="stepAndString.step > 0" class="steps">
          <a-steps
            :current="stepAndString.step == 7 ? 6 : stepAndString.step"
            label-placement="vertical"
            :status="stepAndString.step == 7 ? 'finish' : 'process'"
          >
            <a-step :description="stepAndString.description[1]">{{
              (stepAndString as StepData).strList[1]
            }}</a-step>
            <a-step :description="stepAndString.description[2]">{{
              (stepAndString as StepData).strList[2]
            }}</a-step>
            <a-step :description="stepAndString.description[3]">{{
              (stepAndString as StepData).strList[3]
            }}</a-step>
            <a-step :description="stepAndString.description[4]">{{
              (stepAndString as StepData).strList[4]
            }}</a-step>
            <a-step :description="stepAndString.description[5]">{{
              (stepAndString as StepData).strList[5]
            }}</a-step>
            <a-step :description="stepAndString.description[6]">{{
              (stepAndString as StepData).strList[6]
            }}</a-step>
          </a-steps>
        </a-space>

        <!-- 以下部分分为： 寄件收件信息、调度单、物流公司信息（验货单）、配送信息（任务单）-->
      </a-card>
      <a-card class="general-card">
        <ProfileItem :loading="loading" :render-data="currentData" />
      </a-card>
      <a-card class="general-card">
        <ProfileItem :loading="preLoading" type="pre" :render-data="preData" />
      </a-card>
      <OperationLog />
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  import useLoading from '@/hooks/loading';
  import { useOrderInfoStore } from '@/store';
  import {
    OrderStateGetStepAndString,
    StepData,
  } from '@/utils/lsp-utils/order_state_to_string';
  import { Pagination } from '@/types/global';
  import { OrderDetail, queryOrderDetail } from '@/api/orderInfo';
  import OperationLog from './components/operation-log.vue';
  import ProfileItem from './components/profile-item.vue';

  const orderStore = useOrderInfoStore();

  const { loading, setLoading } = useLoading(true);
  const { loading: preLoading, setLoading: preSetLoading } = useLoading(true);
  const currentData = orderStore.$state;

  // 这是两个按钮的相关属性绑定
  const backButtonLoading = ref(false); // 返回键的"运行中"状态
  const taskButtonDisabled = ref(false); // 手工调度的"禁用"状态

  let orderDetail: OrderDetail; // 以下是单件详情
  let stepAndString; // 以下是步骤文档
  const fetchOrderDetail = async () => {
    // setLoading(true); // todo:记得搞好
    try {
      const { data } = await queryOrderDetail(currentData.orderNo as string);
      orderDetail = data;
      console.log(orderDetail);
      stepAndString = OrderStateGetStepAndString(orderDetail);
      console.log(stepAndString);
    } catch (err) {
      // you can report use errorHandler or other
      console.log(`ERROR : fetch OrderDetail, err= ${err}`);
    } finally {
      // setLoading(false);
    }
  };
  fetchOrderDetail();

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
</style>
