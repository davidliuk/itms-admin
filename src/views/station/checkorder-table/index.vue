<template>
  <div class="container">
    <Breadcrumb :items="['menu.station', 'menu.station.CheckOrderTable']" />
    <a-card class="general-card" :title="$t('menu.station.CheckOrderTable')">
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
                  field="id"
                  :label="$t('CheckOrderTable.form.id')">
                  <a-input
                    v-model="formModel.id"
                    :placeholder="$t('CheckOrderTable.form.id.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="stationId"
                  :label="$t('CheckOrderTable.form.stationId')"
                >
                  <a-input
                    v-model="formModel.stationId"
                    :placeholder="
                      $t('CheckOrderTable.form.stationId.placeholder')
                    "
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="workOrderId"
                  :label="$t('CheckOrderTable.form.workOrderId')"
                >
                  <a-input
                    v-model="formModel.workOrderId"
                    :placeholder="
                      $t('CheckOrderTable.form.workOrderId.placeholder')
                    "
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="orderId"
                  :label="$t('CheckOrderTable.form.orderId')"
                >
                  <a-input
                    v-model="formModel.wareId"
                    :placeholder="$t('CheckOrderTable.form.orderId.placeholder')"
                  />
                </a-form-item>
              </a-col>
<!--              <a-col :span="8">-->
<!--              <a-form-item-->
<!--                field="type"-->
<!--                :label="$t('CheckOrderTable.form.type')"-->
<!--              >-->
<!--                <a-select-->
<!--                  v-model="formModel.type"-->
<!--                  :options="typeOptions"-->
<!--                  :placeholder="$t('CheckOrderTable.form.selectDefault')"-->
<!--                />-->
<!--              </a-form-item>-->
<!--            </a-col>-->
              <a-col :span="8">
                <a-form-item
                  field="status"
                  :label="$t('CheckOrderTable.form.status')"
                >
                  <a-select
                    v-model="formModel.status"
                    :options="statusOptions"
                    :placeholder="$t('CheckOrderTable.form.selectDefault')"
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
        <!-- 查找重置按钮 -->
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('CheckOrderTable.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('CheckOrderTable.form.reset') }}
            </a-button>
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
            {{ $t('CheckOrderTable.operation.download') }}
          </a-button>
          <a-tooltip :content="$t('CheckOrderTable.actions.refresh')">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <!-- 密度 -->
            <a-tooltip :content="$t('CheckOrderTable.actions.density')">
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
          <a-tooltip :content="$t('CheckOrderTable.actions.columnSetting')">
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
        <!-- 分页 -->
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
        <!-- 查看 -->
        <template #operations="{ record }">
          <a-button
            v-permission="['admin']"
            type="text"
            size="small"
            @click="SkuDetail(record.orderId)"
          >
            {{ $t('CheckOrderTable.columns.operations.view') }}
          </a-button>
          <a-modal
            v-model:visible="visible"
            draggable
            hide-cancel
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
          <template v-if="record.status === 'OUT'">
            <a-button
              v-permission="['admin']"
              type="text"
              size="small"
              @click="inCheckOrderById(record.orderId)"
            >
              {{ $t('CheckOrderTable.columns.operations.in') }}
            </a-button>
          </template>
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
  import { inCheckOrder } from '@/api/station';
  import {
    queryOrderInfo,
    OrderItem,
    queryCheckOrderList,
    CheckOrder,
  } from '@/api/center';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const generateFormModel = () => {
    return {
      id: '',
      orderId: '',
      workOrderId:'',
      stationId: '',
      status: null,
      // type:null,
    };
  };

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<CheckOrder[]>([]);
  const orderItemData = ref<OrderItem[]>([]);
  const formModel = ref(generateFormModel()); // 输入框要用的
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);

  const size = ref<SizeProps>('medium');

  const basePagination: Pagination = {
    current: 1,
    pageSize: 10,
  };
  const pagination = reactive({
    ...basePagination,
  });

  // 密度选择
  const densityList = computed(() => [
    {
      name: t('CheckOrderTable.size.mini'),
      value: 'mini',
    },
    {
      name: t('CheckOrderTable.size.small'),
      value: 'small',
    },
    {
      name: t('CheckOrderTable.size.medium'),
      value: 'medium',
    },
    {
      name: t('CheckOrderTable.size.large'),
      value: 'large',
    },
  ]);

  // 展示分发单信息表格
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('CheckOrderTable.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
    },
    {
      title: t('CheckOrderTable.columns.id'),
      dataIndex: 'id',
    },
    {
      title: t('CheckOrderTable.columns.wareId'),
      dataIndex: 'wareId',
    },
    {
      title: t('CheckOrderTable.columns.stationId'),
      dataIndex: 'stationId',
      slotName: 'stationId',
    },
    {
      title: t('CheckOrderTable.columns.orderId'),
      dataIndex: 'orderId',
    },
    {
      title: t('CheckOrderTable.columns.outTime'),
      dataIndex: 'outTime',
    },
    {
      title: t('CheckOrderTable.columns.type'),
      dataIndex: 'type',
    },
    {
      title: t('CheckOrderTable.columns.status'),
      dataIndex: 'status',
    },
    {
      title: t('CheckOrderTable.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);
  // 搜索状态输入框下拉列表
  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('CheckOrderTable.form.status.OUT'),
      value: 'OUT',
    },
    {
      label: t('CheckOrderTable.form.status.IN'),
      value: 'IN',
    },
    {
      label: t('CheckOrderTable.form.status.CANCEL'),
      value: 'CANCEL',
    },
  ]);
  const typeOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('CheckOrderTable.form.type.DELIVERY'),
      value: 'DELIVERY',
    },
    {
      label: t('CheckOrderTable.form.type.EXCHANGE'),
      value: 'EXCHANGE',
    },
    {
      label: t('CheckOrderTable.form.type.RETURN'),
      value: 'RETURN',
    },
  ]);
  // 展示商品的表格内容
  const Skucolumns = computed<TableColumnData[]>(() => [
    {
      title: t('CheckOrderTable.columns.skuId'),
      dataIndex: 'skuId',
    },
    {
      title: t('CheckOrderTable.columns.skuName'),
      dataIndex: 'skuName',
      slotName: 'skuName',
    },
    {
      title: t('CheckOrderTable.columns.skuImg'),
      dataIndex: 'imgUrl',
      slotName: 'imgUrl',
    },
    {
      title: t('CheckOrderTable.columns.skuNum'),
      dataIndex: 'skuNum',
    },
    {
      title: t('CheckOrderTable.columns.skuPrice'),
      dataIndex: 'skuPrice',
    },
  ]);

  // 删除分发单
  const inCheckOrderById = async (orderId: number) => {
    setLoading(true);
    try {
      await inCheckOrder(orderId);
      search();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

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
    findOrderItemData(orderId);
    visible.value = true;
  };
  const handleOk = () => {
    visible.value = false;
    orderItemData.value = [];
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
    search();
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
    name: 'CheckOrderTable',
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
