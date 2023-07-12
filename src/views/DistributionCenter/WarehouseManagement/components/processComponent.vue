<template>
  <div class="list-wrap">
    <a-row class="list-row" :gutter="24" justify="end">
      <Chart height="30px" :option="chartOption" />
      {{ memoryUsageText }}
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import useChartOption from '@/hooks/chart-option';

  const props = defineProps({
    totalMemory: {
      type: Number,
      default: 1,
    },
    useMemory: {
      type: Number,
      default: 0,
    },
  });

  const memoryUsageText =
    props.totalMemory === 0 || props.useMemory === props.totalMemory
      ? 'full'
      : `${props.useMemory}/${props.totalMemory}`;
  const dataToShow = 0.55;
  // props.totalMemory === 0 ? 1.0 : props.useMemory / props.totalMemory;
  const { chartOption } = useChartOption((isDark: any) => {
    // echarts support https://echarts.apache.org/zh/theme-builder.html
    return {
      tooltip: {
        show: true,
        trigger: 'item',
      },
      yAxis: {
        type: 'category',
        data: ['Bar'],
        show: false,
      },
      xAxis: {
        show: false,
        type: 'value',
        min: 0,
        max: 1,
        axisLabel: {
          formatter: '{value}',
        },
      },
      grid: {
        show: false,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
      series: [
        {
          type: 'bar',
          data: [dataToShow], // Assuming "data" is a single value between 0 and 1
          itemStyle: {
            color: '#3398DB', // Customize the color as needed
          },
          label: {
            show: true,
            position: 'insideRight',
            formatter: '{c}',
          },
          barWidth: '100%', // Adjust the width of the bars as needed
          z: 2,
        },
        {
          type: 'bar',
          data: [1], // Assuming "1" represents the empty bar
          barWidth: '100%', // Adjust the width of the bars as needed
          itemStyle: {
            color: 'transparent', // Make the empty bar transparent
            borderColor: '#3398DB', // Customize the color of the border
            borderWidth: 1, // Adjust the width of the border as needed
          },
          z: 1,
        },
      ],
    };
  });
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
    height: 200px;
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
