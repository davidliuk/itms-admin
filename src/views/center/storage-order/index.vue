<template>
  <div class="container">
    <Breadcrumb :items="['menu.center', 'menu.center.StorageOrder']" />
    <a-card class="general-card" :title="$t('menu.center.StorageOrder')">
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
                <a-form-item
                  field="wareId"
                  :label="$t('StorageOrder.form.wareId')"
                >
                  <a-input
                    v-model="formModel.wareId"
                    :placeholder="$t('StorageOrder.form.wareId.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="stationId"
                  :label="$t('StorageOrder.form.stationId')"
                >
                  <a-input
                    v-model="formModel.stationId"
                    :placeholder="$t('StorageOrder.form.stationId.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="supplierId"
                  :label="$t('StorageOrder.form.supplierId')"
                >
                  <a-input
                    v-model="formModel.supplierId"
                    :placeholder="
                      $t('StorageOrder.form.supplierId.placeholder')
                    "
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="skuId"
                  :label="$t('StorageOrder.form.skuId')"
                >
                  <a-input
                    v-model="formModel.skuId"
                    :placeholder="$t('StorageOrder.form.skuId.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="skuName"
                  :label="$t('StorageOrder.form.skuName')"
                >
                  <a-input
                    v-model="formModel.skuName"
                    :placeholder="$t('StorageOrder.form.skuName.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="status"
                  :label="$t('StorageOrder.form.storageType')"
                >
                  <a-select
                    v-model="formModel.storageType"
                    :options="statusOptions"
                    :placeholder="$t('StorageOrder.form.selectDefault')"
                  />
                </a-form-item>
              </a-col>
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
              {{ $t('StorageOrder.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('StorageOrder.form.reset') }}
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
            <a-upload @before-upload="(file: File) => {
                formCSV(file, (order: any) => {
                    order.forEach((order: StorageOrder) => {
                      addStorageOrder(order);
                    });
                    return true;
                  });
                }">
              <template #upload-button>
                <a-button type="primary">
                  {{ $t('StorageOrder.operation.import') }}
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
          <a-button @click="downloadStorageOrderList">
            <template #icon>
              <icon-download />
            </template>
            {{ $t('StorageOrder.operation.download') }}列表
          </a-button>
          <a-tooltip :content="$t('StorageOrder.actions.refresh')">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <!-- 密度 -->
            <a-tooltip :content="$t('StorageOrder.actions.density')">
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
                <span>{{ item.name }}</span>
              </a-doption>
            </template>
          </a-dropdown>
          <a-tooltip :content="$t('StorageOrder.actions.columnSetting')">
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

      <!-- 表格 -->
      <a-table
        id="printTable"
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="(cloneColumns as TableColumnData[])"
        :data="renderData"
        :bordered="false"
        :size="size"
        :scroll="scroll"
        @page-change="onPageChange"
      >
        <!-- 分页 -->
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>

        <!-- 表格form里 -->
        <!-- 类型 -->
        <template #storageType="{ record }">
          <span v-if="record.storageType === 'IN'" class="circle"></span>
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
          {{ $t(`StorageOrder.form.storageType.${record.storageType}`) }}
        </template>
        <!-- 表格form里 -->

        <!-- table里 -->
        <!-- 查看 -->
        <template #operations="{ record }">
          <!--          打印-->

          <!--          查看 商品详情-->
          <!-- 打印 -->
          <a-button type="text" size="small" @click="printClick(record)"
            >打印出库单</a-button
          >
          <a-modal
            ok-text="打印"
            :visible="printVisible"
            title="出库单详情"
            width="700px"
            @cancel="printCancel"
            @before-ok="printBeforeOk"
            >间距
            <a-radio-group v-model="pdfSize" type="button">
              <a-radio value="mini">mini</a-radio>
              <a-radio value="small">small</a-radio>
              <a-radio value="medium">medium</a-radio>
              <a-radio value="large">large</a-radio>
            </a-radio-group>
            <a-descriptions
              id="capture"
              style="margin-top: 20px"
              :data="data"
              :size="pdfSize"
              title="User Info"
              :column="1"
            ></a-descriptions>
          </a-modal>
          <!--            打印结束-->
          <!--          查看 商品详情-->
          <a-button
            v-permission="['admin']"
            type="text"
            size="small"
            @click="SkuDetail(record.orderId)"
          >
            {{ $t('StorageOrder.columns.operations.view') }}
          </a-button>
          <a-modal
            v-model:visible="visible"
            @ok="handleOk"
            @cancel="handleCancel"
          >
            <template #title> 出库单商品详情 </template>
            <a-table
              row-key="id"
              :loading="loading"
              :columns="(Skucolumns as TableColumnData[])"
              :data="orderItemData"
              :bordered="false"
              :size="size"
              @page-change="onPageChange"
            >
              <template #imgUrl="{ record }">
                <img
                  :src="record.imgUrl"
                  alt="Product Image"
                  style="width: 100px; height: 100px"
                />
              </template>
            </a-table>
          </a-modal>
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
    queryStorageOrderList,
    StorageOrder,
    queryOrderInfo,
    OrderItem,
    CheckOrder, addStorageOrder
  } from "@/api/center";
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import htmlToPdf from '@/utils/pdf';
  import { formCSV } from "@/utils/csv";
  import { AddRole, Role } from "@/api/acl";

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const generateFormModel = () => {
    return {
      wareId: '',
      skuId: '',
      skuName: '',
      stationId: '',
      supplierId: '',
      storageType: null,
    };
  };
  const generateorderItemModel = () => {
    return {
      orderItemList: [],
    };
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<StorageOrder[]>([]);
  const orderItemData = ref<OrderItem[]>([]);
  const formModel = ref(generateFormModel()); // 输入框要用的
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);

  const size = ref<SizeProps>('medium');

  // 描述列表展示打印信息
  const pdfSize = ref('medium');
  let data = [
    { label: '分发单标识', value: '' },
    { label: '区域中心库房编号', value: '' },
    { label: '订单编号', value: '' },
    { label: '商品编号', value: '' },
    { label: '商品名称', value: '' },
    { label: '分站编号', value: '' },
    { label: '分站名称', value: '' },
    { label: '供应商编号', value: '' },
    { label: '供货商名称', value: '' },
    { label: '库存单类型', value: '' },
    { label: '创建时间', value: '' },
    { label: '更新时间', value: '' },
  ];
  const printVisible = ref(false);
  const printClick = (storageOrder: StorageOrder) => {
    data = [
      { label: '出库单标识', value: storageOrder.id },
      { label: '区域中心库房编号', value: storageOrder.wareId.toString() },
      { label: '订单编号', value: storageOrder.orderId.toString() },
      { label: '商品编号', value: storageOrder.skuId.toString() },
      { label: '商品名称', value: storageOrder.skuName.valueOf() },
      { label: '分站编号', value: storageOrder.stationId.toString() },
      { label: '分站名称', value: storageOrder.stationName },
      { label: '供应商编号', value: storageOrder.supplierId.toString() },
      { label: '供货商名称', value: storageOrder.supplierName },
      {
        label: '库存单类型',
        value: t(`StorageOrder.form.storageType.${storageOrder.storageType}`),
      },
      { label: '创建时间', value: storageOrder.createTime },
      { label: '更新时间', value: storageOrder.updateTime },
    ];
    setTimeout(() => {
      printVisible.value = true;
    }, 500);
  };
  const printBeforeOk = () => {
    console.log('打印');
    const text = '分发单详情';
    // text:文件标题
    htmlToPdf(text, '#capture');
  };
  const printCancel = () => {
    printVisible.value = false;
  };
  // 描述列表展示打印信息

  // 打印出库单列表
  const downloadStorageOrderList = () => {
    const text = '所有出库单信息';
    // text:文件标题
    htmlToPdf(text, '#printTable');
  };
  // 打印出库单列表

  // 密度选择
  const densityList = computed(() => [
    {
      name: t('StorageOrder.size.mini'),
      value: 'mini',
    },
    {
      name: t('StorageOrder.size.small'),
      value: 'small',
    },
    {
      name: t('StorageOrder.size.medium'),
      value: 'medium',
    },
    {
      name: t('StorageOrder.size.large'),
      value: 'large',
    },
  ]);
  // 展示出库单信息表格
  // 固定列表列
  const scroll = { x: 1500, y: 1500 };
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('StorageOrder.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
      width: 70,
      fixed: 'left',
    },
    {
      title: t('StorageOrder.columns.id'),
      dataIndex: 'id',
      width: 110,
      fixed: 'left',
    },
    {
      title: t('StorageOrder.columns.wareId'),
      dataIndex: 'wareId',
      width: 100,
    },
    {
      title: t('StorageOrder.columns.stationId'),
      dataIndex: 'stationId',
      slotName: 'stationId',
      width: 100,
    },
    {
      title: t('StorageOrder.columns.supplierName'),
      dataIndex: 'stationName',
      slotName: 'stationName',
      width: 120,
    },
    {
      title: t('StorageOrder.columns.supplierId'),
      dataIndex: 'supplierId',
      slotName: 'supplierId',
      width: 110,
    },
    {
      title: t('StorageOrder.columns.supplierId'),
      dataIndex: 'supplierName',
      slotName: 'supplierName',
      width: 120,
    },
    {
      title: t('StorageOrder.columns.storageType'),
      dataIndex: 'storageType',
      slotName: 'storageType',
      width: 120,
    },
    {
      title: t('StorageOrder.columns.createTime'),
      dataIndex: 'createTime',
    },
    {
      title: t('StorageOrder.columns.updateTime'),
      dataIndex: 'updateTime',
    },
    {
      title: t('StorageOrder.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      width: 250,
      fixed: 'right',
    },
  ]);
  // 搜索类型输入框下拉列表
  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('StorageOrder.form.storageType.IN'),
      value: 'IN',
    },
    {
      label: t('StorageOrder.form.storageType.OUT'),
      value: 'OUT',
    },
    {
      label: t('StorageOrder.form.storageType.RETURN_IN'),
      value: 'RETURN_IN',
    },
    {
      label: t('StorageOrder.form.storageType.RETURN_OUT'),
      value: 'RETURN_OUT',
    },
  ]);

  // 展示商品的表格内容
  const Skucolumns = computed<TableColumnData[]>(() => [
    {
      title: t('StorageOrder.columns.skuId'),
      dataIndex: 'skuId',
    },
    {
      title: t('StorageOrder.columns.skuName'),
      dataIndex: 'skuName',
      slotName: 'skuName',
    },
    {
      title: t('StorageOrder.columns.skuImg'),
      dataIndex: 'imgUrl',
      slotName: 'imgUrl',
    },
    {
      title: t('StorageOrder.columns.skuNum'),
      dataIndex: 'skuNum',
    },
    {
      title: t('StorageOrder.columns.skuPrice'),
      dataIndex: 'skuPrice',
    },
  ]);

  // 展示商品详细信息
  const visible = ref(false);
  const findOrderItemData = async (orderId: number) => {
    setLoading(true);
    try {
      const { data } = await queryOrderInfo(orderId);
      console.log(data);
      orderItemData.value = data.orderItemList; // data里的一个字段
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  const SkuDetail = (orderId: number) => {
    findOrderItemData(orderId, generateorderItemModel.value);
    visible.value = true;
  };
  const handleOk = () => {
    visible.value = false;
  };
  const handleCancel = () => {
    visible.value = false;
  };

  // 分页

  const basePagination: Pagination = {
    current: 1,
    pageSize: 20,
  };
  const pagination = reactive({
    ...basePagination,
  });

  const fetchData = async (
    current: number,
    pageSize: number,
    params: Partial<StorageOrder>
  ) => {
    setLoading(true);
    try {
      const { data } = await queryStorageOrderList(current, pageSize, params);
      console.log(data);
      renderData.value = data.records; // 整个列表，上面ref的也是整个列表，
      pagination.current = current;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    fetchData(basePagination.current, basePagination.pageSize, formModel.value);
  };
  const onPageChange = (current: number) => {
    fetchData(current, basePagination.pageSize, formModel.value);
  };

  fetchData(pagination.current, pagination.pageSize, formModel.value);
  // 重置
  const reset = () => {
    formModel.value = generateFormModel();
    fetchData(basePagination.current, basePagination.pageSize, formModel.value);
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
    name: 'StorageOrder',
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
