<template>
  <div class="container">
    <Breadcrumb :items="['menu.station', 'menu.station.receiptTable']" />
    <a-card class="general-card" :title="$t('menu.station.receiptTable')">
      <!--查询框-->
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <!--id-->
              <a-col :span="8">
                <a-form-item field="id" :label="$t('receiptTable.form.id')">
                  <a-input
                    v-model="formModel.id"
                    :placeholder="$t('receiptTable.form.id.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <!--用户id-->
              <a-col :span="8">
                <a-form-item
                  field="userId"
                  :label="$t('receiptTable.form.userId')"
                >
                  <a-input
                    v-model="formModel.userId"
                    :placeholder="$t('receiptTable.form.userId.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <!--收货人姓名-->
              <a-col :span="8">
                <a-form-item field="name" :label="$t('receiptTable.form.name')">
                  <a-input
                    v-model="formModel.name"
                    :placeholder="$t('receiptTable.form.name.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <!--订单id-->
              <a-col :span="8">
                <a-form-item
                  field="orderId"
                  :label="$t('receiptTable.form.orderId')"
                >
                  <a-input
                    v-model="formModel.orderId"
                    :placeholder="$t('receiptTable.form.orderId.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <!--满意度-->
              <a-col :span="8">
                <a-form-item field="mark" :label="$t('receiptTable.form.mark')">
                  <a-input
                    v-model="formModel.mark"
                    :placeholder="$t('receiptTable.form.mark.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <!--是否要发票-->
              <a-col :span="8">
                <a-form-item
                  field="takeInvoice"
                  :label="$t('receiptTable.form.takeInvoice')"
                >
                  <a-select
                    v-model="formModel.takeInvoice"
                    :options="yesOrNoOptions"
                    :placeholder="
                      $t('receiptTable.form.takeInvoice.placeholder')
                    "
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <!-- 分割线 -->
      </a-row>
      <a-divider style="margin-top: 0" />
      <!-- 表格上面的一排按钮 -->
      <a-row style="margin-bottom: 16px">
        <!-- 查询重置 -->
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('receiptTable.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('receiptTable.form.reset') }}
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
            {{ $t('receiptTable.operation.download') }}
          </a-button>
          <a-tooltip :content="$t('receiptTable.actions.refresh')">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <!-- 密度 -->
            <a-tooltip :content="$t('receiptTable.actions.density')">
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
          <a-tooltip :content="$t('receiptTable.actions.columnSetting')">
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
      <!-- 详情-->
      <a-modal
        :visible="isDetailing"
        :title="$t(`receiptTable.form.title.detail`)"
        draggable
        hide-cancel
        @ok="handleDetailClose"
        @cancel="handleDetailClose"
      >
        <a-form :model="formShow">
          <a-form-item
            v-for="(val, key) in formShow"
            :key="key"
            :field="key"
            :label="$t(`receiptTable.form.${key}`)"
          >
            <a-textarea
              v-model="formShow[key]"
              :placeholder="$t(`receiptTable.form.default.placeholder`)"
              style="width: 80%"
              disabled
            />
          </a-form-item>
        </a-form>
      </a-modal>
      <!--数据表格-->
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
        <!--编号-->
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
        <!--        是否-->
        <template #takeInvoice="{ record }">
          {{ $t(`receiptTable.form.takeInvoice.${record.takeInvoice}`) }}
        </template>
        <!--操作-->
        <template #operations="{ record }">
          <a-button
            v-permission="['admin']"
            type="text"
            size="small"
            @click="getReceipt(record)"
          >
            {{ $t('receiptTable.columns.operations.view') }}
          </a-button>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, nextTick } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { queryReceiptList, Receipt } from '@/api/station';
  import { Pagination } from '@/types/global';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import copy from '@/utils/objects';
  import { SelectOptionData } from '@arco-design/web-vue/es/select/interface';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const generateFormModel = () => {
    return {
      id: '',
      orderId: '',
      userId: '',
      name: '',
      phone: '',
      stationId: '', // 分站
      stationName: '', // 分站名称
      stationPhone: '', // 分站电话
      postCode: '', // 收货人邮编
      requirement: '', // 要求
      remark: '', // 备注
      feedback: '', // 反馈
      takeInvoice: '', // 是否开具发票
      mark: '', // 客户满意度
      province: '', // 省
      city: '', // 市
      district: '', // 区
      detailAddress: '', // 详细地址
      createTime: null, // 开始时间
      updateTime: null, // 结束时间
    };
  };
  const formDefault = () => {
    return {
      id: '',
      orderId: '',
      userId: '',
      name: '',
      phone: '',
      stationName: '', // 分站名称
      requirement: '', // 要求
      remark: '', // 备注
      feedback: '', // 反馈
      takeInvoice: '', // 是否开具发票
      mark: '', // 客户满意度
    };
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<Receipt[]>([]);
  const formModel = ref(formDefault());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const isDetailing = ref(false);

  const yesOrNoOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('receiptTable.form.takeInvoice.true'),
      value: 1,
    },
    {
      label: t('receiptTable.form.takeInvoice.false'),
      value: 0,
    },
  ]);

  let formShow = reactive(generateFormModel());

  const size = ref<SizeProps>('medium');
  const basePagination: Pagination = {
    current: 1,
    pageSize: 10,
  };
  const pagination = reactive({
    ...basePagination,
  });
  const densityList = computed(() => [
    {
      name: t('receiptTable.size.mini'),
      value: 'mini',
    },
    {
      name: t('receiptTable.size.small'),
      value: 'small',
    },
    {
      name: t('receiptTable.size.medium'),
      value: 'medium',
    },
    {
      name: t('receiptTable.size.large'),
      value: 'large',
    },
  ]);
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('receiptTable.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
    },
    {
      title: t('receiptTable.columns.id'),
      dataIndex: 'id',
    },
    {
      title: t('receiptTable.columns.orderId'),
      dataIndex: 'orderId',
    },
    {
      title: t('receiptTable.columns.userName'),
      dataIndex: 'userName',
    },
    {
      title: t('receiptTable.columns.userPhone'),
      dataIndex: 'userPhone',
    },
    {
      title: t('receiptTable.columns.mark'),
      dataIndex: 'mark',
    },
    {
      title: t('receiptTable.columns.takeInvoice'),
      dataIndex: 'takeInvoice',
      slotName: 'takeInvoice',
    },
    {
      title: t('receiptTable.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);

  const fetchData = async (
    current: number,
    pageSize: number,
    params: Partial<Receipt>
  ) => {
    setLoading(true);
    try {
      const { data } = await queryReceiptList(current, pageSize, params);
      renderData.value = data.records;
      pagination.current = current;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  fetchData(pagination.current, pagination.pageSize, formModel.value);

  // 详情信息
  const getReceipt = async (receipt: Receipt) => {
    // 显示当前分站的详细信息
    copy(receipt, formShow);
    isDetailing.value = true;
  };
  const handleDetailClose = () => {
    formShow = reactive(generateFormModel());
    isDetailing.value = false;
  };
  // 查询重置
  const search = () => {
    fetchData(basePagination.current, basePagination.pageSize, formModel.value);
  };
  const reset = () => {
    formModel.value = generateFormModel();
    search();
  };
  // 分页
  const onPageChange = (current: number) => {
    fetchData(current, basePagination.pageSize, formModel.value);
  };
  // 四个小标
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
    name: 'ReceiptTable',
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
