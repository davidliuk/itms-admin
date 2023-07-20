<template>
  <div class="container">
    <Breadcrumb :items="['menu.station', 'menu.station.TransferTable']" />
    <a-card class="general-card" :title="$t('menu.station.TransferTable')">
      <a-row>
        <!-- 6个输入框 -->
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 7 }"
            :wrapper-col-props="{ span: 17 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="id" :label="$t('TransferTable.form.id')">
                  <a-input
                    v-model="formModel.id"
                    :placeholder="$t('TransferTable.form.id.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="orderId"
                  :label="$t('TransferTable.form.orderId')"
                >
                  <a-input
                    v-model="formModel.orderId"
                    :placeholder="$t('TransferTable.form.orderId.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="wareId"
                  :label="$t('TransferTable.form.wareId')"
                >
                  <a-input
                    v-model="formModel.wareId"
                    :placeholder="$t('TransferTable.form.wareId.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="workOrderId"
                  :label="$t('TransferTable.form.workOrderId')"
                >
                  <a-input
                    v-model="formModel.workOrderId"
                    :placeholder="
                      $t('TransferTable.form.workOrderId.placeholder')
                    "
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="type"
                  :label="$t('TransferTable.form.type')"
                >
                  <a-select
                    v-model="formModel.type"
                    :options="typeOptions"
                    :placeholder="$t('TransferTable.form.type.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="status"
                  :label="$t('TransferTable.form.status')"
                >
                  <a-select
                    v-model="formModel.status"
                    :options="statusOptions"
                    :placeholder="$t('TransferTable.form.status.placeholder')"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <!-- 表格上面的一排按钮 -->
      <a-row style="margin-bottom: 16px">
        <!-- 查询重置-->
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('TransferTable.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('TransferTable.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
        <!-- 表格上面的下载设置等 -->
        <a-col
          :span="12"
          style="display: flex; align-items: center; justify-content: end"
        >
          <a-button
            @click="
              (ev) => {
                toCSV(renderData, 'transfer-table');
              }
            "
          >
            <template #icon>
              <icon-download />
            </template>
            {{ $t('TransferTable.operation.download') }}
          </a-button>
          <a-tooltip :content="$t('TransferTable.actions.refresh')">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <!-- 密度 -->
            <a-tooltip :content="$t('TransferTable.actions.density')">
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
          <a-tooltip :content="$t('TransferTable.actions.columnSetting')">
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

        <!-- table里 -->
        <!-- 状态 -->
        <template #status="{ record }">
          <span v-if="record.status === 'DISPATCH'" class="circle"></span>
          <span v-else-if="record.status === 'OUT'" class="circle pass"></span>
          <span v-else-if="record.status === 'IN'" class="circle pass"></span>
          <span
            v-else-if="record.status === 'CANCEL'"
            class="circle pass"
          ></span>
          {{ $t(`TransferTable.form.status.${record.status}`) }}
        </template>
        <template #type="{ record }">
          <span v-if="record.type === 'DELIVERY'" class="circle"></span>
          <span
            v-else-if="record.type === 'EXCHANGE'"
            class="circle pass"
          ></span>
          <span v-else-if="record.type === 'RETURN'" class="circle pass"></span>
          {{ $t(`TransferTable.form.type.${record.type}`) }}
        </template>

        <!-- 查看 -->
        <template #operations="{ record }">
          <!--          查看商品详情-->
          <a-button
            v-permission="['admin']"
            type="text"
            size="small"
            @click="SkuDetail(record.orderId)"
          >
            <template #icon>
              <icon-link />
            </template>
            {{ $t('TransferTable.columns.operations.view') }}
          </a-button>
          <!--          <template v-if="record.status === 'IN' && record.type === 'DELIVERY'">-->
          <!--            <a-button-->
          <!--              v-permission="['admin']"-->
          <!--              type="text"-->
          <!--              size="small"-->
          <!--              @click="transferOutStation(record.orderId)"-->
          <!--            >-->
          <!--              {{ $t('TransferTable.columns.operations.returnWare') }}-->
          <!--            </a-button>-->
          <!--            &lt;!&ndash;            <a-popconfirm&ndash;&gt;-->
          <!--            &lt;!&ndash;              content="是否确认出库?"&ndash;&gt;-->
          <!--            &lt;!&ndash;              type="warning"&ndash;&gt;-->
          <!--            &lt;!&ndash;              @ok="transferOutStation(record.orderId)"&ndash;&gt;-->
          <!--            &lt;!&ndash;            >&ndash;&gt;-->
          <!--            &lt;!&ndash;              <a-button v-permission="['admin']" type="text" size="small">&ndash;&gt;-->
          <!--            &lt;!&ndash;                {{ $t(`TransferTable.columns.operations.returnWare`) }}&ndash;&gt;-->
          <!--            &lt;!&ndash;              </a-button>&ndash;&gt;-->
          <!--            &lt;!&ndash;            </a-popconfirm>&ndash;&gt;-->
          <!--          </template>-->
          <a-modal
            v-model:visible="visible"
            @ok="handleOk"
            @cancel="handleCancel"
          >
            <template #title> 验收单商品详情 </template>
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
    queryTransferOrderList,
    TransferOrder,
    queryOrderInfo,
    OrderItem,
  } from '@/api/center';
  import { outTransferOrder, inTransferOrder } from '@/api/station';
  import { Pagination } from '@/types/global';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import htmlToPdf from '@/utils/pdf';
  import { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import { toCSV } from '@/utils/csv';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const generateFormModel = () => {
    return {
      // 后端所有的查询条件
      id: '',
      wareId: '',
      stationId: '',
      stationName: '',
      orderId: '',
      workOrderId: '',
      logisticsId: '',
      logisticsName: '',
      type: null,
    };
  };
  const generateorderItemModel = () => {
    return {
      orderItemList: [],
    };
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<TransferOrder[]>([]);
  const orderItemData = ref<OrderItem[]>([]);
  const formModel = ref(generateFormModel()); // 输入框要用的
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);

  // 调拨出库
  // const transferOutStation = async (orderId: number) => {
  //   setLoading(true);
  //   try {
  //     const { data } = await outTransferOrder(orderId);
  //     console.log(data);
  //   } catch (err) {
  //     // you can report use errorHandler or other
  //   } finally {
  //     fetchData(
  //       basePagination.current,
  //       basePagination.pageSize,
  //       formModel.value
  //     );
  //     setLoading(false);
  //   }
  // };
  // const handleCancelOutWare = () => {
  //
  // };
  // 调拨出库
  // 密度选择
  const densityList = computed(() => [
    {
      name: t('TransferTable.size.mini'),
      value: 'mini',
    },
    {
      name: t('TransferTable.size.small'),
      value: 'small',
    },
    {
      name: t('TransferTable.size.medium'),
      value: 'medium',
    },
    {
      name: t('TransferTable.size.large'),
      value: 'large',
    },
  ]);
  // 展示分发单信息表格
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('TransferTable.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
    },
    {
      title: t('TransferTable.columns.id'),
      dataIndex: 'id',
    },
    {
      title: t('TransferTable.columns.orderId'),
      dataIndex: 'orderId',
    },
    {
      title: t('TransferTable.columns.workOrderId'),
      dataIndex: 'workOrderId',
    },
    {
      title: t('TransferTable.columns.wareId'),
      dataIndex: 'wareId',
    },
    // {
    //   title: t('TransferTable.columns.stationId'),
    //   dataIndex: 'stationId',
    //   slotName: 'stationId',
    // },
    // {
    //   title: t('TransferTable.columns.stationName'),
    //   dataIndex: 'stationName',
    // },
    {
      title: t('TransferTable.columns.status'),
      dataIndex: 'status',
      slotName: 'status',
    },
    {
      title: t('TransferTable.columns.type'),
      dataIndex: 'type',
      slotName: 'type',
    },
    // {
    //   title: t('TransferTable.columns.logisticsId'),
    //   dataIndex: 'logisticsId',
    //   slotName: 'logisticsId',
    // },
    // {
    //   title: t('TransferTable.columns.logisticsName'),
    //   dataIndex: 'logisticsName',
    // },
    // {
    //   title: t('TransferTable.columns.logisticsPhone'),
    //   dataIndex: 'logisticsPhone',
    // },
    {
      title: t('TransferTable.columns.inTime'),
      dataIndex: 'inTime',
    },
    {
      title: t('TransferTable.columns.outTime'),
      dataIndex: 'outTime',
    },
    {
      title: t('TransferTable.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);
  // 展示商品的表格内容
  const Skucolumns = computed<TableColumnData[]>(() => [
    {
      title: t('TransferTable.columns.skuId'),
      dataIndex: 'skuId',
    },
    {
      title: t('TransferTable.columns.skuName'),
      dataIndex: 'skuName',
      slotName: 'skuName',
    },
    {
      title: t('TransferTable.columns.skuImg'),
      dataIndex: 'imgUrl',
      slotName: 'imgUrl',
    },
    {
      title: t('TransferTable.columns.skuNum'),
      dataIndex: 'skuNum',
    },
    {
      title: t('TransferTable.columns.skuPrice'),
      dataIndex: 'skuPrice',
    },
  ]);
  // 选择类型
  const typeOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('TransferTable.form.type.DELIVERY'),
      value: 'DELIVERY',
    },
    {
      label: t('TransferTable.form.type.EXCHANGE'),
      value: 'EXCHANGE',
    },
    {
      label: t('TransferTable.form.type.RETURN'),
      value: 'RETURN',
    },
  ]);
  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('TransferTable.form.status.DISPATCH'),
      value: 'DISPATCH',
    },
    {
      label: t('TransferTable.form.status.OUT'),
      value: 'OUT',
    },
    {
      label: t('TransferTable.form.status.IN'),
      value: 'IN',
    },
    {
      label: t('TransferTable.form.status.CANCEL'),
      value: 'CANCEL',
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
    pageSize: 10,
  };
  const pagination = reactive({
    ...basePagination,
  });
  const fetchData = async (
    current: number,
    pageSize: number,
    params: Partial<TransferOrder>
  ) => {
    setLoading(true);
    try {
      const { data } = await queryTransferOrderList(current, pageSize, params);
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
  const size = ref<SizeProps>('medium');
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
    name: 'TransferTable',
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
