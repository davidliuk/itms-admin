<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '0' }"
      :body-style="{
        padding: '20px',
      }"
    >
      <template #title> 商品分类销量统计 </template>
      <Chart height="310px" :option="chartOption" />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import useLoading from '@/hooks/loading';
  import useChartOption from '@/hooks/chart-option';
  import { computed, Ref, ref } from 'vue';
  import {
    CategoriesMap,
    queryCategoriesNameList,
    queryWareList,
    WareInfo,
  } from '@/api/dashboard';
  import useWarehouseInfoStore from '@/store/modules/warehouse-info';

  const loading = ref(false);
  const baseData: Ref<WareInfo[]> = ref([]);
  const renderList = ref([{}]);
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
      loading.value = true;

      const { data } = await queryWareList(wareId);
      baseData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
      console.error(`error in fetch wareInfo: ${err}`);
    } finally {
      loading.value = false;
    }

    // get cateories id-name map
    try {
      loading.value = true;
      // loading.value=false;

      const { data } = await queryCategoriesNameList();
      baseCategoriesMap.value = data;
      // console.log(renderList.value);
    } catch (err) {
      // you can report use errorHandler or other
      console.error(`error in fetch catrgoryList: ${err}`);
    } finally {
      loading.value = false;
    }

    baseData.value = setCategoryName();
  };
  fetchData(useWarehouseInfoStore().$state.id as string);

  const chartData: Ref<{ categoryName: string; totalStock: number }[]> =
    computed(() => {
      const tempRes: { categoryName: string; totalStock: number }[] = [];
      if (baseData.value === undefined) return tempRes;

      baseData.value.forEach((obj: WareInfo) => {
        const existingCategory = tempRes.find(
          (item) => item.categoryName === obj.skuInfo.categoryName
        );
        if (existingCategory) {
          existingCategory.totalStock += obj.stock;
        } else {
          tempRes.push({
            categoryName: obj.skuInfo.categoryName,
            totalStock: obj.stock,
          });
        }
      });

      return tempRes;
    });

  //-----------------------------------

  const { chartOption } = useChartOption((isDark) => {
    console.log(chartData.value.map((item) => item.categoryName));
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      // legend: {
      //   orient: 'vertical',
      //   left: 'right',
      //   data: chartData.value.map((item) => item.categoryName),
      // },
      graphic: {
        elements: [
          {
            type: 'text',
            left: 'center',
            top: '40%',
            style: {
              text: '销售总量',
              textAlign: 'center',
              fill: isDark ? '#ffffffb3' : '#4E5969',
              fontSize: 14,
            },
          },
          {
            type: 'text',
            left: 'center',
            top: '50%',
            style: {
              text: baseData.value.reduce((sum, item) => sum + item.stock, 0),
              textAlign: 'center',
              fill: isDark ? '#ffffffb3' : '#1D2129',
              fontSize: 16,
              fontWeight: 500,
            },
          },
        ],
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['50%', '50%'],
          data: chartData.value.map((item) => ({
            name: item.categoryName,
            value: item.totalStock,
          })),
          labelLine: {
            show: true,
          },
        },
      ],
    };
  });

</script>

<style scoped lang="less"></style>

<!--
const { chartOption } = useChartOption((isDark) => {
    // echarts support https://echarts.apache.org/zh/theme-builder.html
    // It's not used here
    return {
      legend: {
        left: 'center',
        data: ['纯文本', '图文类', '视频类'],
        bottom: 0,
        icon: 'circle',
        itemWidth: 8,
        textStyle: {
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969',
        },
        itemStyle: {
          borderWidth: 0,
        },
      },
      tooltip: {
        show: true,
        trigger: 'item',
      },
      graphic: {
        elements: [
          {
            type: 'text',
            left: 'center',
            top: '40%',
            style: {
              text: '内容量',
              textAlign: 'center',
              fill: isDark ? '#ffffffb3' : '#4E5969',
              fontSize: 14,
            },
          },
          {
            type: 'text',
            left: 'center',
            top: '50%',
            style: {
              text: '928,531',
              textAlign: 'center',
              fill: isDark ? '#ffffffb3' : '#1D2129',
              fontSize: 16,
              fontWeight: 500,
            },
          },
        ],
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['50%', '50%'],
          label: {
            formatter: '{d}%',
            fontSize: 14,
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969',
          },
          itemStyle: {
            borderColor: isDark ? '#232324' : '#fff',
            borderWidth: 1,
          },
          data: [
            {
              value: [148564],
              name: '纯文本',
              itemStyle: {
                color: isDark ? '#3D72F6' : '#249EFF',
              },
            },
            {
              value: [334271],
              name: '图文类',
              itemStyle: {
                color: isDark ? '#A079DC' : '#313CA9',
              },
            },
            {
              value: [445694],
              name: '视频类',
              itemStyle: {
                color: isDark ? '#6CAAF5' : '#21CCFF',
              },
            },
          ],
        },
      ],
    };
  });




  const { chartOption } = useChartOption((isDark) => {
    const legendData = chatData.value.map((item) => item.categoryName);
    const seriesData = chatData.value.map((item) => {
      return {
        value: item.totalStock,
        name: item.categoryName,
        itemStyle: {
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969',
        },
      };
    });

    // console.log(seriesData);

    return {

      legend: {
        left: 'center',
        data: legendData,
        bottom: 0,
        icon: 'circle',
        itemWidth: 8,
        textStyle: {
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969',
        },
        itemStyle: {
          borderWidth: 0,
        },
      },
      tooltip: {
        show: true,
        trigger: 'item',
      },
      // graphic: {
      //   elements: [
      //     {
      //       type: 'text',
      //       left: 'center',
      //       top: '40%',
      //       style: {
      //         text: '内容量',
      //         textAlign: 'center',
      //         fill: isDark ? '#ffffffb3' : '#4E5969',
      //         fontSize: 14,
      //       },
      //     },
      //     {
      //       type: 'text',
      //       left: 'center',
      //       top: '50%',
      //       style: {
      //         text: '这是个啥?',
      //         textAlign: 'center',
      //         fill: isDark ? '#ffffffb3' : '#1D2129',
      //         fontSize: 16,
      //         fontWeight: 500,
      //       },
      //     },
      //   ],
      // },
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['50%', '50%'],
          label: {
            formatter: '{d}%',
            fontSize: 14,
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969',
          },
          itemStyle: {
            borderColor: isDark ? '#232324' : '#fff',
            borderWidth: 1,
          },
          data: seriesData,
        },
      ],
    };
  });




  const { chartOption } = useChartOption((isDark) => {
    const legendData = chatData.value.map((item) => item.categoryName);
    const seriesData = chatData.value.map((item) => {
      return {
        value: item.totalStock,
        name: item.categoryName,
        itemStyle: {
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969',
        },
      };
    });

    // console.log(seriesData);

    return {

      legend: {
        left: 'center',
        data: legendData,
        bottom: 0,
        icon: 'circle',
        itemWidth: 8,
        textStyle: {
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969',
        },
        itemStyle: {
          borderWidth: 0,
        },
      },
      tooltip: {
        show: true,
        trigger: 'item',
      },
      // graphic: {
      //   elements: [
      //     {
      //       type: 'text',
      //       left: 'center',
      //       top: '40%',
      //       style: {
      //         text: '内容量',
      //         textAlign: 'center',
      //         fill: isDark ? '#ffffffb3' : '#4E5969',
      //         fontSize: 14,
      //       },
      //     },
      //     {
      //       type: 'text',
      //       left: 'center',
      //       top: '50%',
      //       style: {
      //         text: '这是个啥?',
      //         textAlign: 'center',
      //         fill: isDark ? '#ffffffb3' : '#1D2129',
      //         fontSize: 16,
      //         fontWeight: 500,
      //       },
      //     },
      //   ],
      // },
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['50%', '50%'],
          label: {
            formatter: '{d}%',
            fontSize: 14,
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969',
          },
          itemStyle: {
            borderColor: isDark ? '#232324' : '#fff',
            borderWidth: 1,
          },
          data: seriesData,
        },
      ],
    };
  });

  -->
