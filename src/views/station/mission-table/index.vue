<template>
  <div class="container">
    <Breadcrumb :items="['menu.station', 'menu.station.missionTable']" />
    <a-card class="general-card" :title="$t('menu.station.missionTable')">
      <a-row>
        <!--查询框-->
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <!--分站id-->
              <a-col :span="8">
                <a-form-item
                  field="stationId"
                  :label="$t('missionTable.form.stationId')"
                >
                  <a-input
                    v-model="formModel.stationId"
                    :placeholder="$t('missionTable.form.stationId.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <!--库房id-->
              <a-col :span="8">
                <a-form-item
                  field="wareId"
                  :label="$t('missionTable.form.wareId')"
                >
                  <a-input
                    v-model="formModel.wareId"
                    :placeholder="$t('missionTable.form.wareId.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <!--收件人姓名-->
              <a-col :span="8">
                <a-form-item field="name" :label="$t('missionTable.form.name')">
                  <a-input
                    v-model="formModel.name"
                    :placeholder="$t('missionTable.form.name.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <!--配送员id-->
              <a-col :span="8">
                <a-form-item
                  field="courierId"
                  :label="$t('missionTable.form.courierId')"
                >
                  <a-input
                    v-model="formModel.courierId"
                    :placeholder="$t('missionTable.form.courierId.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <!--任务类型-->
              <a-col :span="8">
                <a-form-item
                  field="workType"
                  :label="$t('missionTable.form.workType')"
                >
                  <a-select
                    v-model="formModel.workType"
                    :options="typeOptions"
                    :placeholder="$t('missionTable.form.workType.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <!--任务状态-->
              <a-col :span="8">
                <a-form-item
                  field="workStatus"
                  :label="$t('missionTable.form.workStatus')"
                >
                  <a-select
                    v-model="formModel.workStatus"
                    :options="statusOptions"
                    :placeholder="
                      $t('missionTable.form.workStatus.placeholder')
                    "
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <!-- 查找重置按钮 -->
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('missionTable.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('missionTable.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
        <!--右侧四个小icon--下载，刷新，密度,列设置-->
        <a-col
          :span="12"
          style="display: flex; align-items: center; justify-content: flex-end"
        >
          <a-button>
            <template #icon>
              <icon-download />
            </template>
            {{ $t('missionTable.operation.download') }}
          </a-button>
          <a-tooltip :content="$t('missionTable.actions.refresh')">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="$t('missionTable.actions.density')">
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
          <a-tooltip :content="$t('missionTable.actions.columnSetting')">
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
      <!--详情展示-->
      <a-modal
        :visible="isDetailing"
        :title="$t(`missionTable.form.title.detail`)"
        draggable
        fullscreen
        hide-cancel
        @ok="handleDetailClose"
        @cancel="handleDetailClose"
      >
        <a-form id="capture" :model="formShow">
          <a-form-item
            v-for="(val, key) in formShow"
            :key="key"
            :field="key"
            :label="$t(`missionTable.form.${key}`)"
          >
            <a-input
              v-model="formShow[key]"
              :placeholder="$t(`missionTable.form.default.placeholder`)"
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
        <!--操作-->
        <template #operations="{ record }">
          <a-button
            v-permission="['admin']"
            type="text"
            size="small"
            @click="getWorkOrder(record)"
          >
            {{ $t('missionTable.columns.operations.view') }}
          </a-button>
          <template v-if="record.workStatus === 'IN'">
            <a-button
              v-permission="['admin']"
              type="text"
              size="small"
              @click="assignById(record.id, record.stationId)"
            >
              {{ $t('missionTable.columns.operations.assign') }}
            </a-button>
          </template>
          <template v-else-if="record.workStatus === 'CANCEL'">
            <a-button
              v-permission="['admin']"
              type="text"
              size="small"
              @click="deleteById(record.id)"
            >
              {{ $t('missionTable.columns.operations.delete') }}
            </a-button>
          </template>
          <template v-else-if="record.workStatus === 'RECEIVE'">
            <a-button
              v-permission="['admin']"
              type="text"
              size="small"
              @click="returnWorkOrder(record)"
            >
              {{ $t('missionTable.columns.operations.return') }}
            </a-button>
          </template>
          <template v-else-if="record.workStatus === 'ASSIGN'">
            <a-button
              v-permission="['admin']"
              type="text"
              size="small"
              @click="printWorkOrder(record)"
            >
              {{ $t('missionTable.columns.operations.print') }}
            </a-button>
          </template>
          <template v-else-if="record.workStatus === 'RETURN_UNASSIGNED'">
            <a-button
              v-permission="['admin']"
              type="text"
              size="small"
              @click="returnAssignById(record.id, record.stationId)"
            >
              {{ $t('missionTable.columns.operations.returnAssign') }}
            </a-button>
          </template>
        </template>
      </a-table>
      <!--分配-->
      <a-modal
        :visible="isAssigning"
        :title="$t(`missionTable.form.title.assign`)"
        draggable
        @cancel="handleClose"
        @before-ok="handleBeforeOk"
      >
        <a-table
          row-key="id"
          :loading="loading"
          :columns="(courierColumns as TableColumnData[])"
          :data="courierData"
          :bordered="false"
          :size="size"
          @page-change="onPageChange"
        >
          <!--编号-->
          <template #index="{ rowIndex }">
            {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
          </template>
          <template #operations="{ record }">
            <a-button
              v-permission="['admin']"
              type="text"
              size="small"
              @click="setCourier(record.id)"
            >
              {{ $t('missionTable.columns.operations.select') }}
            </a-button>
          </template>
        </a-table>
      </a-modal>
      <!--详情展示-->
      <a-modal
        :visible="isReturning"
        :title="$t(`missionTable.form.title.return`)"
        draggable
        @ok="handleReturnBeforeOk"
        @cancel="handleReturnClose"
      >
        <a-form :model="formReturn">
          <a-form-item :field="'id'" :label="$t('missionTable.form.id')">
            <a-input
              v-model="formReturn.id"
              :placeholder="$t('missionTable.form.default.placeholder')"
              disabled
            />
          </a-form-item>

          <a-form-item :field="'name'" :label="$t('missionTable.form.name')">
            <a-input
              v-model="formReturn.name"
              :placeholder="$t('missionTable.form.default.placeholder')"
              disabled
            />
          </a-form-item>

          <a-form-item
            :field="'stationName'"
            :label="$t('missionTable.form.stationName')"
          >
            <a-input
              v-model="formReturn.stationName"
              :placeholder="$t('missionTable.form.default.placeholder')"
              disabled
            />
          </a-form-item>

          <a-form-item
            :field="'remark'"
            :label="$t('missionTable.form.remark')"
          >
            <a-textarea
              v-model="formReturn.remark"
              :placeholder="$t('missionTable.form.default.placeholder')"
              style="width: 80%"
            />
          </a-form-item>

          <a-form-item :field="'mark'" :label="$t('missionTable.form.mark')">
            <a-textarea
              v-model="formReturn.mark"
              :placeholder="$t('missionTable.form.default.placeholder')"
              style="width: 80%"
            />
          </a-form-item>
          <a-form-item
            :field="'feedback'"
            :label="$t('missionTable.form.feedback')"
          >
            <a-textarea
              v-model="formReturn.feedback"
              :placeholder="$t('missionTable.form.default.placeholder')"
              style="width: 80%"
            />
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, nextTick } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import {
    queryWorkOrderList,
    WorkOrder,
    Courier,
    queryCourierList,
    deleteWorkOrder,
    changeWorkOrder,
    assign,
    returnAssign,
  } from '@/api/station';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import copy from '@/utils/objects';
  import htmlToPdf from '@/utils/pdf';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const generateFormModel = () => {
    return {
      id: '',
      stationId: '', // 分站
      stationName: '', // 分站名称
      name: '', // 收货人姓名电话
      phone: '', // 收货人
      postCode: '', // 收货人邮编
      userId: '', // 用户
      courierId: '', // 配送员
      orderId: '', // 订单id
      wareId: '', // 中心库房
      // 状态DISPATCH,OUT,IN,WAITING_ASSIGN,ASSIGN,WAITING_COURIER_TAKE,WAITING_USER_TAKE,FINISHED,CANCEL
      workStatus: '',
      workType: '', // 类型DELIVERY,EXCHANGE,RETURN
      logisticsId: '', // 物流公司编号
      logisticsName: '', // 物流公司名称
      logisticsPhone: '', // 物流公司联系方式
      province: '', // 省
      city: '', // 市
      district: '', // 区
      detailAddress: '', // 详细地址
      remark: '', // 备注
      mark: '', // 满意度
      feedback: '', // 反馈
      createTime: null, // 开始时间
      updateTime: null, // 结束时间
    };
  };
  const serachFormModel = () => {
    return {
      stationId: '', // 分站
      name: '', // 收货人姓名
      courierId: '', // 配送员
      wareId: '', // 中心库房
      // 状态DISPATCH,OUT,IN,WAITING_ASSIGN,ASSIGN,WAITING_COURIER_TAKE,WAITING_USER_TAKE,FINISHED,CANCEL
      workStatus: null,
      workType: null, // 类型DELIVERY,EXCHANGE,RETURN
    };
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<WorkOrder[]>([]);
  const courierData = ref<Courier[]>([]); // 配送员表格
  const formModel = ref(serachFormModel());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const isDetailing = ref(false);
  const isAssigning = ref(false);
  const isReturning = ref(false);
  const deliverOrReturn = ref(false);

  const size = ref<SizeProps>('medium');
  let formShow = reactive(generateFormModel());
  let formReturn = reactive(generateFormModel());

  const basePagination: Pagination = {
    current: 1,
    pageSize: 10,
  };
  const pagination = reactive({
    ...basePagination,
  });
  const densityList = computed(() => [
    {
      name: t('missionTable.size.mini'),
      value: 'mini',
    },
    {
      name: t('missionTable.size.small'),
      value: 'small',
    },
    {
      name: t('missionTable.size.medium'),
      value: 'medium',
    },
    {
      name: t('missionTable.size.large'),
      value: 'large',
    },
  ]);
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('missionTable.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
    },
    {
      title: t('missionTable.columns.id'),
      dataIndex: 'id',
    },
    {
      title: t('missionTable.columns.stationId'),
      dataIndex: 'stationId',
    },
    {
      title: t('missionTable.columns.name'),
      dataIndex: 'name',
    },
    {
      title: t('missionTable.columns.userId'),
      dataIndex: 'userId',
    },
    {
      title: t('missionTable.columns.courierId'),
      dataIndex: 'courierId',
    },
    {
      title: t('missionTable.columns.wareId'),
      dataIndex: 'wareId',
    },
    {
      title: t('missionTable.columns.workType'),
      dataIndex: 'workType',
    },
    {
      title: t('missionTable.columns.workStatus'),
      dataIndex: 'workStatus',
    },
    // {
    //   title: t('missionTable.columns.createTime'),
    //   dataIndex: 'createTime',
    // },
    // {
    //   title: t('missionTable.columns.updateTime'),
    //   dataIndex: 'updateTime',
    // },
    {
      title: t('missionTable.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);
  const typeOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('missionTable.form.workType.DELIVERY'),
      value: 'DELIVERY',
    },
    {
      label: t('missionTable.form.workType.EXCHANGE'),
      value: 'EXCHANGE',
    },
    {
      label: t('missionTable.form.workType.RETURN'),
      value: 'RETURN',
    },
  ]);
  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('missionTable.form.workStatus.DISPATCH'),
      value: 'DISPATCH',
    },
    {
      label: t('missionTable.form.workStatus.OUT'),
      value: 'OUT',
    },
    {
      label: t('missionTable.form.workStatus.IN'),
      value: 'IN',
    },
    {
      label: t('missionTable.form.workStatus.ASSIGN'),
      value: 'ASSIGN',
    },
    {
      label: t('missionTable.form.workStatus.TAKE'),
      value: 'TAKE',
    },
    {
      label: t('missionTable.form.workStatus.RECEIVE'),
      value: 'RECEIVE',
    },
    {
      label: t('missionTable.form.workStatus.RETURN_UNASSIGNED'),
      value: 'RETURN_UNASSIGNED',
    },
    {
      label: t('missionTable.form.workStatus.RETURN_ASSIGN'),
      value: 'RETURN_ASSIGN',
    },
    {
      label: t('missionTable.form.workStatus.RETURN_STATION'),
      value: 'RETURN_STATION',
    },
    {
      label: t('missionTable.form.workStatus.RETURN_OUT'),
      value: 'RETURN_OUT',
    },
    {
      label: t('missionTable.form.workStatus.RETURN_IN'),
      value: 'RETURN_IN',
    },
    {
      label: t('missionTable.form.workStatus.CANCEL'),
      value: 'CANCEL',
    },
  ]);
  const courierColumns = computed<TableColumnData[]>(() => [
    {
      title: '序号',
      dataIndex: 'index',
      slotName: 'index',
    },
    {
      title: '配送员所在分站',
      dataIndex: 'stationId',
    },
    {
      title: '配送员编号',
      dataIndex: 'id',
    },
    {
      title: '配送员姓名',
      dataIndex: 'name',
    },
    {
      title: '配送员联系电话',
      dataIndex: 'phone',
    },
    {
      title: t('missionTable.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);

  // 分页查询
  const fetchData = async (
    current: number,
    pageSize: number,
    params: Partial<WorkOrder>
  ) => {
    setLoading(true);

    try {
      const { data } = await queryWorkOrderList(current, pageSize, params);
      renderData.value = data.records;
      console.log(renderData.value);
      pagination.current = current;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  fetchData(pagination.current, pagination.pageSize, formModel.value);
  const onPageChange = (current: number) => {
    fetchData(current, basePagination.pageSize, formModel.value);
  };

  // 详情
  const getWorkOrder = (workOrder: WorkOrder) => {
    // 查看当前任务单详情
    copy(workOrder, formShow);
    isDetailing.value = true;
  };
  const handleDetailClose = () => {
    formShow = reactive(generateFormModel());
    isDetailing.value = false;
  };

  // 分配

  const rowSelection = {
    type: 'radio',
  };

  const selectCourier = ref('');
  const assignCourierId = ref();
  const assignWorkOrderId = ref();
  const setCourier = (id: number) => {
    console.log('_________________________');
    console.log(id);
    assignCourierId.value = id;
  };
  const handleBeforeOk = () => {
    console.log(assignWorkOrderId.value);
    console.log(assignCourierId.value);
    console.log('++++++++++++++++++++++++++');
    if (deliverOrReturn.value) {
      returnAssign(assignWorkOrderId.value, assignCourierId.value);
    } else {
      assign(assignWorkOrderId.value, assignCourierId.value);
    }
    handleClose();
  };
  const handleClose = () => {
    isAssigning.value = false;
    deliverOrReturn.value = false;
    assignCourierId.value = null;
    assignWorkOrderId.value = null;
    search();
  };
  const fetchCourierData = async (
    current: number,
    pageSize: number,
    params: Partial<Courier>
  ) => {
    setLoading(true);
    try {
      const { data } = await queryCourierList(current, pageSize, params);
      courierData.value = data.records;
      console.log(courierData.value);
      pagination.current = current;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const assignById = (id: number, staId: number) => {
    // 根据任务单id分配任务

    isAssigning.value = true;
    assignWorkOrderId.value = id;
    const params: Partial<Courier> = {
      stationId: staId,
    };
    fetchCourierData(pagination.current, pagination.pageSize, params);
  };

  // 退货分配
  const returnAssignById = (id: number, staId: number) => {
    // 根据任务单id分配任务
    deliverOrReturn.value = true;
    isAssigning.value = true;
    assignWorkOrderId.value = id;
    const params: Partial<Courier> = {
      stationId: staId,
    };
    fetchCourierData(pagination.current, pagination.pageSize, params);
  };

  // 删除
  const deleteById = async (id: number) => {
    setLoading(true);
    try {
      await deleteWorkOrder(id);
      fetchData(pagination.current, pagination.pageSize, formModel.value);
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  // 回执录入
  const returnWorkOrder = (workOrder: WorkOrder) => {
    copy(workOrder, formReturn);
    isReturning.value = true;
  };
  const handleReturnBeforeOk = () => {
    changeWorkOrder(formReturn as unknown as WorkOrder);
    handleReturnClose();
    fetchData(basePagination.current, basePagination.pageSize, formModel.value);
  };
  const handleReturnClose = () => {
    isReturning.value = false;
    formReturn = reactive(generateFormModel());
  };
  // 打印任务单
  const printWorkOrder = (workOrder: WorkOrder) => {
    const text = '任务单详情';
    getWorkOrder(workOrder);
    // text:文件标题
    setTimeout(() => {
      htmlToPdf(text, '#capture');
    }, 200);
  };

  // 查询重置
  const search = () => {
    fetchData(basePagination.current, basePagination.pageSize, formModel.value);
    console.log(formModel.value);
  };
  const reset = () => {
    formModel.value = serachFormModel();
    fetchData(basePagination.current, basePagination.pageSize, formModel.value);
  };

  // 小图标
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
    name: 'MissionTable',
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
