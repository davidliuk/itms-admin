<template>
  <div class="container">
    <Breadcrumb :items="['menu.form', 'menu.form.step']" />
    <a-spin :loading="loading" style="width: 100%">
      <a-card class="general-card">
        <template #title>
          {{ $t('skuCreate.step.title') }}
        </template>
        <div class="wrapper">
          <a-steps v-model:current="step" line-less class="steps">
            <a-step :description="$t('skuCreate.step.subTitle.baseInfo')">
              {{ $t('skuCreate.step.title.baseInfo') }}
            </a-step>
            <a-step :description="$t('skuCreate.step.subTitle.attrGroup')">
              {{ $t('skuCreate.step.title.attrGroup') }}
            </a-step>
            <a-step :description="$t('skuCreate.step.subTitle.image')">
              {{ $t('skuCreate.step.title.image') }}
            </a-step>
            <!-- <a-step :description="$t('skuCreate.step.subTitle.poster')">
              {{ $t('skuCreate.step.title.poster') }}
            </a-step> -->
            <a-step :description="$t('skuCreate.step.subTitle.finish')">
              {{ $t('skuCreate.step.title.finish') }}
            </a-step>
          </a-steps>
          <keep-alive>
            <BaseInfo v-if="step === 1" @change-step="changeStep" />
            <!-- <PosterInfo v-else-if="step === 2" @change-step="changeStep" /> -->
            <AttrInfo v-else-if="step === 2" @change-step="changeStep" />
            <ImageInfo v-else-if="step === 3" @change-step="changeStep" />
            <!-- <ChannelInfo v-else-if="step === 4" @change-step="changeStep" /> -->
            <Success v-else-if="step === 4" @change-step="changeStep" />
          </keep-alive>
        </div>
      </a-card>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import {
    SkuAttrInfo,
    SkuBasicInfo,
    SkuImgInfo,
    SkuInfoVO,
    addSkuInfo,
  } from '@/api/product';
  import BaseInfo from './components/base-info.vue';
  import AttrInfo from './components/attr-info.vue';
  import Success from './components/success.vue';
  import ImageInfo from './components/image-info.vue';

  const { loading, setLoading } = useLoading(false);
  const step = ref(1);
  const submitModel = ref<SkuInfoVO>({} as SkuInfoVO);
  const submitForm = async () => {
    setLoading(true);
    try {
      await addSkuInfo(submitModel.value);
      step.value = 3;
      submitModel.value = {} as SkuInfoVO; // init
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  const changeStep = (
    direction: string | number,
    model: SkuBasicInfo | SkuImgInfo | SkuAttrInfo
  ) => {
    if (typeof direction === 'number') {
      step.value = direction;
      return;
    }

    if (direction === 'forward' || direction === 'submit') {
      submitModel.value = {
        ...submitModel.value,
        ...model,
      };
      if (direction === 'submit') {
        submitForm();
        return;
      }
      step.value += 1;
    } else if (direction === 'backward') {
      step.value -= 1;
    }
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 64px 0;
    background-color: var(--color-bg-2);
    :deep(.arco-form) {
      .arco-form-item {
        &:last-child {
          margin-top: 20px;
        }
      }
    }
  }

  .steps {
    margin-bottom: 76px;
  }
</style>
