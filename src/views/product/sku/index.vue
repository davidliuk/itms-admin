<template>
  <div class="container">
    <Breadcrumb :items="['menu.product', 'menu.product.sku']" />
    <a-card class="general-card" :title="$t('menu.product.sku')">
      <a-row>
        <!-- 6个输入框 -->
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="id" :label="$t('skuInfo.form.id')">
                  <a-input
                    v-model="formModel.id"
                    :placeholder="$t('skuInfo.form.id.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="skuName"
                  :label="$t('skuInfo.form.skuName')"
                >
                  <a-input
                    v-model="formModel.skuName"
                    :placeholder="$t('skuInfo.form.skuName.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="skuCode"
                  :label="$t('skuInfo.form.skuCode')"
                >
                  <a-input
                    v-model="formModel.skuCode"
                    :placeholder="$t('skuInfo.form.skuCode.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="categoryId"
                  :label="$t('skuInfo.form.categoryId')"
                >
                  <a-input
                    v-model="formModel.categoryId"
                    :placeholder="$t('skuInfo.form.categoryId.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="price" :label="$t('skuInfo.form.price')">
                  <a-input-number
                    v-model="formModel.price"
                    :placeholder="$t('skuInfo.form.price.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="publishStatus"
                  :label="$t('skuInfo.form.publishStatus')"
                >
                  <a-input-number
                    v-model="formModel.publishStatus"
                    :placeholder="$t('skuInfo.form.publishStatus.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <!-- <a-col :span="8">
                <a-form-item
                  field="createTime"
                  :label="$t('skuInfo.form.createTime')"
                >
                  <a-range-picker
                    v-model="formModel.createTime"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="updateTime"
                  :label="$t('skuInfo.form.updateTime')"
                >
                  <a-range-picker
                    v-model="formModel.updateTime"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col> -->
              <!-- <a-col :span="8">
                <a-form-item
                  field="status"
                  :label="$t('skuInfo.form.status')"
                >
                  <a-select
                    v-model="formModel.status"
                    :options="statusOptions"
                    :placeholder="$t('skuInfo.form.selectDefault')"
                  />
                </a-form-item>
              </a-col> -->
            </a-row>
          </a-form>
        </a-col>

        <!-- 分割线 -->
        <a-divider style="height: 84px" direction="vertical" />
        <!-- 查找重置按钮 -->
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('skuInfo.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('skuInfo.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <!-- 表格上面的一排按钮 -->
      <a-row style="margin-bottom: 16px">
        <!-- 表格上面的新建、批量导入 -->
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="handleCreateClick">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('skuInfo.operation.create') }}
            </a-button>
            <a-upload action="/">
              <template #upload-button>
                <a-button>
                  {{ $t('skuInfo.operation.import') }}
                </a-button>
              </template>
            </a-upload>
          </a-space>
        </a-col>
        <!-- 表格上面的下载设置等 -->
        <a-col
          :span="12"
          style="display: flex; align-items: center; justify-content: end"
        >
          <a-button>
            <template #icon>
              <icon-download />
            </template>
            {{ $t('skuInfo.operation.download') }}
          </a-button>
          <a-tooltip :content="$t('skuInfo.actions.refresh')">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <!-- 密度 -->
            <a-tooltip :content="$t('skuInfo.actions.density')">
              <div class="action-icon"><icon-line-height size="18" /></div>
            </a-tooltip>

            <!-- size -->
            <template #content>
              <a-doption
                v-for="item in densityList"
                :key="item.value"
                :value="item.value"
                :class="{ active: item.value === size }"
              >
                <span>{{ item.skuName }}</span>
              </a-doption>
            </template>
          </a-dropdown>
          <a-tooltip :content="$t('skuInfo.actions.columnSetting')">
            <a-popover
              trigger="click"
              position="bl"
              @popup-visible-change="popupVisibleChange"
            >
              <div class="action-icon"><icon-settings size="18" /></div>
              <template #content>
                <div id="tableSetting">
                  <div
                    v-for="(item, index) in showColumns"
                    :key="item.dataIndex"
                    class="setting"
                  >
                    <div style="margin-right: 4px; cursor: move">
                      <icon-drag-arrow />
                    </div>
                    <div>
                      <a-checkbox
                        v-model="item.checked"
                        @change="
                          handleChange($event, item as TableColumnData, index)
                        "
                      >
                      </a-checkbox>
                    </div>
                    <div class="title">
                      {{ item.title === '#' ? '序列号' : item.title }}
                    </div>
                  </div>
                </div>
              </template>
            </a-popover>
          </a-tooltip>
        </a-col>
      </a-row>
      <a-modal
        :visible="isCreating || isUpdating"
        :title="$t(`skuInfo.form.title.${isCreating ? 'create' : 'update'}`)"
        @cancel="handleClose"
        @before-ok="handleBeforeOk"
      >
        <a-form :model="form">
          <a-form-item
            v-for="(val, key) in form"
            :key="key"
            :field="key"
            :label="$t(`skuInfo.form.${key}`)"
          >
            <a-input
              v-model="form[key]"
              :placeholder="$t(`skuInfo.form.${key}.placeholder`)"
            />
          </a-form-item>
        </a-form>
      </a-modal>
      <!-- 表格 -->
      <a-table
        v-model:selected-keys="selectedKeys"
        row-key="id"
        :row-selection="rowSelection"
        :loading="loading"
        :pagination="pagination"
        :columns="(cloneColumns as TableColumnData[])"
        :data="renderData"
        :bordered="false"
        :size="size"
        @page-change="onPageChange"
      >
        <!-- 分页 -->
        <!-- <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template> -->
        <!-- 表格form里 -->
        <!-- 状态 -->
        <template #status="{ record }">
          <span v-if="record.status === 'no_shipped'" class="circle"></span>
          <span
            v-else-if="record.status === 'shipped'"
            class="circle pass"
          ></span>
          <span
            v-else-if="record.status === 'stocked'"
            class="circle pass"
          ></span>
          {{ $t(`skuInfo.form.status.${record.status}`) }}
        </template>
        <!-- 表格form里 -->
        <template #imgUrl="{ record }">
          <img
            :src="record.imgUrl"
            alt="Sku Image"
            style="width: 100px; height: 100px"
          />
        </template>

        <!-- table里 -->
        <!-- 查看 -->
        <template #operations="{ record }">
          <a-button v-permission="['admin']" type="text" size="small">
            {{ $t('skuInfo.columns.operations.view') }}
          </a-button>
          <a-button
            v-permission="['admin']"
            type="text"
            size="small"
            @click="deleteSkuInfoById(record.id)"
          >
            {{ $t('skuInfo.columns.operations.delete') }}
          </a-button>
          <a-button
            v-permission="['admin']"
            type="text"
            size="small"
            @click="handleUpdateClick(record)"
          >
            {{ $t('skuInfo.columns.operations.update') }}
          </a-button>
        </template>
        <!-- 查看 -->
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, nextTick } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import {
    querySkuInfoList,
    updateSkuInfo,
    deleteSkuInfo,
    SkuInfo,
  } from '@/api/product';
  import { Pagination } from '@/types/global';
  import type {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import copy from '@/utils/objects';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const generateFormModel = () => {
    return {
      id: '',
      categoryId: '',
      skuName: '',
      skuCode: '',
      publishStatus: 0,
      price: 0,
      sort: 0,
      // createTime: null,
      // updateTime: null,
    } as SkuInfo;
  };

  const selectedKeys = ref([]);

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  } as TableRowSelection);

  const isCreating = ref(false);
  const isUpdating = ref(false);
  let form = reactive(generateFormModel());

  const handleCreateClick = () => {
    // isCreating.value = true;
    router.push({ name: 'skuCreate' });
  };
  const handleUpdateClick = (skuInfo: SkuInfo) => {
    copy(skuInfo, form);
    isUpdating.value = true;
  };
  const handleBeforeOk = (done: any) => {
    if (isCreating.value) {
      // addSkuInfo(form as unknown as SkuInfo);
    } else if (isUpdating.value) {
      updateSkuInfo(form as unknown as SkuInfo);
    }
    done();
    handleClose();
    search();
  };
  const handleClose = () => {
    isCreating.value = false;
    isUpdating.value = false;
    form = reactive(generateFormModel());
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<SkuInfo[]>([]);
  const formModel = ref(generateFormModel());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);

  const size = ref<SizeProps>('medium');

  const basePagination: Pagination = {
    current: 1,
    pageSize: 20,
  };
  const pagination = reactive({
    ...basePagination,
  });
  const densityList = computed(() => [
    {
      skuName: t('skuInfo.size.mini'),
      value: 'mini',
    },
    {
      skuName: t('skuInfo.size.small'),
      value: 'small',
    },
    {
      skuName: t('skuInfo.size.medium'),
      value: 'medium',
    },
    {
      skuName: t('skuInfo.size.large'),
      value: 'large',
    },
  ]);

  const columns = computed<TableColumnData[]>(() => [
    // {
    //   title: t('skuInfo.columns.index'),
    //   dataIndex: 'index',
    //   slotName: 'index',
    // },
    {
      title: t('skuInfo.columns.id'),
      dataIndex: 'id',
    },
    {
      title: t('skuInfo.columns.skuCode'),
      dataIndex: 'skuCode',
    },
    {
      title: t('skuInfo.columns.skuName'),
      dataIndex: 'skuName',
    },
    {
      title: t('skuInfo.columns.imgUrl'),
      dataIndex: 'imgUrl',
      slotName: 'imgUrl',
    },
    {
      title: t('skuInfo.columns.sort'),
      dataIndex: 'sort',
    },
    {
      title: t('skuInfo.columns.price'),
      dataIndex: 'price',
    },
    {
      title: t('skuInfo.columns.marketPrice'),
      dataIndex: 'marketPrice',
    },
    {
      title: t('skuInfo.columns.createTime'),
      dataIndex: 'createTime',
    },
    {
      title: t('skuInfo.columns.updateTime'),
      dataIndex: 'updateTime',
    },
    // {
    //   title: t('skuInfo.columns.phone'),
    //   dataIndex: 'phone',
    //   slotName: 'phone',
    // },
    // {
    //   title: t('skuInfo.columns.sku_name'),
    //   dataIndex: 'sku_name',
    //   slotName: 'sku_name',
    // },
    // {
    //   title: t('skuInfo.columns.sku_num'),
    //   dataIndex: 'sku_num',
    // },
    // {
    //   title: t('skuInfo.columns.status'),
    //   dataIndex: 'status',
    //   slotName: 'status',
    // },
    {
      title: t('skuInfo.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);

  // //过滤器
  //   const filterTypeOptions = computed<SelectOptionData[]>(() => [
  //     {
  //       label: t('skuInfo.form.filterType.artificial'),
  //       value: 'artificial',
  //     },
  //     {
  //       label: t('skuInfo.form.filterType.rules'),
  //       value: 'rules',
  //     },
  //   ]);

  // 分页
  const fetchData = async (
    current: number,
    pageSize: number,
    params: Partial<SkuInfo>
  ) => {
    setLoading(true);
    try {
      const { data } = await querySkuInfoList(current, pageSize, params);
      renderData.value = data.records;
      pagination.current = current;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const deleteSkuInfoById = async (id: number) => {
    setLoading(true);
    try {
      await deleteSkuInfo(id);
      fetchData(pagination.current, pagination.pageSize, formModel.value);
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    fetchData(pagination.current, pagination.pageSize, formModel.value);
  };

  const onPageChange = (current: number) => {
    fetchData(current, pagination.pageSize, formModel.value);
  };
  fetchData(pagination.current, pagination.pageSize, formModel.value);

  // 重置
  const reset = () => {
    formModel.value = generateFormModel();
  };
  // 设置密度
  const handleSelectDensity = (
    val: string | number | Record<string, any> | undefined,
    e: Event
  ) => {
    size.value = val as SizeProps;
  };
  // 改变内容
  const handleChange = (
    checked: boolean | (string | boolean | number)[],
    column: Column,
    index: number
  ) => {
    if (!checked) {
      cloneColumns.value = showColumns.value.filter(
        (item) => item.dataIndex !== column.dataIndex
      );
    } else {
      cloneColumns.value.splice(index, 0, column);
    }
  };

  const exchangeArray = <T extends Array<any>>(
    array: T,
    beforeIdx: number,
    newIdx: number,
    isDeep = false
  ): T => {
    const newArray = isDeep ? cloneDeep(array) : array;
    if (beforeIdx > -1 && newIdx > -1) {
      // 先替换后面的，然后拿到替换的结果替换前面的
      newArray.splice(
        beforeIdx,
        1,
        newArray.splice(newIdx, 1, newArray[beforeIdx]).pop()
      );
    }
    return newArray;
  };

  const popupVisibleChange = (val: boolean) => {
    if (val) {
      nextTick(() => {
        const el = document.getElementById('tableSetting') as HTMLElement;
        const sortable = new Sortable(el, {
          onEnd(e: any) {
            const { oldIndex, newIndex } = e;
            exchangeArray(cloneColumns.value, oldIndex, newIndex);
            exchangeArray(showColumns.value, oldIndex, newIndex);
          },
        });
      });
    }
  };

  watch(
    () => columns.value,
    (val) => {
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value.forEach((item, index) => {
        item.checked = true;
      });
      showColumns.value = cloneDeep(cloneColumns.value);
    },
    { deep: true, immediate: true }
  );
</script>

<script lang="ts">
  export default {
    skuName: 'SkuInfo',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }
  .action-icon {
    margin-left: 12px;
    cursor: pointer;
  }
  .active {
    color: #0960bd;
    background-color: #e3f4fc;
  }
  .setting {
    display: flex;
    align-items: center;
    width: 200px;
    .title {
      margin-left: 12px;
      cursor: pointer;
    }
  }
</style>
