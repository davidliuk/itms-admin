<template>
  <a-spin style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '0' }"
      :body-style="{ padding: '17px 20px 21px 20px' }"
    >
      <template #title> 商品列表 </template>
      <!--      <template #extra>-->
      <!--        <a-link>{{ $t('workplace.viewMore') }}</a-link>-->
      <!--      </template>-->
      <a-space direction="vertical" :size="10" fill>
        <a-select
          v-model="type"
          :style="{ width: '320px' }"
          placeholder="选择类别"
          @change="typeChange"
        >
          <a-option v-for="category in categoriesAllName" :key="category">
            {{ category }}
          </a-option>
        </a-select>
        <a-table
          :loading="loading"
          :data="renderList"
          :pagination="false"
          :bordered="true"
          :scroll="{ x: '100%', y: '264px' }"
        >
          <template #columns>
            <a-table-column title="名称" data-index="skuName" />
            <a-table-column title="类别" data-index="skuInfo.categoryName">
            </a-table-column>
            <a-table-column
              title="销量"
              data-index="sale"
              :sortable="{
                sortDirections: ['ascend', 'descend'],
              }"
            />
            <a-table-column
              title="现库存"
              data-index="stock"
              :sortable="{
                sortDirections: ['ascend', 'descend'],
              }"
            />
            <a-table-column title="最大库存" data-index="maxStock">
            </a-table-column>
          </template>
        </a-table>
      </a-space>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { computed, Ref, ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import useWarehouseInfoStore from '@/store/modules/warehouse-info';
  import {
    CategoriesMap,
    queryCategoriesNameList,
    queryStationList,
    queryWareList,
    StationInfo,
    WareInfo,
  } from '@/api/dashboard';
  import type { TableData } from '@arco-design/web-vue/es/table/interface';
  import { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import Category from '@/views/product/category/index.vue';

  const type = ref('全部');
  const { loading, setLoading } = useLoading();

  const baseData: Ref<WareInfo[]> = ref([]);
  const renderList = ref([{}]);

  const getRenderList = () => {
    const tempData: Ref<WareInfo[]> = ref([]);
    for (let i = 0; i < baseData.value.length; i += 1) {
      if (
        type.value === '全部' ||
        (baseData.value[i].skuInfo.categoryName as unknown as string) ===
          (type.value as unknown as string)
      ) {
        tempData.value.push(baseData.value[i]);
      }
    }

    renderList.value = Array(tempData.value.length)
      .fill(null)
      .map((_, index) => ({
        key: String(index),
        skuName: tempData.value[index].skuName,
        skuInfo: tempData.value[index].skuInfo,
        stock: tempData.value[index].stock,
        maxStock: tempData.value[index].maxStock,
        sale: tempData.value[index].sale,
      }));

    console.log(renderList.value);
  };

  const baseCategoriesMap: Ref<CategoriesMap[]> = ref([]);

  const setCategoryName = () => {
    return baseData.value.map((data) => {
      const category = baseCategoriesMap.value.find(
        (item) => item.id === data.skuInfo.categoryId
      );
      if (category) {
        data.skuInfo.categoryName = category.name;
      }
      return data;
    });
  };
  const fetchData = async (wareId: string) => {
    // get wareInfo
    try {
      setLoading(true);
      const { data } = await queryWareList(wareId);
      baseData.value = data;

      // console.log(renderList.value);
      getRenderList();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }

    // get cateories id-name map
    try {
      setLoading(true);
      const { data } = await queryCategoriesNameList();
      baseCategoriesMap.value = data;
      // console.log(renderList.value);
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }

    baseData.value = setCategoryName();
  };

  const categoriesAllName: Ref<string[]> = computed(() => {
    const tempRes = ['全部'];
    if (baseData.value === undefined) return tempRes;
    tempRes.push(
      ...[...new Set(baseData.value.map((obj) => obj.skuInfo.categoryName))]
    );
    return tempRes;
  });
  const typeChange = () => {
    console.log(type.value);
    getRenderList();
  };
  fetchData(useWarehouseInfoStore().$state.id as string);
</script>

<style scoped lang="less">
  .general-card {
    min-height: 395px;
  }
  :deep(.arco-table-tr) {
    height: 44px;
    .arco-typography {
      margin-bottom: 0;
    }
  }
  .increases-cell {
    display: flex;
    align-items: center;
    span {
      margin-right: 4px;
    }
  }
</style>
