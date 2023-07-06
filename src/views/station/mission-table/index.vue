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
                    :placeholder="$t('missionTable.form.selectDefault')"
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
                    :placeholder="$t('missionTable.form.selectDefault')"
                  />
                </a-form-item>
              </a-col>
              <!--              &lt;!&ndash;开始时间&ndash;&gt;-->
              <!--              <a-col :span="8">-->
              <!--                <a-form-item-->
              <!--                  field="createdTime"-->
              <!--                  :label="$t('missionTable.form.createdTime')"-->
              <!--                >-->
              <!--                  <a-range-picker-->
              <!--                    v-model="formModel.createdTime"-->
              <!--                    style="width: 100%"-->
              <!--                  />-->
              <!--                </a-form-item>-->
              <!--              </a-col>-->
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
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <!--创建和批量导入-->
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="handleCreateClick">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('missionTable.operation.create') }}
            </a-button>
            <a-upload action="/">
              <template #upload-button>
                <a-button>
                  {{ $t('missionTable.operation.import') }}
                </a-button>
              </template>
            </a-upload>
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
        <!--任务单编号-->
        <template #id="{ record }">
          {{ $t(`missionTable.form.id.${record.id}`) }}
        </template>
        <!--分站编号-->
        <template #stationId="{ record }">
          {{ $t(`missionTable.form.stationId.${record.stationId}`) }}
        </template>
        <!--收货人-->
        <template #name="{ record }">
          {{ $t(`missionTable.form.name.${record.name}`) }}
        </template>
        <!--用户-->
        <template #userId="{ record }">
          {{ $t(`missionTable.form.userId.${record.userId}`) }}
        </template>
        <!--配送员-->
        <template #courierId="{ record }">
          {{ $t(`missionTable.form.courierId.${record.courierId}`) }}
        </template>
        <!--订单编号-->
        <template #orderId="{ record }">
          {{ $t(`missionTable.form.orderId.${record.orderId}`) }}
        </template>
        <!--库房编号-->
        <template #wareId="{ record }">
          {{ $t(`missionTable.form.wareId.${record.wareId}`) }}
        </template>
        <!--类型-->
        <template #workType="{ record }">
          {{ $t(`missionTable.form.workType.${record.workType}`) }}
        </template>
        <!--状态-->
        <template #workStatus="{ record }">
          {{ $t(`missionTable.form.workStatus.${record.workStatus}`) }}
        </template>
        <!--开始时间-->
        <template #startTime="{ record }">
          {{ $t(`missionTable.form.startTime.${record.startTime}`) }}
        </template>
        <!--结束时间-->
        <template #endTime="{ record }">
          {{ $t(`missionTable.form.endTime.${record.endTime}`) }}
        </template>
        <!--操作-->
        <template #operations="{ record }">
          <a-button
            v-permission="['admin']"
            type="text"
            size="small"
            @click="getWorkOrderById(record.id)"
          >
            {{ $t('missionTable.columns.operations.view') }}
          </a-button>
          <a-button
            v-permission="['admin']"
            type="outline"
            size="small"
            @click="assignById(record.id)"
          >
            {{ $t('missionTable.columns.operations.assign') }}
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
  import { queryWorkOrderList, WorkOrder } from '@/api/station';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };
  // const DELIVERY = 'DELIVERY';

  // 全部
  const generateFormModel = () => {
    return {
      id: '',
      stationId: '',
      name: '',
      userId: '',
      courierId: '',
      orderId: '',
      wareId: '',
      workStatus: '',
      workType: '',
      startTime: null,
      endTime: null,
    };
  };
  // // 查询
  // const searchFormModel = () => {
  //   return {
  //     id: '',
  //     stationId: '',
  //     name: '',
  //     userId: '',
  //     courierId: '',
  //     orderId: '',
  //     wareId: '',
  //     // workStatus: '',
  //     // workType: DELIVERY,
  //     startTime: null,
  //     endTime: null,
  //   };
  // };
  // const searchModel = ref(searchFormModel());
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<WorkOrder[]>([]);
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
      slotName: 'type',
    },
    {
      title: t('missionTable.columns.workStatus'),
      dataIndex: 'workStatus',
      slotName: 'status',
    },
    {
      title: t('missionTable.columns.startTime'),
      dataIndex: 'startTime',
    },
    {
      title: t('missionTable.columns.endTime'),
      dataIndex: 'endTime',
    },
    {
      title: t('missionTable.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);
  const typeOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('missionTable.form.workType.deliver'),
      value: 'DELIVERY',
    },
    {
      label: t('missionTable.form.workType.exchange'),
      value: 'EXCHANGE',
    },
    {
      label: t('missionTable.form.workType.return'),
      value: 'RETURN',
    },
  ]);
  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('missionTable.form.workStatus.dispatched'),
      value: 'DISPATCH',
    },
    {
      label: t('missionTable.form.workStatus.out'),
      value: 'OUT',
    },
    {
      label: t('missionTable.form.workStatus.in'),
      value: 'IN',
    },
    {
      label: t('missionTable.form.workStatus.assignable'),
      value: 'WAITING_ASSIGN',
    },
    {
      label: t('missionTable.form.workStatus.assigned'),
      value: 'ASSIGN',
    },
    {
      label: t('missionTable.form.workStatus.waitCourierTake'),
      value: 'WAITING_COURIER_TAKE',
    },
    {
      label: t('missionTable.form.workStatus.waitUserTake'),
      value: 'WAITING_USER_TAKE',
    },
    {
      label: t('missionTable.form.workStatus.finished'),
      value: 'FINISHED',
    },
    {
      label: t('missionTable.form.workStatus.cancel'),
      value: 'CANCEL',
    },
  ]);
  // const fetchData = async (
  //   params: MissionParams = { current: 1, pageSize: 20 }
  // ) => {
  //   setLoading(true);
  //   try {
  //     const { data } = await queryMissionList(params);
  //     renderData.value = data.list;
  //     pagination.current = params.current;
  //     pagination.total = data.total;
  //   } catch (err) {
  //     // you can report use errorHandler or other
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchData = async (
    current: number,
    pageSize: number,
    params: Partial<WorkOrder>
  ) => {
    setLoading(true);

    try {
      const { data } = await queryWorkOrderList(current, pageSize, params);
      renderData.value = data.records;
      pagination.current = current;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const getWorkOrderById = (id: number) => {
    // 根据id或许任务单详情
  };

  const assignById = (id: number) => {
    // 根据任务单id分配任务
  };

  // 查询重置
  const search = () => {
    fetchData(basePagination.current, basePagination.pageSize, formModel.value);
    console.log(formModel.value);
  };

  const onPageChange = (current: number) => {
    fetchData(current, basePagination.pageSize, formModel.value);
  };

  fetchData(pagination.current, pagination.pageSize, formModel.value);

  const reset = () => {
    formModel.value = generateFormModel();
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
