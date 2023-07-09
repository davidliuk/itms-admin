<template>
  <div class="container">
    <!--    <Breadcrumb :items="['menu.profile', 'menu.profile.basic']" />-->
    <a-space direction="vertical" :size="16" fill>
      <a-card class="head-card">
        <!--      <a-card class="general-card" :title="$t('basicProfile.title.form')">-->
        <!--<template #extra>
          <a-space>
            todo:手动调度
            <a-button :disabled="taskButtonDisabled">{{
              $t('basicProfile.task')
            }}</a-button>

            <a-button
              type="primary"
              :loading="backButtonLoading"
              @click="handleBack"
            >
              {{ $t('basicProfile.goBack') }}
            </a-button>
          </a-space>
        </template>-->
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
            <!--            <a-step>{{(stepAndString as StepData).strList[7]}}</a-step>-->

            <!--            <a-step description="客户已收货">{{-->
            <!--              $t('basicProfile.steps.completed')-->
            <!--            }}</a-step>-->
          </a-steps>
        </a-space>
        <!--          <a-space v-if="stepAndString.step == 7" class="completed">-->
        <!--              <icon-check-circle-fill size="25" class="completedIcon" />-->
        <!--              客户已收货-->
        <!--          </a-space>-->
        <a-space v-if="stepAndString.step == 0" class="canceled">
          <icon-close-circle-fill size="25" class="canceledIcon" />
          客户已取消订单
        </a-space>
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
  import { computed, ref } from 'vue';

  import useLoading from '@/hooks/loading';
  import { useOrderInfoStore } from '@/store';
  import {
    OrderStateGetStepAndString,
    StepData,
  } from '@/utils/lsp-utils/order_state_to_string';
  import { Pagination } from '@/types/global';
  import { queryCheckOrder, queryTransferOrder } from '@/api/orderInfo';
  import OperationLog from './components/operation-log.vue';
  import ProfileItem from './components/profile-item.vue';

  const orderStore = useOrderInfoStore();

  const { loading, setLoading } = useLoading(true);
  const { loading: preLoading, setLoading: preSetLoading } = useLoading(true);
  const currentData = orderStore.$state;
  // console.log(currentData);

  // 这是两个按钮的相关属性绑定
  const backButtonLoading = ref(false); // 返回键的"运行中"状态
  const taskButtonDisabled = ref(false); // 手工调度的"禁用"状态

  // 下面是步骤显示器STEP的相关属性
  // console.log(currentData);
  const stepAndString = OrderStateGetStepAndString(currentData);

  // 以下是调拨单、验货单和任务单
  const transferOrder = await queryTransferOrder(currentData.id as string);
  const checkOrder = await queryCheckOrder(currentData.id as string);
  const workOrder = await queryCheckOrder(currentData.id as string);

  // const fetchTransferOrder = async (orderId:string)=> {
  //     // setLoading(true);
  //     try {
  //         const { data } = await queryTransferOrder(currentData.id as string);
  //         transferOrder=data;
  //     } catch (err) {
  //         // you can report use errorHandler or other
  //     } finally {
  //         // setLoading(false);
  //     }
  // };
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

  //.steps {
  //  display: flex;
  //  justify-content: center;
  //  //max-width: 548px;
  //  margin: 0 auto 10px;
  //
  //  > * {
  //    flex: 1;
  //  }
  //}
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
