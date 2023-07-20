<template>
  <div class="list-wrap">
    <a-modal
      :visible="isCreatingWare"
      :title="'创建中心仓库'"
      @cancel="handleClose"
      @before-ok="handleBeforeOk"
    >
      <a-space>
        <div class="horizontal-container">
          <span class="label">请输入名称：</span>
          <a-input v-model="form.name" :placeholder="'中心仓库名'" />
        </div>
      </a-space>

      <a-space>
        <div class="horizontal-container">
          <span class="label">请输入省份：</span>
          <a-input v-model="form.province" :placeholder="'省'" />
        </div>
      </a-space>

      <a-space>
        <div class="horizontal-container">
          <span class="label">请输入市：</span>
          <a-input v-model="form.city" :placeholder="'市'" />
        </div>
      </a-space>

      <a-space>
        <div class="horizontal-container">
          <span class="label">请输入区：</span>
          <a-input v-model="form.district" :placeholder="'区'" />
        </div>
      </a-space>

      <a-space>
        <div class="horizontal-container">
          <span class="label">请输入详细地址：</span>
          <a-input v-model="form.detailAddress" :placeholder="'详细地址'" />
        </div>
      </a-space>

      <div class="horizontal-container">
        <span class="label">请选择管理员：</span>
        <a-select
          v-model="adminBaseInfoIndex"
          placeholder="请选择管理员"
          :trigger-props="{ autoFitPopupMinWidth: true }"
          :loading="loadingAdmins"
          @change="adminGetChange"
        >
          <a-option
            v-for="(item, index) in idleAdminList"
            :key="index"
            :style="{ width: '250px' }"
            :field-names="fieldNames"
          >
            <a-card
              hoverable
              :style="{ width: '100%', marginBottom: '10px' }"
              :size="'small'"
            >
              <span
                :style="{
                  width: '200px',
                  display: 'flex',
                  alignItems: 'center',
                }"
              >
                <a-avatar :size="36">
                  <img alt="avatar" :src="idleAdminList[index].avatar" />
                </a-avatar>
                <a-typography-text class="admin-name">
                  <a-col>{{ idleAdminList[index].name }}</a-col>
                  <a-col>{{ idleAdminList[index].email }}</a-col>
                </a-typography-text>
              </span>
            </a-card>
          </a-option>
        </a-select>
      </div>
    </a-modal>

    <a-row class="list-row" :gutter="24">
      <a-col
        :xs="12"
        :sm="12"
        :md="12"
        :lg="6"
        :xl="6"
        :xxl="6"
        class="list-col"
      >
        <div class="card-wrap empty-wrap">
          <!--新建仓库-->
          <a-card :bordered="true" hoverable @click="creatWareHouse">
            <a-result :status="null" :title="$t('cardList.content.action')">
              <template #icon>
                <icon-plus style="font-size: 20px" />
              </template>
            </a-result>
          </a-card>
        </div>
      </a-col>
      <a-col
        v-for="item in renderData"
        :key="item.id"
        class="list-col"
        :xs="12"
        :sm="12"
        :md="12"
        :lg="6"
        :xl="6"
        :xxl="6"
      >
        <CardWrap
          :id="item.id"
          v-model:shuttle-data="shuttleData"
          :loading="loadingCard"
          :name="item.name"
          :leader-name="item.adminName"
          :leader-email="item.adminEmail"
          :province="item.province"
          :city="item.city"
          :district="item.district"
          :total="item.totalNumber"
          :use="item.useNumber"
          :show-tag="false"
        >
          <!--骨架屏-->
          <template #skeleton>
            <a-skeleton :animation="true">
              <a-skeleton-line
                :widths="['50%', '50%', '100%', '40%']"
                :rows="4"
              />
              <a-skeleton-line :widths="['40%']" :rows="1" />
            </a-skeleton>
          </template>
        </CardWrap>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import {
    addWareHouse,
    LSPPage,
    PostWareHouse,
    queryRegionIdByKeyword,
    queryRegionList,
    queryWareHouseList,
    ShuttleData,
    WareHouseRecord,
  } from '@/api/dispatch-center';
  import { Pagination } from '@/types/global';
  import { onMounted, reactive, Ref, ref } from 'vue';
  import { Permission, queryPermissionList, Role } from '@/api/acl';
  import { Region } from 'echarts/types/src/coord/geo/Region';
  import { RegionList } from '@/mock/user';
  import { queryWareAdmins, WareAdmins } from '@/api/dashboard';
  import CardWrap from './card-wrap-center.vue';

  const loadingCard = ref(true);
  const queryParam = ref({ current: 1, limit: 10, total: 100 });
  const renderData: Ref<WareHouseRecord[]> = ref([]);

  const props = withDefaults(
    defineProps<{
      shuttleData: ShuttleData;
    }>(),
    {
      shuttleData: undefined,
    }
  );

  const shuttleData = ref(props.shuttleData);
  console.log(shuttleData.value);

  const fetchData = async (pageParam: LSPPage) => {
    loadingCard.value = true;
    try {
      renderData.value = await queryWareHouseList(pageParam);
      console.log(renderData.value);
    } catch (err) {
      // you can report use errorHandler or other
      console.error(err);
    } finally {
      loadingCard.value = false;
    }
  };
  fetchData(queryParam.value);

  const adminBaseInfoIndex = ref();
  const loadingAdmins = ref(false);
  const idleAdminList: Ref<WareAdmins[]> = ref([]);
  const fetchIdleAdminData = async () => {
    // get wareInfo
    try {
      loadingAdmins.value = true;
      const { data } = await queryWareAdmins('0');

      idleAdminList.value = data.map((entity) => ({
        ...entity,
        shouldDelete: false,
      }));

      console.log(idleAdminList.value);
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      loadingAdmins.value = false;
    }
  };

  // console.log(renderData.value);

  const generateFormModel = () => {
    return {
      name: '',
      province: '',
      city: '',
      district: '',
      detailAddress: '',
      adminId: '',
      adminEmail: '',
      adminName: '',
      regionId: '0',
    } as PostWareHouse;
  };

  const isCreatingWare = ref(false);
  const fieldNames = { value: 'id', label: 'name' };
  let options: RegionList[];
  const form = ref(generateFormModel());
  const creatWareHouse = async () => {
    await fetchIdleAdminData();
    form.value = generateFormModel();
    isCreatingWare.value = true;
    const data = await queryRegionList();
    options = reactive(data.data);
    console.log(options);
  };

  const handleClose = () => {
    form.value = generateFormModel();
    isCreatingWare.value = false;
  };

  const handleBeforeOk = async () => {
    const { data } = await queryRegionIdByKeyword(form.value.city);
    form.value.regionId = data[0].id as unknown as string;

    await addWareHouse(form.value);

    isCreatingWare.value = false;
    fetchData(queryParam.value);
  };

  const getIdFromAdminBaseInfo = (nameAndEmail: string) => {
    // 遍历 idleAdminList，查找与 adminBaseInfoIndex 匹配的项并返回其 id
    const index = idleAdminList.value.findIndex((item) => {
      const adminBaseInfo = `${item.name}${item.email}`; // Create adminBaseInfoIndex from item's name and email
      return adminBaseInfo === nameAndEmail;
    });

    return index;
  };

  const adminGetChange = () => {
    const index = getIdFromAdminBaseInfo(adminBaseInfoIndex.value);
    form.value.adminId = idleAdminList.value[index].id as unknown as string;
    form.value.adminName = idleAdminList.value[index].name;
    form.value.adminEmail = idleAdminList.value[index]
      .email as unknown as string;
  };
</script>

<style scoped lang="less">
  .card-wrap {
    height: 100%;
    transition: all 0.3s;
    border: 1px solid var(--color-neutral-3);
    &:hover {
      transform: translateY(-4px);
    }
    :deep(.arco-card-meta-description) {
      color: rgb(var(--gray-6));
      .arco-descriptions-item-label-inline {
        font-weight: normal;
        font-size: 12px;
        color: rgb(var(--gray-6));
      }
      .arco-descriptions-item-value-inline {
        color: rgb(var(--gray-8));
      }
    }
  }
  .empty-wrap {
    height: 100%;
    border-radius: 4px;
    :deep(.arco-card) {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      .arco-result-title {
        color: rgb(var(--gray-6));
      }
    }
  }

  .horizontal-container {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .input,
  .label {
    width: 250px;
  }
</style>
