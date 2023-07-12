<template>
  <a-form
    ref="formRef"
    :model="formData"
    class="form"
    :label-col-props="{ span: 6 }"
    :wrapper-col-props="{ span: 18 }"
  >
    <a-form-item
      field="skuName"
      :label="$t('skuCreate.form.label.skuName')"
      :rules="[
        {
          required: true,
          message: $t('skuCreate.form.error.skuName.required'),
        },
        {
          match: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,20}$/,
          message: $t('skuCreate.form.error.skuName.pattern'),
        },
      ]"
    >
      <a-input
        v-model="formData.skuName"
        :placeholder="$t('skuCreate.placeholder.skuName')"
      />
    </a-form-item>
    <a-form-item
      field="skuCode"
      :label="$t('skuCreate.form.label.skuCode')"
      :rules="[
        {
          required: true,
          message: $t('skuCreate.form.error.skuCode.required'),
        },
        {
          match: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,20}$/,
          message: $t('skuCreate.form.error.skuCode.pattern'),
        },
      ]"
    >
      <a-input
        v-model="formData.skuCode"
        :placeholder="$t('skuCreate.placeholder.skuCode')"
      />
    </a-form-item>
    <a-form-item
      field="categoryId"
      :label="$t('skuCreate.form.label.categoryId')"
      :rules="[
        {
          required: true,
          message: $t('skuCreate.form.error.categoryId.required'),
        },
      ]"
    >
      <a-select
        v-model="formData.categoryId"
        :placeholder="$t('skuCreate.placeholder.categoryId')"
        :options="categoryOptions"
        :loading="categoryLoading"
        :field-names="fieldNames"
      >
        <!-- <a-option>APP通用渠道</a-option> -->
      </a-select>
    </a-form-item>
    <!-- <a-form-item
      field="promotionTime"
      :label="$t('skuCreate.form.label.promotionTime')"
      :rules="[
        {
          required: true,
          message: $t('skuCreate.form.error.promotionTime.required'),
        },
      ]"
    >
      <a-range-picker v-model="formData.promotionTime" />
    </a-form-item> -->
    <a-form-item
      field="price"
      :label="$t('skuCreate.form.label.price')"
      :rules="[
        {
          required: true,
          message: $t('skuCreate.form.error.price.required'),
        },
      ]"
    >
      <a-input-number
        v-model="formData.price"
        :placeholder="$t('skuCreate.placeholder.price')"
        :default-value="1200"
        :min="0"
        :formatter="formatter"
        :parser="parser"
      />
    </a-form-item>
    <a-form-item
      field="marketPrice"
      :label="$t('skuCreate.form.label.marketPrice')"
      :rules="[
        {
          required: true,
          message: $t('skuCreate.form.error.marketPrice.required'),
        },
      ]"
    >
      <a-input-number
        v-model="formData.marketPrice"
        :placeholder="$t('skuCreate.placeholder.marketPrice')"
        :default-value="1200"
        :min="0"
        :formatter="formatter"
        :parser="parser"
      />
    </a-form-item>
    <a-form-item
      field="isNewPerson"
      :label="$t('skuCreate.form.label.isNewPerson')"
      :rules="[{ required: true }]"
    >
      <a-switch v-model="formData.isNewPerson" />
    </a-form-item>
    <!-- <a-form-item
      field="price"
      :label="$t('skuCreate.form.label.price')"
      :rules="[
        {
          required: true,
          message: $t('skuCreate.form.error.price.required'),
        },
        {
          type: 'url',
          message: $t('skuCreate.form.error.price.pattern'),
        },
      ]"
      row-class="keep-margin"
    >
      <a-input
        v-model="formData.price"
        :placeholder="$t('skuCreate.placeholder.price')"
      />
      <template #help>
        <span>{{ $t('skuCreate.form.tip.price') }}</span>
      </template>
    </a-form-item>
    <a-form-item
      field="marketPrice"
      :label="$t('skuCreate.form.label.marketPrice')"
      :rules="[
        {
          required: true,
          message: $t('skuCreate.form.error.marketPrice.required'),
        },
        {
          type: 'url',
          message: $t('skuCreate.form.error.marketPrice.pattern'),
        },
      ]"
      row-class="keep-margin"
    >
      <a-input
        v-model="formData.marketPrice"
        :placeholder="$t('skuCreate.placeholder.marketPrice')"
      />
      <template #help>
        <span>{{ $t('skuCreate.form.tip.marketPrice') }}</span>
      </template>
    </a-form-item> -->
    <a-form-item>
      <a-button type="primary" @click="onNextClick">
        {{ $t('skuCreate.button.next') }}
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
  import { ref, Ref } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { allCategory, Category, SkuBasicInfo } from '@/api/product';

  const emits = defineEmits(['changeStep']);
  const formRef = ref<FormInstance>();
  const formData = ref<SkuBasicInfo>({
    id: '',
    skuName: '',
    skuCode: '',
    categoryId: '',
    skuType: 0,
    isNewPerson: 0,
    sort: 0,
    price: 0,
    marketPrice: 0,
  });
  const fieldNames = { value: 'id', label: 'name' };
  const categoryOptions: Ref<Category[]> = ref([]);
  const categoryLoading = ref(true);

  const getAllCategory = async () => {
    const { data } = await allCategory();
    categoryOptions.value = data;
    categoryLoading.value = false;
  };
  getAllCategory();
  const onNextClick = async () => {
    console.log(formData.value);
    const res = await formRef.value?.validate();
    if (!res) {
      emits('changeStep', 'forward', { ...formData.value });
    }
  };
  const formatter = (value: string) => {
    const values = value.split('.');
    values[0] = values[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return values.join('.');
  };

  const parser = (value: string) => {
    return value.replace(/,/g, '');
  };
</script>

<style scoped lang="less">
  .container {
    padding: 20px;
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
    width: 500px;
  }

  .form-content {
    padding: 8px 50px 0 30px;
  }
</style>
