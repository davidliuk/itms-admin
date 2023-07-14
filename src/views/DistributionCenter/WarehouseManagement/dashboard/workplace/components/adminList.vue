<template>
  <a-card
    class="general-card"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{ padding: '24px 20px 0 20px' }"
  >
    <template #title>
            管理员列表
      <a-avatar-group :max-count="3">
        <!--        <a-avatar-->
        <!--          v-for="item in adminList.length"-->
        <!--          :key="item"-->
        <!--          :style="{ backgroundColor: colors[item] }"-->
        <!--          >&ndash;&gt;-->
        <!--          {{ adminList[item].name[0] }}-->
        <!--        </a-avatar>-->
        <a-avatar v-for="item in adminList" :key="item">
          <img alt="avatar" :src="item.avatar" />
        </a-avatar>
        <!--        <div v-for="item in adminList.length" :key="item">-->
        <!--          <a-avatar v-if="adminList[item].avatar===undefined" :style="{ backgroundColor: colors[item] }">-->
        <!--            {{adminList[item].name[0]}}-->
        <!--          </a-avatar>-->
        <!--          <a-avatar v-else>-->
        <!--            <img-->
        <!--              alt="avatar"-->
        <!--              :src=adminList[item].avatar-->
        <!--            />-->
        <!--          </a-avatar>-->
        <!--        </div>-->
      </a-avatar-group>
    </template>
    <template #extra>
      <a-link>{{ $t('workplace.quickOperation.setup') }}</a-link>
    </template>
    <a-row :gutter="8">
      <a-col v-for="link in links" :key="link.text" :span="8" class="wrapper">
        <div class="icon">
          <component :is="link.icon" />
        </div>
        <a-typography-paragraph class="text">
          {{ $t(link.text) }}
        </a-typography-paragraph>
      </a-col>
    </a-row>
    <a-divider class="split-line" style="margin: 0" />
  </a-card>
</template>

<script lang="ts" setup>
  import useWarehouseInfoStore from '@/store/modules/warehouse-info';
  import { Ref, ref } from 'vue';
  import {
    queryCategoriesNameList,
    queryWareAdmins,
    queryWareList,
    WareAdmins,
  } from '@/api/dashboard';

  const links = [
    { text: 'workplace.contentManagement', icon: 'icon-file' },
    { text: 'workplace.contentStatistical', icon: 'icon-storage' },
    { text: 'workplace.advanced', icon: 'icon-settings' },
    { text: 'workplace.onlinePromotion', icon: 'icon-mobile' },
    { text: 'workplace.contentPutIn', icon: 'icon-fire' },
  ];

  const wareInfo = ref(useWarehouseInfoStore().$state);
  const adminList: Ref<WareAdmins[]> = ref([]);
  const loading = ref(false);
  const colors = ref(['#7BC616', '#14C9C9', '#168CFF', '#FF7D00', '#FFC72E']);

  const fetchData = async (wareId: string) => {
    // get wareInfo
    try {
      loading.value = true;
      const { data } = await queryWareAdmins(wareId);
      adminList.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      loading.value = false;
    }
    fetchData(wareInfo.value.id as string);
  };
</script>

<style scoped lang="less"></style>
