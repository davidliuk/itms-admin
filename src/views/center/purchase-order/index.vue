<template>
  <div class="container">
    <Breadcrumb :items="['menu.center', 'menu.center.PurchaseOrder']" />
    <a-card class="general-card" :title="$t('menu.center.PurchaseOrder')">
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
                <a-form-item field="id" :label="$t('PurchaseOrder.form.id')">
                  <a-input
                    v-model="formModel.id"
                    :placeholder="$t('PurchaseOrder.form.id.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="wareId"
                  :label="$t('PurchaseOrder.form.wareId')"
                >
                  <a-input
                    v-model="formModel.wareId"
                    :placeholder="$t('PurchaseOrder.form.wareId.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="skuId"
                  :label="$t('PurchaseOrder.form.skuId')"
                >
                  <a-input
                    v-model="formModel.skuId"
                    :placeholder="$t('PurchaseOrder.form.skuId.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="skuName"
                  :label="$t('PurchaseOrder.form.skuName')"
                >
                  <a-input
                    v-model="formModel.skuName"
                    :placeholder="$t('PurchaseOrder.form.skuName.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="supplierId"
                  :label="$t('PurchaseOrder.form.supplierId')"
                >
                  <a-input
                    v-model="formModel.supplierId"
                    :placeholder="
                      $t('PurchaseOrder.form.supplierId.placeholder')
                    "
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="supplierName"
                  :label="$t('PurchaseOrder.form.supplierName')"
                >
                  <a-input
                    v-model="formModel.supplierName"
                    :placeholder="
                      $t('PurchaseOrder.form.supplierName.placeholder')
                    "
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
              {{ $t('PurchaseOrder.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('PurchaseOrder.form.reset') }}
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
            <a-button type="primary">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('PurchaseOrder.operation.create') }}
            </a-button>
            <a-upload
              @before-upload="(file: File) => {
                formCSV(file, (order: any) => {
                    order.forEach((order: PurchaseOrder) => {
                      addPurchaseOrder(order);
                    });
                    return true;
                  });
                }"
            >
              <template #upload-button>
                <a-button>
                  {{ $t('PurchaseOrder.operation.import') }}
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
          <a-button @click="downloadPurchaseOrderList">
            <template #icon>
              <icon-download />
            </template>
            {{ $t('PurchaseOrder.operation.download') }}列表
          </a-button>
          <a-tooltip :content="$t('PurchaseOrder.actions.refresh')">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <!-- 密度 -->
            <a-tooltip :content="$t('PurchaseOrder.actions.density')">
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
          <a-tooltip :content="$t('PurchaseOrder.actions.columnSetting')">
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

        <!-- table里 -->
        <template #imgUrl="{ record }">
          <img
            :src="record.imgUrl"
            alt="Product Image"
            style="width: 100px; height: 100px"
          />
        </template>

        <!-- 查看 -->
        <template #operations="{ record }">
          <a-button type="text" size="small" @click="printClick(record)"
            >下载预览</a-button
          >
          <a-modal
            ok-text="打印"
            :visible="printVisible"
            title="购货单详情"
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
              title="购货单详情"
              :column="1"
            >
              >
              <a-descriptions-item
                v-for="item of data"
                :key="item.value"
                :label="item.label"
              >
                <span v-if="item.label !== '商品图片'">{{ item.value }}</span>
                <img
                  v-else-if="item.label === '商品图片'"
                  src="@/assets/images/qiao.jpg"
                  alt="商品图片"
                  style="width: 200px; height: 200px"
                />
              </a-descriptions-item>
            </a-descriptions>
          </a-modal>

          <!--                    <a-button @click="handleClick(record)">Open Modal</a-button>-->
          <!--                    <a-modal-->
          <!--                      :visible="visible"-->
          <!--                      title="购货单详情"-->
          <!--                      @cancel="handleCancel"-->
          <!--                      @before-ok="handleBeforeOk"-->
          <!--                    >-->
          <!--                      <a-form id="capture" :model="form">-->
          <!--                        <a-form-item-->
          <!--                          v-for="(val, key) in form"-->
          <!--                          :key="key"-->
          <!--                          :field="key"-->
          <!--                          :label="$t(`PurchaseOrder.form.${key}`)"-->
          <!--                        >-->
          <!--                          <a-input-->
          <!--                            v-if="key !== 'createTime' && key !== 'updateTime'&& key!=='imgUrl'"-->
          <!--                            v-model="form[key]"-->
          <!--                            :placeholder="$t(`PurchaseOrder.form.${key}.placeholder`)"-->
          <!--                          />-->
          <!--                          <img-->
          <!--                              v-else-if="key==='imgUrl'"-->
          <!--                              :src="form[key]"-->
          <!--                              :alt="form[key]"-->
          <!--                              style="width: 100px; height: 100px"-->
          <!--                          />-->
          <!--                          <a-date-picker-->
          <!--                            v-else-->
          <!--                            v-model="form[key]"-->
          <!--                            style="width: 100%"-->
          <!--                            show-time-->
          <!--                            :time-picker-props="{ defaultValue: '09:09:06' }"-->
          <!--                            format="YYYY-MM-DD HH:mm:ss"-->
          <!--                          />-->
          <!--                        </a-form-item>-->
          <!--                      </a-form>-->
          <!--                    </a-modal>-->
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
    queryPurchaseOrderList,
    PurchaseOrder,
    addPurchaseOrder,
  } from '@/api/center';
  import { Pagination } from '@/types/global';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import htmlToPdf from '@/utils/pdf';
  import copy from '@/utils/objects';
  import { formCSV } from '@/utils/csv';
  import { AddRole, Role } from '@/api/acl';

  const generateFormModel = () => {
    return {
      id: '',
      wareId: '',

      skuId: '',
      skuName: '',
      skuNum: '',
      imgUrl: '',
      skuPrice: '',

      supplierId: '',
      supplierName: '',
      updateTime: null,
      createTime: null,
    };
  };

  const renderData = ref<PurchaseOrder[]>([]);
  const formModel = ref(generateFormModel()); // 输入框要用的
  const form = reactive(generateFormModel());

  const basePagination: Pagination = {
    current: 1,
    pageSize: 6,
  };
  const pagination = reactive({
    ...basePagination,
  });

  // 固定列
  //   const expandable = {
  //     title: 'Expand',
  //     width: 80,
  //   }

  const scroll = {
    x: 1500,
    y: 1500,
  };
  // 固定列

  // 描述列表展示打印信息
  const pdfSize = ref('medium');
  const pdfData = reactive(generateFormModel());
  let data = [
    { label: '商品名称', value: formModel.value.skuName },
    { label: '商品图片', value: formModel.value.imgUrl },
    { label: '供应商名称', value: formModel.value.supplierName },
    { label: '供应商ID', value: formModel.value.supplierId },
    { label: '仓库ID', value: formModel.value.wareId },
    { label: '创建时间', value: formModel.value.createTime },
    { label: '商品价格', value: formModel.value.skuPrice },
    { label: '更新时间', value: formModel.value.updateTime },
    { label: '购货单ID', value: formModel.value.id },
    { label: '商品ID', value: formModel.value.skuId },
    { label: '商品数量', value: formModel.value.skuNum },
  ];

  const printVisible = ref(false);
  const printClick = (purchaseOrder: PurchaseOrder) => {
    copy(purchaseOrder, pdfData);
    data = [
      {
        label: '购货单标识',
        value: pdfData.id,
      },
      {
        label: '区域中心仓库标识',
        value: pdfData.wareId,
      },
      {
        label: '供应商标识',
        value: pdfData.supplierId,
      },
      {
        label: '供应商名称',
        value: pdfData.supplierName,
      },
      {
        label: '创建时间',
        value: pdfData.createTime,
      },
      {
        label: '更新时间',
        value: pdfData.updateTime,
      },
      {
        label: '商品编号',
        value: pdfData.skuId,
      },
      {
        label: '商品数量',
        value: pdfData.skuNum,
      },
      {
        label: '商品名称',
        value: pdfData.skuName,
      },
      {
        label: '商品价格',
        value: pdfData.skuPrice,
      },
      {
        label: '商品图片',
        value: pdfData.imgUrl,
      },
    ];
    setTimeout(() => {
      printVisible.value = true;
    }, 20);
  };
  const printBeforeOk = () => {
    console.log('打印');
    const text = '购货单详情';
    // text:文件标题
    htmlToPdf(text, '#capture');
  };
  const printCancel = () => {
    printVisible.value = false;
  };

  // 整个分发单列表打印
  const downloadPurchaseOrderList = () => {
    const text = '所有分发单信息';
    // text:文件标题
    htmlToPdf(text, '#printTable');
  };
  // 整个分发单列表打印
  // 描述列表展示打印信息

  // 表单展示打印信息
  // const visible = ref(false);
  // const handleClick = (purchaseOrder: PurchaseOrder) => {
  //   console.log('~~~~~~~purchaseOrder:');
  //   console.log(purchaseOrder);
  //   copy(purchaseOrder, form);
  //   visible.value = true;
  // };
  // const handleBeforeOk = async () => {
  //   await console.log('ok');
  //   visible.value = false;
  // };
  // const handleCancel = () => {
  //   visible.value = false;
  // };
  // 表单展示打印信息

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const size = ref<SizeProps>('medium');
  // 展示分发单信息表格
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('PurchaseOrder.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
      width: 50,
      fixed: 'left',
    },
    {
      title: t('PurchaseOrder.columns.id'),
      dataIndex: 'id',
      width: 70,
      fixed: 'left',
    },
    // {
    //   title: t('PurchaseOrder.columns.wareId'),
    //   dataIndex: 'wareId',
    // },
    {
      title: t('PurchaseOrder.columns.skuId'),
      dataIndex: 'skuId',
      width: 100,
    },
    {
      title: t('PurchaseOrder.columns.skuName'),
      dataIndex: 'skuName',
      slotName: 'skuName',
      width: 110,
    },
    {
      title: t('PurchaseOrder.columns.skuImg'),
      dataIndex: 'imgUrl',
      slotName: 'imgUrl',
    },
    {
      title: t('PurchaseOrder.columns.skuNum'),
      dataIndex: 'skuNum',
      width: 100,
    },
    {
      title: t('PurchaseOrder.columns.skuPrice'),
      dataIndex: 'skuPrice',
      width: 100,
    },
    {
      title: t('PurchaseOrder.columns.supplierId'),
      dataIndex: 'supplierId',
      width: 110,
    },
    {
      title: t('PurchaseOrder.columns.supplierName'),
      dataIndex: 'supplierName',
      slotName: 'supplierName',
    },
    {
      title: t('PurchaseOrder.columns.createTime'),
      dataIndex: 'createTime',
    },
    {
      title: t('PurchaseOrder.columns.updateTime'),
      dataIndex: 'updateTime',
    },
    {
      title: t('PurchaseOrder.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      width: 100,
      fixed: 'right',
    },
  ]);

  // 分页
  const fetchData = async (
    current: number,
    pageSize: number,
    params: Partial<PurchaseOrder>
  ) => {
    setLoading(true);
    try {
      const { data } = await queryPurchaseOrderList(current, pageSize, params);
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

  // 密度选择
  const densityList = computed(() => [
    {
      name: t('PurchaseOrder.size.mini'),
      value: 'mini',
    },
    {
      name: t('PurchaseOrder.size.small'),
      value: 'small',
    },
    {
      name: t('PurchaseOrder.size.medium'),
      value: 'medium',
    },
    {
      name: t('PurchaseOrder.size.large'),
      value: 'large',
    },
  ]);
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
    name: 'PurchaseOrder',
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
