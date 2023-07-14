<template>
  <div>
    <a-table
      :loading="loading"
      :columns="tableColumns"
      :data="dataToShow"
      :pagination="false"
      :bordered="false"
      :table-layout-fixed="false"
      class="table-style"
    >
      <template #order_status="{ record }">
        <a-typography-paragraph>
          {{ (record as StationInfo).province }}-{{
            (record as StationInfo).city
          }}-{{ (record as StationInfo).district }}-{{
            (record as StationInfo).detailAddress
          }}
        </a-typography-paragraph>
      </template>
      <!--    <template #columns>-->
      <!--      <a-table-column title="分站ID" data-index="regionId" />-->
      <!--      <a-table-column title="分站名" data-index="name"/>-->
      <!--&lt;!&ndash;      <a-table-column title="分站照片" data-index="storePath"/>&ndash;&gt;-->
      <!--      <a-table-column title="营业状态" data-index="workStatus"/>-->
      <!--      <a-table-column title="地址" data-index="name">-->
      <!--        <template #cell="{ record }">-->
      <!--            {{ (record as StationInfo).province }}-{{ (record as StationInfo).city }}-{{ (record as StationInfo).district }}-{{ (record as StationInfo).detailAddress }}-->
      <!--        </template>-->
      <!--      </a-table-column>-->
      <!--      <a-table-column title="邮编" data-index="postCode" />-->
      <!--      <a-table-column title="电话" data-index="phone" />-->
      <!--      <a-table-column-->
      <!--        title="营业时间"-->
      <!--        data-index="increases"-->
      <!--        :sortable="{-->
      <!--          sortDirections: ['ascend', 'descend'],-->
      <!--        }"-->
      <!--      >-->
      <!--        <template #cell="{ record }">-->
      <!--          <div class="increases-cell">-->
      <!--            <span>{{ (record as StationInfo).workTime }}%</span>-->
      <!--            <icon-caret-up-->
      <!--              v-if="record.increases !== 0"-->
      <!--              style="color: #f53f3f; font-size: 8px"-->
      <!--            />-->
      <!--          </div>-->
      <!--        </template>-->
      <!--      </a-table-column>-->
      <!--    </template>-->
    </a-table>
  </div>
</template>

<script lang="ts" setup>
  import { computed, Ref, ref } from 'vue';
  import { graphic } from 'echarts';
  import useLoading from '@/hooks/loading';
  import {
    queryContentData,
    ContentDataRecord,
    queryStationList,
    StationInfo,
  } from '@/api/dashboard';
  import useChartOption from '@/hooks/chart-option';
  import { ToolTipFormatterParams } from '@/types/echarts';
  import { AnyObject } from '@/types/global';
  import { useWarehouseStore } from '@/store';
  import { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { OrderStateGetString } from '@/utils/lsp-utils/order_state_to_string';

  // 仓库id我要用
  const warehouseStore = useWarehouseStore();
  const loading = ref(true);
  const stationInfo: Ref<StationInfo[]> = ref([]);

  const dataToShow = ref([{}]);
  const tableColumns = computed<TableColumnData[]>(() => [
    {
      title: '分站ID',
      dataIndex: 'regionId',
      slotName: 'regionId',
    },
    {
      title: '分站名',
      dataIndex: 'name',
      slotName: 'name',
    },
    // {
    //   title: '分站照片',
    //   dataIndex: 'storePath',
    // },
    {
      title: '营业状态',
      dataIndex: 'status',
      slotName: 'status',
    },
    {
      title: '地址',
      dataIndex: 'address',
      slotName: 'address',
      // scopedSlots: { customRender: 'address' },
    },
    {
      title: '邮编',
      dataIndex: 'postCode',
    },
    {
      title: '电话',
      dataIndex: 'phone',
    },
    {
      title: '营业时间',
      dataIndex: 'workTime',
      // scopedSlots: { customRender: 'workTime' },
      // sortable: {
      //   sortDirections: ['ascend', 'descend'],
      // },
    },
  ]);

  // 拿到ststion的数据
  const fetchData = async () => {
    loading.value = true;

    try {
      const { data } = await queryStationList(
        warehouseStore.$state.id as string
      );
      console.log(data);
      stationInfo.value = data;
      dataToShow.value = Array(stationInfo.value.length)
        .fill(null)
        .map((_, index) => ({
          key: String(index),
          regionId: (stationInfo.value[index] as StationInfo).regionId,
          name: (stationInfo.value[index] as StationInfo).name,
          address: `${(stationInfo.value[index] as StationInfo).province}-${
            (stationInfo.value[index] as StationInfo).city
          }-${(stationInfo.value[index] as StationInfo).district}-${
            (stationInfo.value[index] as StationInfo).detailAddress
          }`,
          status: (stationInfo.value[index] as StationInfo).workStatus,
          postCode: (stationInfo.value[index] as StationInfo).postCode,
          phone: (stationInfo.value[index] as StationInfo).phone,
          workTime: (stationInfo.value[index] as StationInfo).workTime,
        }));
    } catch (err) {
      // you can report use errorHandler or other
      console.error(`there is error in get stationData: ${err}`);
    } finally {
      loading.value = false;
    }
  };
  fetchData();
</script>

<style scoped lang="less">
  .table-style {
    padding: 20px 20px 0 20px;
  }
</style>

<!--
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: 0 }"
      :body-style="{
        paddingTop: '20px',
      }"
      :title="$t('workplace.contentData')"
    >
      <template #extra>
        <a-link>{{ $t('workplace.viewMore') }}</a-link>
      </template>
      <Chart height="289px" :option="chartOption" />
    </a-card>
  </a-spin>
  -->
