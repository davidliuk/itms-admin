<template>
  <div class="container">
    <Breadcrumb :items="['menu.finance', 'menu.finance.settlement']" />
    <a-card class="general-card" :title="$t('menu.finance.settlement')">
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
                <a-form-item
                  field="number"
                  :label="$t('settlement.form.number')"
                >
                  <a-input
                    v-model="formModel.id"
                    :placeholder="$t('settlement.form.number.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="userName"
                  :label="$t('settlement.form.userName')"
                >
                  <a-input
                    v-model="formModel.userName"
                    :placeholder="$t('settlement.form.userName.placeholder')"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button
              type="primary"
              @click="searchSettlementBy(formModel.id, formModel.userName)"
            >
              <template #icon>
                <icon-search />
              </template>
              {{ $t('settlement.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('settlement.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col
          :span="12"
          style="display: flex; align-items: center; justify-content: end"
        >
          <a-button>
            <template #icon>
              <icon-download />
            </template>
            {{ $t('settlement.operation.download') }}
          </a-button>
          <a-tooltip :content="$t('settlement.actions.refresh')">
            <div class="action-icon" @click="fresh"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="$t('settlement.actions.density')">
              <div class="action-icon"><icon-line-height size="18" /></div>
            </a-tooltip>
            <template #content>
              <a-doption
                v-for="item in densitylist"
                :key="item.value"
                :value="item.value"
                :class="{ active: item.value === size }"
              >
                <span>{{ item.name }}</span>
              </a-doption>
            </template>
          </a-dropdown>
          <a-tooltip :content="$t('settlement.actions.columnSetting')">
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
        <!-- 分页 -->
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>

        <!-- 表格form里 -->
        <template #status="{ record }">
          <span v-if="record.status === 'CANCEL'" class="circle"></span>
          <span v-else-if="record.status === 'USED'" class="circle pass"></span>
          <span
            v-else-if="record.status === 'UNUSED'"
            class="circle pass"
          ></span>
          {{ $t(`settlement.form.status.${record.status}`) }}
        </template>

        <!-- 表格form里 -->

        <template #operations="{ record }">
          <a-button type="text" size="small" @click="detailOrderData(record.id)"
            >查看详情</a-button
          >
          <a-modal
            ok-text="打印"
            :visible="printVisible"
            title="订单详情"
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
              :data="detailData"
              :size="pdfSize"
              title="详情"
              :column="1"
            ></a-descriptions>
          </a-modal>
        </template>

        <!-- table里 -->
        <!-- 删改 -->

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
    querySettlementList,
    Settlement,
    searchSettlementList,
    queryOrderDetailList,
    OrderDetail,
  } from '@/api/finance';

  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import { addAdmin, Admin, deleteAdmin, updateAdmin } from '@/api/acl';
  import copy from '@/utils/objects';
  import { CheckOrder } from '@/api/center';
  import htmlToPdf from '@/utils/pdf';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const generateFormModel = () => {
    return {
      id: '',
      orderId: '',
      courierId: '',
      userName: '',
      userId: '',
      stationId: '',
      totalAmount: '',
      status: '',
    };
  };

  const isCreating = ref(false);
  const isUpdating = ref(false);

  let form = reactive(generateFormModel());

  const handleClose = () => {
    isCreating.value = false;
    isUpdating.value = false;
    form = reactive(generateFormModel());
  };

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<Settlement[]>([]);
  const newData = ref<OrderDetail[]>([]);
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
  const densitylist = computed(() => [
    {
      name: t('settlement.size.mini'),
      value: 'mini',
    },
    {
      name: t('settlement.size.small'),
      value: 'small',
    },
    {
      name: t('settlement.size.medium'),
      value: 'medium',
    },
    {
      name: t('settlement.size.large'),
      value: 'large',
    },
  ]);
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('settlement.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
    },
    {
      title: t('settlement.columns.number'),
      dataIndex: 'id',
    },
    {
      title: t('settlement.columns.stationId'),
      dataIndex: 'stationId',
    },

    {
      title: t('settlement.columns.courierId'),
      dataIndex: 'courierId',
    },
    {
      title: t('settlement.columns.userId'),
      dataIndex: 'userId',
    },
    {
      title: t('settlement.columns.userName'),
      dataIndex: 'userName',
    },
    {
      title: t('settlement.columns.totalAmount'),
      dataIndex: 'totalAmount',
    },
    {
      title: t('settlement.columns.category'),
      dataIndex: 'status',
      slotName: 'status',
    },
    {
      title: t('invoice.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);
  const contentTypeOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('settlement.form.contentType.img'),
      value: 'img',
    },
    {
      label: t('settlement.form.contentType.horizontalVideo'),
      value: 'horizontalVideo',
    },
    {
      label: t('settlement.form.contentType.verticalVideo'),
      value: 'verticalVideo',
    },
  ]);

  const fetchData = async (
    page: number,
    pageSize: number,
    params: Partial<Settlement>
  ) => {
    setLoading(true);
    try {
      const { data } = await querySettlementList(page, pageSize, params);
      renderData.value = data.records;
      pagination.current = page;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const detailOrderData = async (orderId: string) => {
    setLoading(true);
    const { data } = await queryOrderDetailList(orderId);
    detailData = [
      { label: '用户昵称', value: data.nickName },
      { label: '订单编号', value: data.orderNo },
      { label: '订单类型', value: data.orderType },
      { label: '订单状态', value: data.orderStatus },
      { label: '支付类型', value: data.payType },
      { label: '原价', value: data.originalTotalAmount },
      { label: '优惠券', value: data.couponId },
      { label: '支付金额', value: data.totalAmount },
      { label: '支付类型', value: data.payType },
      { label: '配送状态', value: data.processStatus },
      { label: '配送员名称', value: data.courierName },
      { label: '配送员电话', value: data.courierPhone },
      { label: '配送地址', value: data.receiverAddress },
      { label: '配送电话', value: data.receiverPhone },
      { label: '退款原因', value: data.cancelReason },
    ];
    setTimeout(() => {
      printVisible.value = true;
    }, 500);
  };

  const searchData = async (
    page: number,
    pageSize: number,
    id: string,
    userName: string
  ) => {
    setLoading(true);

    try {
      const { data } = await searchSettlementList(page, pageSize, id, userName);
      renderData.value = data.records;
      pagination.current = page;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const pdfSize = ref('medium');
  let detailData = [
    { label: '用户昵称', value: '' },
    { label: '订单编号', value: '' },
    { label: '订单类型', value: '' },
    { label: '订单状态', value: '' },
    { label: '支付类型', value: '' },
    { label: '原价', value: '' },
    { label: '优惠券', value: '' },
    { label: '支付金额', value: '' },
    { label: '支付类型', value: '' },
    { label: '配送状态', value: '' },
    { label: '配送员名称', value: '' },
    { label: '配送员电话', value: '' },
    { label: '配送地址', value: '' },
    { label: '配送电话', value: '' },
    { label: '退款原因', value: '' },
  ];

  const printVisible = ref(false);

  const printBeforeOk = () => {
    console.log('打印');
    const text = '订单详情';
    // text:文件标题
    htmlToPdf(text, '#capture');
  };
  const printCancel = () => {
    printVisible.value = false;
  };

  const searchSettlementBy = (id: string, userName: string) => {
    searchData(pagination.current, pagination.pageSize, id, userName);
  };

  const search = () => {
    fetchData(basePagination.current, basePagination.pageSize, formModel.value);
  };

  const fresh = () => {
    fetchData(basePagination.current, basePagination.pageSize, formModel.value);
  };

  const onPageChange = (current: number) => {
    fetchData(current, basePagination.pageSize, formModel.value);
  };
  fetchData(pagination.current, pagination.pageSize, formModel.value);
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

  const exchangeArray = <T extends Array<any>>(
    array: T,
    beforeIdx: number,
    newIdx: number,
    isDeep = false
  ): T => {
    const newArray = isDeep ? cloneDeep(array) : array;
    if (beforeIdx > -1 && newIdx > -1) {
      // 先替换后面的，然后拿到替换的结果替换前面
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
    name: 'Settlement',
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
