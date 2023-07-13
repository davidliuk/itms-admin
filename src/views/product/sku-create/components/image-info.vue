<template>
  <a-form
    ref="formRef"
    :model="formData"
    class="form"
    :label-col-props="{ span: 6 }"
    :wrapper-col-props="{ span: 18 }"
  >
    <a-form-item
      field="skuImageList"
      :label="$t('skuCreate.form.label.skuImageList')"
      :rules="[
        {
          required: true,
          message: $t('skuCreate.form.error.skuImageList.required'),
        },
      ]"
    >
      <a-upload
        v-model:file-list="imageFileList"
        list-type="picture-card"
        action="http://localhost:8201/admin/product/fileUpload"
        :style="{ width: '100%' }"
        image-preview
        @success="onImageSuccess"
      />
    </a-form-item>
    <a-form-item
      field="skuPosterList"
      :label="$t('skuCreate.form.label.skuPosterList')"
      :rules="[
        {
          required: true,
          message: $t('skuCreate.form.error.skuPosterList.required'),
        },
      ]"
    >
      <a-upload
        v-model:file-list="posterFileList"
        list-type="picture-card"
        action="http://localhost:8201/admin/product/fileUpload"
        :style="{ width: '100%' }"
        image-preview
        @success="onPosterSuccess"
      />
    </a-form-item>
    <a-form-item>
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
  import { SkuImage, SkuImgInfo, SkuPoster } from '@/api/product';
  import { FileItem } from '@arco-design/web-vue/es/upload/interfaces';

  const emits = defineEmits(['changeStep']);

  const formRef = ref<FormInstance>();
  const formData = ref<SkuImgInfo>({
    imgUrl: '',
    skuImageList: [],
    skuPosterList: [],
  });

  const imageFileList: Ref<FileItem[]> = ref([]);
  const posterFileList: Ref<FileItem[]> = ref([]);

  const onImageSuccess = (res: any) => {
    imageFileList.value[imageFileList.value.length - 1].url = res.response.data;
    formData.value.imgUrl = imageFileList.value[0].url as string;
    formData.value.skuImageList = imageFileList.value.map((item, index) => {
      return {
        id: '',
        skuId: '',
        imgName: item.name,
        imgUrl: item.url,
        sort: index,
      } as SkuImage;
    });
  };

  const onPosterSuccess = (res: any) => {
    posterFileList.value[posterFileList.value.length - 1].url =
      res.response.data;
    formData.value.skuPosterList = posterFileList.value.map((item) => {
      return {
        id: '',
        skuId: '',
        imgName: item.name,
        imgUrl: item.url,
      } as SkuPoster;
    });
  };

  const onNextClick = async () => {
    console.log(formData.value);
    const res = await formRef.value?.validate();
    if (!res) {
      emits('changeStep', 'submit', { ...formData.value });
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
