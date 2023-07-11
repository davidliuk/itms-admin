<template>
  <div class="container">
    <Breadcrumb :items="['menu.profile', 'menu.profile.basic']" />
    <a-space direction="vertical" :size="16" fill>
      <a-card class="general-card" :title="$t('basicProfile.title.form')">
        <template #extra>
          <a-space>
            <!-- todo:手动调度-->
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
        </template>
        <a-space v-if="step > 0 && step < 5">
          <a-steps :current="step" class="steps" label-placement="vertical">
            <a-step description="用户正在付款">{{
              $t('basicProfile.steps.waitingToPay')
            }}</a-step>
            <a-step description="中心库房正在发货">{{
              $t('basicProfile.steps.waitingToStart')
            }}</a-step>
            <a-step description="货物已到分库房">{{
              $t('basicProfile.steps.started')
            }}</a-step>
            <a-step description="客户待收货">{{
              $t('basicProfile.steps.waitingToReceive')
            }}</a-step>
            <!--            <a-step description="客户已收货">{{-->
            <!--              $t('basicProfile.steps.completed')-->
            <!--            }}</a-step>-->
          </a-steps>
        </a-space>
        <a-space v-if="step == 5" class="completed">
          <icon-check-circle-fill size="25" class="completedIcon" />
          客户已收货
        </a-space>
        <a-space v-if="step == 0" class="canceled">
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
  import { ref, computed } from 'vue';
  import { queryProfileBasic, ProfileBasicRes } from '@/api/profile';

  import useLoading from '@/hooks/loading';
  import router from '@/router/index'; // 注意:创建route的时候,要使用文件收集法,否则会出现循环import问题
  import { useOrderInfoStore } from '@/store';
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
  const handleBack = () => {
    backButtonLoading.value = true;
    taskButtonDisabled.value = true;
  };

  // 下面是步骤显示器STEP的相关属性
  // console.log(typeof currentData.order_status);
  const step = computed(() => {
    if (typeof currentData.orderStatus === 'string') {
      const orderStatus = Number(currentData.orderStatus);
      return orderStatus + 1;
    }
    if (typeof currentData.order_status === 'number') {
      return currentData.order_status + 1;
    }
    throw new Error('Invalid step');
  });
  // console.log(`step= ${step.value}`);
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

  .steps {
    display: flex;
    justify-content: center;
    //max-width: 548px;
    margin: 0 auto 10px;

    > * {
      flex: 1;
    }
  }
  .completed,
  .canceled {
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
</style>
