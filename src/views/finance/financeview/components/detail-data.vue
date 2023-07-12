<template xmlns:margin="http://www.w3.org/1999/xhtml">
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      :data="render"
      class="general-card"
      :header-style="{ paddingBottom: '0' }"
      :body-style="{ padding: '17px 20px 21px 20px' }"
    >
      <a-card>
        <template #title>
          {{ $t('stationInfo.detail') }}
        </template>
        <template #extra>
          <a-link>{{ $t('stationInfo.viewMore') }}</a-link>
        </template>
        <a-card :style="{ marginBottom: '20px' }" title="地址信息">
          <template #extra>
            <a-link>More</a-link>
          </template>
          <!--          {{ render.data.province }}-->
          <br />
        </a-card>
        <a-card title="门店信息">
          <template #extra>
            <a-link>More</a-link>
          </template>
          Inner Card Content
        </a-card>
      </a-card>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  // import { ref } from 'vue';
  // import useLoading from '@/hooks/loading';
  // import { queryStationDetail } from '@/api/station';
  // import type { TableData } from '@arco-design/web-vue/es/table/interface';
  //
  // const type = ref('text');
  // const { loading, setLoading } = useLoading();
  // const renderList = ref<TableData[]>();
  // const fetchData = async (contentType: string) => {
  //   try {
  //     setLoading(true);
  //     const { data } = await queryPopularList({ type: contentType });
  //     renderList.value = data;
  //   } catch (err) {
  //     // you can report use errorHandler or other
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // const typeChange = (contentType: string) => {
  //   fetchData(contentType);
  // };
  // fetchData('text');
  import { ref, onMounted } from 'vue';
  import useLoading from '@/hooks/loading';
  import { queryStationDetail, DetailRecord } from '@/api/station';
  // import { queryContentData, ContentDataRecord } from '@/api/station';
  // const type = ref('text');
  const render = ref<DetailRecord[] | null>([]);
  const { loading, setLoading } = useLoading();
  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await queryStationDetail();
      render.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
      console.log(render.value);
    }
  };
  fetchData();

  onMounted(async () => {
    await fetchData(); // 等待数据加载完成

    // 访问 render.value 的值
    console.log(render.value);
  });
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
