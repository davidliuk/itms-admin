<template>
  <div class="list-wrap">
    <a-modal :visible="isCreatingWare">
      <a-space direction="vertical" size="large">
        <a-cascader
          :options="options"
          :field-names="fieldNames"
          :style="{ width: '480px' }"
          :loading="false"
          placeholder="请选择 ..."
          multiple
          allow-search
          allow-clear
          check-strictly
          @cancel="
            () => {
              isCreatingWare = false;
            }
          "
          @ok="
            () => {
              isCreatingWare = false;
            }
          "
        />
      </a-space>
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
    LSPPage,
    queryRegionList,
    queryWareHouseList,
    ShuttleData,
    WareHouseRecord,
  } from '@/api/dispatch-center';
  import { Pagination } from '@/types/global';
  import { onMounted, reactive, Ref, ref } from 'vue';
  import { Permission, queryPermissionList } from '@/api/acl';
  import { Region } from 'echarts/types/src/coord/geo/Region';
  import { RegionList } from '@/mock/user';
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

  // console.log(renderData.value);

  const isCreatingWare = ref(false);
  const fieldNames = { value: 'id', label: 'name' };
  let options: RegionList[];
  const creatWareHouse = async () => {
    isCreatingWare.value = true;
    const data = await queryRegionList();
    options = reactive(data.data);
    console.log(options);
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
</style>
