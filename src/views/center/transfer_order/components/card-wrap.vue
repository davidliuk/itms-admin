<template>
  <div class="card-wrap">
    <a-card v-if="loading" :bordered="false" hoverable>
      <slot name="skeleton"></slot>
      <!-- 加载占位 -->
    </a-card>

    <a-card v-else :bordered="false" hoverable>
      <a-space align="start">
        <!-- 头像 -->
        <a-avatar
          v-if="icon"
          :size="24"
          style="margin-right: 8px; background-color: #626aea"
        >
          <icon-filter />
        </a-avatar>

        <!-- 卡片 -->
        <a-card-meta>
          <template #title>
            <!-- 标题 -->
            <a-typography-text style="margin-right: 10px">
              {{ title }}
            </a-typography-text>
            <!-- 是否展示标签 -->
            <template v-if="showTag">
              <!-- 没打开，没过期，绿色 -->
              <a-tag
                v-if="open && isExpires === false"
                size="small"
                color="green"
              >
                <template #icon>
                  <icon-check-circle-fill />
                </template>
                <!-- 标签名：已启用 -->
                <span>{{ tagText }}</span>
              </a-tag>

              <!-- 不管打没打开，过期了，红色 -->
              <a-tag v-else-if="isExpires" size="small" color="red">
                <template #icon>
                  <icon-check-circle-fill />
                </template>
                <!-- 标签名：已过期 -->
                <span>{{ expiresTagText }}</span>
              </a-tag>
            </template>
          </template>

          <template #description>
            {{ description }}
            <slot></slot>
          </template>
        </a-card-meta>
      </a-space>

      <template #actions>
        <a-switch v-if="actionType === 'switch'" v-model="open" />
        <a-space v-else-if="actionType === 'button'">
          <template v-if="isExpires">
            <a-button type="outline" @click="renew">
              {{ expiresText }}
            </a-button>
          </template>
          <template v-else>
            <a-button v-if="open" @click="handleToggle">
              {{ closeTxt }}
            </a-button>
            <a-button v-else-if="!open" type="outline" @click="handleToggle">
              {{ openTxt }}
            </a-button>
            <a-button type="outline" @click="temp()"> temp </a-button>
          </template>
        </a-space>
        <div v-else>
          <a-space>
            <a-button @click="toggle(false)">
              {{ closeTxt }}
            </a-button>
            <a-button type="primary" @click="toggle(true)">
              {{ openTxt }}
            </a-button>
          </a-space>
        </div>
      </template>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useToggle } from '@vueuse/core';
  import axios from 'axios';
  import { Admin, queryAdminList } from '@/api/acl';

  const props = defineProps({
    loading: {
      // 加载状态
      type: Boolean,
      default: false,
    },
    title: {
      // 标题
      type: String,
      default: '',
    },
    description: {
      // 描述文本
      type: String,
      default: '',
    },
    actionType: {
      // 操作类型
      type: String,
      default: '',
    },
    defaultValue: {
      // 默认值
      type: Boolean,
      default: false,
    },
    openTxt: {
      // 打开文本
      type: String,
      default: '',
    },
    closeTxt: {
      // 关闭文本
      type: String,
      default: '',
    },
    expiresText: {
      // 过期文本
      type: String,
      default: '',
    },
    icon: {
      // 图标
      type: String,
      default: '',
    },
    showTag: {
      // 是否显示标签
      type: Boolean,
      default: true,
    },
    tagText: {
      // 标签文本
      type: String,
      default: '',
    },
    expires: {
      // 是否过期
      type: Boolean,
      default: false,
    },
    expiresTagText: {
      // 过期标签文本
      type: String,
      default: '',
    },
  });
  const [open, toggle] = useToggle(props.defaultValue); // 切换true和false
  // 这行代码使用了useToggle自定义Hook，并返回了一个包含两个元素的数组。
  // open是一个变量，用于表示一个开关状态（通常是布尔类型），toggle是一个函数，用于切换开关状态。
  const handleToggle = () => {
    // 这行代码定义了一个handleToggle函数，当调用时会执行toggle函数，从而切换开关状态。
    toggle();
  };
  const isExpires = ref(props.expires);
  const renew = () => {
    isExpires.value = false;
  };

  const temp = () => {
    // botadd.error_message = "",
    axios({
      method: 'get',
      url: 'http:/127.0.0.1:8202/admin/sys/transferOrder',
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
</script>

<style scoped lang="less">
  .card-wrap {
    height: 100%;
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
</style>
