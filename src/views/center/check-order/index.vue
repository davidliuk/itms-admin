<template>
  <div class="container">
    <Breadcrumb :items="['menu.center', 'menu.center.CheckOrder']" />
    <a-card class="general-card" :title="$t('menu.center.CheckOrder')">
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
                <a-form-item field="id" :label="$t('CheckOrder.form.id')">
                  <a-input
                    v-model="formModel.id"
                    :placeholder="$t('CheckOrder.form.id.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="wareId"
                  :label="$t('CheckOrder.form.wareId')"
                >
                  <a-input
                    v-model="formModel.wareId"
                    :placeholder="$t('CheckOrder.form.wareId.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="stationId"
                  :label="$t('CheckOrder.form.stationId')"
                >
                  <a-input
                    v-model="formModel.stationId"
                    :placeholder="$t('CheckOrder.form.stationId.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="status"
                  :label="$t('CheckOrder.form.status')"
                >
                  <a-select
                    v-model="formModel.status"
                    :options="statusOptions"
                    :placeholder="$t('CheckOrder.form.selectDefault')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="inTime"
                  :label="$t('CheckOrder.form.inTime')"
                >
                  <a-date-picker
                    v-model="formModel.inTime"
                    style="width: 100%"
                    show-time
                    :time-picker-props="{ defaultValue: '00:00:00' }"
                    format="YYYY-MM-DD HH:mm:ss"
                    :placeholder="$t('CheckOrder.form.inTime.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="outTime"
                  :label="$t('CheckOrder.form.outTime')"
                >
                  <a-date-picker
                    v-model="formModel.outTime"
                    style="width: 100%"
                    show-time
                    :time-picker-props="{ defaultValue: '00:00:00' }"
                    format="YYYY-MM-DD HH:mm:ss"
                    :placeholder="$t('CheckOrder.form.outTime.placeholder')"
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
              {{ $t('CheckOrder.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('CheckOrder.form.reset') }}
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
            <!--            <a-button type="primary">-->
            <!--              <template #icon>-->
            <!--                <icon-plus />-->
            <!--              </template>-->
            <!--              {{ $t('CheckOrder.operation.create') }}-->
            <!--            </a-button>-->
            <a-upload @before-upload="(file: File) => {
                formCSV(file, (order: any) => {
                    order.forEach((order: CheckOrder) => {
                      addCheckOrder(CheckOrder);
                    });
                    return true;
                  });
                }">
              <template #upload-button>
                <a-button type="primary">
                  {{ $t('CheckOrder.operation.import') }}
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
          <a-button @click="downloadCheckOrderList">
            <template #icon>
              <icon-download />
            </template>
            {{ $t('CheckOrder.operation.download') }}
          </a-button>
          <a-tooltip :content="$t('CheckOrder.actions.refresh')">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <!-- 密度 -->
            <a-tooltip :content="$t('CheckOrder.actions.density')">
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
          <a-tooltip :content="$t('CheckOrder.actions.columnSetting')">
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
        @page-change="onPageChange"
      >
        <!-- # -->
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
        <!-- 状态类型 -->
        <template #status="{ record }">
          <span v-if="record.status === 'OUT'" class="circle"></span>
          <span v-else-if="record.status === 'IN'" class="circle pass"></span>
          <span
            v-else-if="record.status === 'CANCEL'"
            class="circle pass"
          ></span>
          {{ $t(`CheckOrder.form.status.${record.status}`) }}
        </template>
        <template #type="{ record }">
          <span v-if="record.type === 'DELIVERY'" class="circle"></span>
          <span
            v-else-if="record.type === 'EXCHANGE'"
            class="circle pass"
          ></span>
          <span v-else-if="record.type === 'RETURN'" class="circle pass"></span>
          {{ $t(`CheckOrder.form.type.${record.type}`) }}
        </template>
        <!-- 打印 -->
        <template #operations="{ record }">
          <a-popconfirm
            content="是否确认出库?"
            type="warning"
            @ok="checkOrderReturnInWare(record.orderId)"
            @cancel="handleCancelReturnInWare"
          >
            <a-button
              v-if="record.type === 'RETURN'"
              v-permission="['admin']"
              type="text"
              size="small"
              class="red-button"
            >
              退货入库
            </a-button>
          </a-popconfirm>

          <a-button
            v-if="record.type !== 'RETURN'"
            type="text"
            size="small"
            @click="printClick(record)"
            >打印分发单</a-button
          >
          <a-modal
            ok-text="打印"
            :visible="printVisible"
            title="分发单详情"
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
        </template>
        <template #skuDetails="{ record }">
          <!--  分发单商品详情 -->
          <a-button
            v-permission="['admin']"
            type="text"
            size="small"
            @click="SkuDetail(record.orderId)"
          >
            {{ $t('CheckOrder.columns.operations.view') }}
          </a-button>
          <a-modal
            v-model:visible="visible"
            @ok="handleOk"
            @cancel="handleCancel"
          >
            <template #title> 分发单商品详情 </template>
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
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, nextTick } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import {
    queryCheckOrderList,
    CheckOrder,
    queryOrderInfo,
    OrderItem,
    checkorderReturnInWareByOrderId, addCheckOrder
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

  // 退货入库
  const visibleReturnInWare = ref(false);
  const checkOrderReturnInWare = async (orderId: number) => {
    setLoading(true);
    try {
      const { data } = await checkorderReturnInWareByOrderId(orderId);
      visibleReturnInWare.value = false;
      console.log(data);
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      fetchData(
        basePagination.current,
        basePagination.pageSize,
        formModel.value
      );
      setLoading(false);
    }
  };
  const handleCancelReturnInWare = () => {
    visibleReturnInWare.value = false;
  };
  // 退货入库

  // 描述列表展示打印信息
  const pdfSize = ref('medium');
  let data = [
    { label: '分发单标识', value: '' },
    { label: '订单标识', value: '' },
    { label: '任务单标识', value: '' },
    { label: '区域中心仓库标识', value: '' },
    { label: '分站标识', value: '' },
    { label: '分发单状态', value: '' },
    { label: '分发单类型', value: '' },
    { label: '出站时间', value: '' },
    { label: '入站时间', value: '' },
  ];
  const printVisible = ref(false);
  const printClick = (checkOrder: CheckOrder) => {
    data = [
      { label: '分发单标识', value: checkOrder.id.toString() },
      { label: '订单标识', value: checkOrder.orderId.toString() },
      { label: '仓库标识', value: checkOrder.wareId.toString() },
      { label: '任务单标识', value: checkOrder.workOrderId.toString() },
      { label: '分站标识', value: checkOrder.stationId.toString() },
      {
        label: '分发单状态',
        value: t(`CheckOrder.form.status.${checkOrder.status}`),
      },
      {
        label: '分发单类型',
        value: t(`CheckOrder.form.type.${checkOrder.type}`),
      },
      { label: '更新时间', value: checkOrder.inTime },
      { label: '创建时间', value: checkOrder.outTime },
    ];
    setTimeout(() => {
      printVisible.value = true;
    }, 500);
  };
  const printBeforeOk = () => {
    console.log('打印');
    const text = '分发单详情'; // text:文件标题
    htmlToPdf(text, '#capture');
  };
  const printCancel = () => {
    printVisible.value = false;
  };
  // 描述列表展示打印信息

  // 整个分发单列表打印
  const downloadCheckOrderList = () => {
    const text = '所有分发单信息';
    // text:文件标题
    htmlToPdf(text, '#printTable');
  };
  // 整个分发单列表打印

  const generateFormModel = () => {
    return {
      id: '',
      wareId: '',
      stationId: '',
      status: null,
      // 0:未分发,1:已分发,2:已入库
      inTime: null,
      outTime: null,
    };
  };
  const formModel = ref(generateFormModel()); // 输入框要用的
  const generateorderItemModel = () => {
    return {
      orderItemList: [],
    };
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<CheckOrder[]>([]);
  const orderItemData = ref<OrderItem[]>([]);

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

  // 密度选择
  const densityList = computed(() => [
    {
      name: t('CheckOrder.size.mini'),
      value: 'mini',
    },
    {
      name: t('CheckOrder.size.small'),
      value: 'small',
    },
    {
      name: t('CheckOrder.size.medium'),
      value: 'medium',
    },
    {
      name: t('CheckOrder.size.large'),
      value: 'large',
    },
  ]);

  // 展示分发单信息表格
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('CheckOrder.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
    },
    {
      title: t('CheckOrder.columns.id'),
      dataIndex: 'id',
    },
    {
      title: t('CheckOrder.columns.orderId'),
      dataIndex: 'orderId',
    },
    // {
    //   title: t('CheckOrder.columns.wareId'),
    //   dataIndex: 'wareId',
    // },
    {
      title: t('CheckOrder.columns.stationId'),
      dataIndex: 'stationId',
      slotName: 'stationId',
    },
    {
      title: t('CheckOrder.columns.status'),
      dataIndex: 'status',
      slotName: 'status',
    },
    {
      title: t('CheckOrder.columns.type'),
      dataIndex: 'type',
      slotName: 'type',
    },
    {
      title: t('CheckOrder.columns.inTime'),
      dataIndex: 'inTime',
    },
    {
      title: t('CheckOrder.columns.outTime'),
      dataIndex: 'outTime',
    },
    // {
    //   title: t('CheckOrder.columns.createTime'),
    //   dataIndex: 'createTime',
    // },{
    //   title: t('CheckOrder.columns.updateTime'),
    //   dataIndex: 'updateTime',
    // },
    {
      title: t('CheckOrder.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
    {
      title: t('CheckOrder.columns.skuDetails'),
      dataIndex: 'skuDetails',
      slotName: 'skuDetails',
    },
  ]);
  // 搜索状态输入框下拉列表
  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('CheckOrder.form.status.OUT'),
      value: 'OUT',
    },
    {
      label: t('CheckOrder.form.status.IN'),
      value: 'IN',
    },
    {
      label: t('CheckOrder.form.status.CANCEL'),
      value: 'CANCEL',
    },
  ]);

  // 展示商品的表格内容
  const Skucolumns = computed<TableColumnData[]>(() => [
    {
      title: t('CheckOrder.columns.skuId'),
      dataIndex: 'skuId',
    },
    {
      title: t('CheckOrder.columns.skuName'),
      dataIndex: 'skuName',
      slotName: 'skuName',
    },
    {
      title: t('CheckOrder.columns.skuImg'),
      dataIndex: 'imgUrl',
      slotName: 'imgUrl',
    },
    {
      title: t('CheckOrder.columns.skuNum'),
      dataIndex: 'skuNum',
    },
    {
      title: t('CheckOrder.columns.skuPrice'),
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
  const fetchData = async (
    current: number,
    pageSize: number,
    params: Partial<CheckOrder>
  ) => {
    setLoading(true);
    try {
      const { data } = await queryCheckOrderList(current, pageSize, params);
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
    name: 'CheckOrder',
  };
</script>

<style scoped lang="less">
  .red-button {
    color: rebeccapurple;
  }
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
