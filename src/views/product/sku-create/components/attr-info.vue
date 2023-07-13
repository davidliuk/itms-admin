<template>
  <a-form
    ref="formRef"
    :model="formData"
    class="form"
    :label-col-props="{ span: 6 }"
    :wrapper-col-props="{ span: 18 }"
  >
    <a-form-item
      field="attrGroupId"
      :label="$t('skuCreate.form.label.attrGroupId')"
      :rules="[
        {
          required: true,
          message: $t('skuCreate.form.error.attrGroupId.required'),
        },
      ]"
    >
      <a-select
        v-model="formData.attrGroupId"
        :placeholder="$t('skuCreate.placeholder.attrGroupId')"
        :options="attrGroupOptions"
        :loading="attrGroupLoading"
        :field-names="fieldNames"
        allow-clear
        allow-search
        @change="getAttrByGroup($event as string)"
      >
        <!-- <a-option>APP通用渠道</a-option> -->
      </a-select>
    </a-form-item>
    <a-form-item
      :content-flex="false"
      :merge-props="false"
      :label="$t('skuCreate.form.label.skuAttrValueList')"
      :rules="[
        {
          required: true,
          message: $t('skuCreate.form.error.skuAttrValueList.required'),
        },
      ]"
    >
      <a-card :loading="formData.attrGroupId === ''" hoverable>
        <!-- <template #extra>
          <a-link>More</a-link>
        </template> -->
        <a-space direction="vertical" fill>
          <a-form-item
            v-for="(attr, index) in attrs"
            :key="attr.id"
            field="skuAttrValueList"
            :label="attr.name"
            :rules="[
              {
                required: true,
                message: $t('skuCreate.form.error.skuAttrValueList.required'),
              },
            ]"
          >
            <a-select
              v-model="formData.skuAttrValueList[index].attrValue"
              :placeholder="$t('skuCreate.placeholder.skuAttrValueList')"
              :options="
                attr.selectList
                  .split(',')
                  .map((item) => ({ label: item, value: item }))
              "
              allow-clear
              allow-search
            />
          </a-form-item>
        </a-space>
      </a-card>
    </a-form-item>
    <a-form-item>
      <!-- <a-button type="primary" @click="onNextClick">
        {{ $t('skuCreate.button.next') }}
      </a-button> -->
      <a-space>
        <a-button type="secondary" @click="goPrev">
          {{ $t('skuCreate.button.prev') }}
        </a-button>
        <a-button type="primary" @click="onNextClick">
          {{ $t('skuCreate.button.next') }}
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
  import { Ref, ref } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import {
    Attr,
    AttrGroup,
    SkuAttrInfo,
    SkuAttrValue,
    allAttrGroup,
    getAttrByGroupId,
  } from '@/api/product';

  const emits = defineEmits(['changeStep']);

  const formRef = ref<FormInstance>();
  const formData = ref<SkuAttrInfo>({
    attrGroupId: '',
    skuAttrValueList: [],
  });
  const fieldNames = { value: 'id', label: 'name' };
  const attrGroupOptions: Ref<AttrGroup[]> = ref([]);
  const attrs: Ref<Attr[]> = ref([]);
  const attrGroupLoading = ref(true);
  const attrLoading = ref(true);

  const getAllAttrGroup = async () => {
    const { data } = await allAttrGroup();
    attrGroupOptions.value = data;
    attrGroupLoading.value = false;
  };
  const getAttrByGroup = async (groupId: string) => {
    attrLoading.value = true;
    const { data } = await getAttrByGroupId(groupId);
    attrs.value = data;
    formData.value.skuAttrValueList = data.map((item, index) => {
      return {
        id: '0',
        skuId: '',
        attrId: item.id,
        attrName: item.name,
        attrValue: '',
        sort: index,
      } as SkuAttrValue;
    });
    attrLoading.value = false;
  };
  getAllAttrGroup();
  const onNextClick = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      emits('changeStep', 'forward', { ...formData.value });
    }
  };
  const goPrev = () => {
    emits('changeStep', 'backward');
  };
</script>

<style scoped lang="less">
  .container {
    .keep-margin {
      margin-bottom: 20px;
    }
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 64px 0;
    background-color: var(--color-bg-2);
  }

  .steps {
    margin-bottom: 36px;
  }

  .form {
    width: 540px;
  }

  .form-content {
    padding: 8px 50px 0 30px;
  }
</style>
