<template>
  <div class="list-wrap">
    <!--    <a-typography-title class="block-title" :heading="6">-->
    <!--      {{ $t('warehouseList.tab.title.center') }}-->
    <!--    </a-typography-title>-->
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
          <a-card :bordered="true" hoverable>
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
          :loading="loadingCard"
          :name="item.name"
          :leader-name="item.leaderName"
          :leader-email="item.leaderEmail"
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
  import { queryWareHouseList, WareHouseRecord } from '@/api/dispatch-center';
  import { Pagination } from '@/types/global';
  import { Ref, ref } from 'vue';
  import CardWrap from './card-wrap-center.vue';

  const loadingCard = ref(true);
  const queryParam = ref({ current: 1, limit: 10, total: 100 });
  const renderData: Ref<WareHouseRecord[]> = ref([]);

  const fetchData = async (pageParam: Pagination) => {
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
