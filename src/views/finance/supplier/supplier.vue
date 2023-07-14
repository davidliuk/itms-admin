<template>
  <div class="container">
    <Breadcrumb :items="['menu.finance', 'menu.finance.supplier']" />
    <a-card class="general-card" :title="$t('menu.finance.supplier')">
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="number" :label="$t('supplier.columns.id')">
                  <a-input
                    v-model="formModel.id"
                    :placeholder="$t('supplier.form.id.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="name"
                  :label="$t('supplier.form.supplierName')"
                >
                  <a-input
                    v-model="formModel.supplierName"
                    :placeholder="$t('supplier.form.supplierName.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <!--              <a-col :span="8">
                <a-form-item
                  field="status"
                  :label="$t('supplier.form.status')"
                >
                  <a-select
                    v-model="formModel.status"
                    :options="statusOptions"
                    :placeholder="$t('supplier.form.selectDefault')"
                  />
                </a-form-item>
              </a-col>-->
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button
              type="primary"
              @click="searchSupplierBy(formModel.id, formModel.supplierName)"
            >
              <template #icon>
                <icon-search />
              </template>
              {{ $t('supplier.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('supplier.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <!--          <a-space>
            <a-button type="primary">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('supplier.operation.create') }}
            </a-button>
            <a-upload action="/">
              <template #upload-button>
                <a-button>
                  {{ $t('supplier.operation.import') }}
                </a-button>
              </template>
            </a-upload>
          </a-space>-->
        </a-col>
        <a-col
          :span="12"
          style="display: flex; align-items: center; justify-content: end"
        >
          <a-button>
            <template #icon>
              <icon-download />
            </template>
            {{ $t('supplier.operation.download') }}
          </a-button>
          <a-tooltip :content="$t('supplier.actions.refresh')">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="$t('supplier.actions.density')">
              <div class="action-icon"><icon-line-height size="18" /></div>
            </a-tooltip>
            <template #content>
              <a-doption
                v-for="item in densityList"
                :key="item.value"
                :value="item.value"
                :class="{ active: item.value === size }"
              >
                <span>{{ item.name }}</span>
              </a-doption>
            </template>
          </a-dropdown>
          <a-tooltip :content="$t('supplier.actions.columnSetting')">
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

      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="(cloneColumns as TableColumnData[])"
        :data="renderData"
        :bordered="false"
        :size="size"
        @page-change="onPageChange"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>

        <!-- 表格form里 -->
        <!-- 状态 -->
        <template #status="{ record }">
          <span
            v-if="record.storageType === 'RETURN_SUPPLIER'"
            class="circle"
          ></span>
          <span
            v-else-if="record.storageType === 'IN'"
            class="circle pass"
          ></span>
          <span
            v-else-if="record.storageType === 'OUT'"
            class="circle pass"
          ></span>
          <span
            v-else-if="record.storageType === 'RETURN_IN'"
            class="circle pass"
          ></span>
          <span
            v-else-if="record.storageType === 'RETURN_OUT'"
            class="circle pass"
          ></span>
          <span
            v-else-if="record.storageType === 'SUPPLIER'"
            class="circle pass"
          ></span>
          {{ $t(`supplier.form.status.${record.storageType}`) }}
        </template>
        <!--        <template #status="{ record }">
          <span v-if="record.status === 'offline'" class="circle"></span>
          <span v-else class="circle pass"></span>
          {{ $t(`supplier.form.status.${record.status}`) }}
        </template>-->
        <!--        <template #operations>
          <a-button v-permission="['admin']" type="text" size="small">
            {{ $t('supplier.columns.operations.view') }}
          </a-button>
          <a-button v-permission="['admin']" type="text" size="small">
            {{ $t('supplier.columns.operations.waste') }}
          </a-button>
        </template>-->
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, nextTick } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import {
    addInvoice,
    Invoice,
    querySupplierList,
    Supplier,
    updateInvoice,
    searchSupplierList,
  } from '@/api/finance';
  import { Pagination } from '@/types/global';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import copy from '@/utils/objects';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const generateFormModel = () => {
    return {
      id: '',
      skuName: '',
      skuNum: '',
      skuPrice: '',
      supplierId: '',
      supplierName: '',
      wareId: '',
      stationName: '',
      storageType: null,
    };
  };

  const isCreating = ref(false);
  const isUpdating = ref(false);

  let form = reactive(generateFormModel());

  const handleCreateClick = () => {
    isCreating.value = true;
  };
  const handleUpdateClick = (invoice: Invoice) => {
    copy(invoice, form);
    isUpdating.value = true;
  };
  const handleBeforeOk = (done: any) => {
    console.log(form);
    if (isCreating.value) {
      addInvoice(form as unknown as Invoice);
    } else {
      updateInvoice(form as unknown as Invoice);
    }
    handleClose();
  };
  const handleClose = () => {
    isCreating.value = false;
    isUpdating.value = false;
    form = reactive(generateFormModel());
  };

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<Supplier[]>([]);
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
      name: t('supplier.size.mini'),
      value: 'mini',
    },
    {
      name: t('supplier.size.small'),
      value: 'small',
    },
    {
      name: t('supplier.size.medium'),
      value: 'medium',
    },
    {
      name: t('supplier.size.large'),
      value: 'large',
    },
  ]);
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('supplier.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
    },
    {
      title: t('supplier.columns.id'),
      dataIndex: 'id',
    },
    {
      title: t('supplier.columns.supplierName'),
      dataIndex: 'supplierName',
    },
    {
      title: t('supplier.columns.skuName'),
      dataIndex: 'skuName',
    },
    {
      title: t('supplier.columns.skuNum'),
      dataIndex: 'skuNum',
    },
    {
      title: t('supplier.columns.skuPrice'),
      dataIndex: 'skuPrice',
    },
    {
      title: t('supplier.columns.wareId'),
      dataIndex: 'wareId',
    },
    {
      title: t('supplier.columns.stationName'),
      dataIndex: 'stationName',
    },
    {
      title: t('supplier.columns.storageType'),
      dataIndex: 'storageType',
      slotName: 'status',
    },
  ]);
  const search = () => {
    fetchData(basePagination.current, basePagination.pageSize, formModel.value);
  };

  const fetchData = async (
    page: number,
    pageSize: number,
    params: Partial<Supplier>
  ) => {
    try {
      const { data } = await querySupplierList(page, pageSize, params);
      renderData.value = data.records;
      pagination.current = page;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  const searchData = async (
    page: number,
    pageSize: number,
    id: string,
    supplierName: string
  ) => {
    setLoading(true);

    try {
      const { data } = await searchSupplierList(
        page,
        pageSize,
        id,
        supplierName
      );
      renderData.value = data.records;
      pagination.current = page;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  const searchSupplierBy = (id: string, supplierName: string) => {
    searchData(pagination.current, pagination.pageSize, id, supplierName);
  };

  const onPageChange = (current: number) => {
    fetchData(current, basePagination.pageSize, formModel.value);
  };
  const reset = () => {
    formModel.value = generateFormModel();
  };

  const handleSelectDensity = (
    val: string | number | Record<string, any> | undefined,
    e: Event
  ) => {
    size.value = val as SizeProps;
  };

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
  const fresh = () => {
    fetchData(basePagination.current, basePagination.pageSize, formModel.value);
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
    name: 'Supplier',
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
