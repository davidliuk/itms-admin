<template>
  <div class="card-wrap">
    <a-card v-if="loading" :bordered="false" hoverable>
      <slot name="skeleton"></slot>
    </a-card>

    <a-card v-else bordered="bordered" hoverable>
      <!--      <a-card-meta>-->
      <template #title>
        <a-typography-text style="margin-right: 10px">
          {{ cardData.name }}
        </a-typography-text>
      </template>
      <template #extra>
        {{ cardData.province }}/{{ cardData.city }}/{{ cardData.district }}
      </template>
      <template #actions>
        <a-col justify="start">
          <a-row justify="start">{{ cardData.leaderName }}</a-row>
          <a-row justify="start"> {{ cardData.leaderEmail }}</a-row>
        </a-col>
        <a-space>
          <a-button @click="handleInfo"> 详情 </a-button>
        </a-space>
      </template>
      <a-card-meta>
        <template #description>
          <a-col>
            <a-row class="list-row" :gutter="12" justify="end">
              <a-progress
                :animation="true"
                :percent="percentage"
                :style="{ width: '100%' }"
              />
            </a-row>
            <a-row>{{ cardData.use }} / {{ cardData.total }}</a-row>
          </a-col>
        </template>
      </a-card-meta>
    </a-card>

    <!--    <canvas id="canvas"/>-->
  </div>
</template>

<script lang="ts" setup>
  import {
    computed,
    onMounted,
    Ref,
    ref,
    defineComponent,
    nextTick,
  } from 'vue';

  const props = withDefaults(
    // 参数一：定义props类型：? 代表非必传字段， :号后面紧跟的是数据类型或自定义接口， | 或多种类型
    defineProps<{
      id?: string;
      loading?: boolean;
      name?: string;
      leaderName?: string;
      leaderEmail?: string;
      province?: string;
      city?: string;
      district?: string;
      total?: number;
      use?: number;
    }>(),
    // 参数二：指定非必传字段的默认值
    {
      id: '',
      loading: true,
      name: '',
      leaderName: '未知',
      leaderEmail: 'xxxxxxxx@xxx.com',
      province: '',
      city: '',
      district: '',
      total: 1,
      use: 0,
    }
  );

  // const props=defineProps({
  //   id: {
  //     type: String,
  //     default: '',
  //   },
  //   loading: {
  //     type: Boolean,
  //     default: false,
  //   },
  //   name: {
  //     type: String,
  //     default: '',
  //   },
  //   leaderName: {
  //     type: String,
  //     default: '未知',
  //   },
  //   leaderEmail: {
  //     type: String,
  //     default: 'xxxxxxxx@xxx.com',
  //   },
  //   province: {
  //     type: String,
  //     default: '',
  //   },
  //   city: {
  //     type: String,
  //     default: '',
  //   },
  //   district: {
  //     type: String,
  //     default: '',
  //   },
  //   total: {
  //     type: Number,
  //     default: 1,
  //   },
  //   use: {
  //     type: Number,
  //     default: 0,
  //   },
  // });

  const cardData = ref(props);

  console.log(cardData.value);
  // console.log(props);

  const percentage: Ref<number> = computed(() => {
    console.log(cardData.value.use);
    console.log(cardData.value.total);
    console.log((cardData.value.use / cardData.value.total).toFixed(2));

    return Number(
      // (props.use / props.total).toFixed(2)
      (cardData.value.use / cardData.value.total).toFixed(2)
    );
  });

  const handleInfo = () => {};
</script>

<style scoped lang="less">
  .card-wrap {
    height: 100%;
    width: 100%;
    //background-color: rgba(255, 255, 255, 0.5);
    //z-index: -1;
    transition: all 0.3s;
    border: 1px solid var(--color-neutral-3);
    border-radius: 4px;
    &:hover {
      transform: translateY(-4px);
      // box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);
    }
    :deep(.arco-card) {
      height: 100%;
      border-radius: 4px;
      .arco-card-body {
        height: 100%;
        .arco-space {
          width: 100%;
          height: 100%;
          .arco-space-item {
            height: 100%;
            &:last-child {
              flex: 1;
            }
            .arco-card-meta {
              height: 100%;
              display: flex;
              flex-flow: column;
              .arco-card-meta-content {
                flex: 1;
                .arco-card-meta-description {
                  margin-top: 8px;
                  color: rgb(var(--gray-6));
                  line-height: 20px;
                  font-size: 12px;
                }
              }
              .arco-card-meta-footer {
                margin-top: 0;
              }
            }
          }
        }
      }
    }
    :deep(.arco-card-meta-title) {
      display: flex;
      align-items: center;

      // To prevent the shaking
      line-height: 28px;
    }
    :deep(.arco-skeleton-line) {
      &:last-child {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
      }
    }
  }

  .cardFoot {
    display: flex;
  }

  .cardFoot:first-child {
    justify-content: flex-start;
  }

  .list-row-conter-card {
    justify-content: center;
  }
</style>

<!--
以下是大约可能的确会弃用的canvas波浪代码
// 创建canvas动画
  const oninitCanvas = () => {
    nextTick(() => {
      const canvas: any = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      const height: number = canvas.offsetHeight;
      const width: number = canvas.offsetWidth;
      const lines: string[] = [
        'rgba(91,196,243,0.4)',
        'rgba(91,196,243, .5)',
        'rgba(91,196,243, .6)',
      ];
      const boHeight: number = height / 10;
      const posHeight: number = height / 1.8; // 波浪高度
      const canvasAny: any = { width, height };
      const requestAnimFrame = (function () {
        // 波浪自执行函数
        return function (callback: any) {
          setTimeout(callback, 100 / 6);
        };
      })();
      let step = 0;
      // 动起来
      const loop = function () {
        ctx.clearRect(0, 0, canvasAny.width, canvasAny.height);
        step += 1;
        // 画三个不同颜色的矩阵
        for (let j = lines.length - 1; j >= 0; j -= 1) {
          // 每个矩阵的角度都不同，每个之间相差100度
          const angle: number = ((step + j * 100) * Math.PI) / 180;
          const deltaHeight: number = Math.sin(angle) * boHeight;
          const deltaHeightRight: number = Math.cos(angle) * boHeight;
          ctx.fillStyle = lines[j];
          ctx.beginPath(); // 开始绘制
          ctx.moveTo(0, posHeight + deltaHeight);
          ctx.bezierCurveTo(
            canvasAny.width / 2,
            posHeight + deltaHeight - boHeight,
            canvasAny.width / 2,
            posHeight + deltaHeightRight - boHeight,
            canvasAny.width,
            posHeight + deltaHeightRight
          );
          ctx.lineTo(canvasAny.width, canvasAny.height);
          ctx.lineTo(0, canvasAny.height);
          ctx.lineTo(0, posHeight + deltaHeight);
          ctx.fill(); // 上色
          ctx.closePath(); // 结束绘制
        }
        requestAnimFrame(loop); // 启动函数
      };
      // 随机数
      const random = function (min: number, max: number) {
        return Math.floor(Math.random() * (max - min) + min);
      };
      loop();
    });
  };
  oninitCanvas();
  onMounted(() => {
    oninitCanvas();
  });
-->
