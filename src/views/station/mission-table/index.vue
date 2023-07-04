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
              <!--任务类型-->
              <a-col :span="8">
                <a-form-item field="type" :label="$t('missionTable.form.type')">
                  <a-select
                    v-model="formModel.type"
                    :options="typeOptions"
                    :placeholder="$t('missionTable.form.selectDefault')"
                  />
                </a-form-item>
              </a-col>
              <!--任务状态-->
              <a-col :span="8">
                <a-form-item
                  field="status"
                  :label="$t('missionTable.form.status')"
                >
                  <a-select
                    v-model="formModel.status"
                    :options="statusOptions"
                    :placeholder="$t('missionTable.form.selectDefault')"
                  />
                </a-form-item>
              </a-col>
              <!--创建时间-->
              <a-col :span="8">
                <a-form-item
                  field="createdTime"
                  :label="$t('missionTable.form.createdTime')"
                >
                  <a-range-picker
                    v-model="formModel.createdTime"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <!--查询重置按钮-->
        <a-col :span="12">
          <a-space>
            <!--查询-->
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('missionTable.form.search') }}
            </a-button>
            <!--重置-->
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
          style="display: flex; align-items: center; justify-content: end"
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
        <!--订单编号-->
        <template #id="{ record }">
          {{ $t(`missionTable.form.id.${record.id}`) }}
        </template>
        <!--用户-->
        <template #user="{ record }">
          {{ $t(`missionTable.form.user.${record.user}`) }}
        </template>
        <!--配送员-->
        <template #courier="{ record }">
          {{ $t(`missionTable.form.courier.${record.courier}`) }}
        </template>
        <!--类型-->
        <template #type="{ record }">
          {{ $t(`missionTable.form.type.${record.type}`) }}
        </template>
        <!--状态，保留，判断要改-->
        <template #status="{ record }">
          {{ $t(`missionTable.form.status.${record.status}`) }}
        </template>
        <!--操作-->
        <template #operations>
          <a-button v-permission="['admin']" type="text" size="small">
            {{ $t('missionTable.columns.operations.view') }}
          </a-button>
          <a-button v-permission="['admin']" type="outline" size="small">
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
  import {
    queryMissionList,
    MissionRecord,
    MissionParams,
  } from '@/api/station';
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
      user: '',
      courier: '',
      type: '',
      status: '',
      createdTime: [],
    };
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<MissionRecord[]>([]);
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
      title: t('missionTable.columns.user'),
      dataIndex: 'user',
    },
    {
      title: t('missionTable.columns.courier'),
      dataIndex: 'courier',
    },
    {
      title: t('missionTable.columns.type'),
      dataIndex: 'type',
      slotName: 'type',
    },
    {
      title: t('missionTable.columns.createdTime'),
      dataIndex: 'createdTime',
    },
    {
      title: t('missionTable.columns.status'),
      dataIndex: 'status',
      slotName: 'status',
    },
    {
      title: t('missionTable.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);
  const typeOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('missionTable.form.type.deliver'),
      value: '送货',
    },
    {
      label: t('missionTable.form.type.payment'),
      value: '收款',
    },
    {
      label: t('missionTable.form.type.return'),
      value: '退货',
    },
    {
      label: t('missionTable.form.type.exchange'),
      value: '换货',
    },
  ]);
  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('missionTable.form.status.dispatched'),
      value: '已调度',
    },
    {
      label: t('missionTable.form.status.assignable'),
      value: '可分配',
    },
    {
      label: t('missionTable.form.status.assigned'),
      value: '已分配',
    },
    {
      label: t('missionTable.form.status.received'),
      value: '已领货',
    },
    {
      label: t('missionTable.form.status.finished'),
      value: '成功',
    },
    {
      label: t('missionTable.form.status.failed'),
      value: '失败',
    },
  ]);
  const fetchData = async (
    params: MissionParams = { current: 1, pageSize: 20 }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryMissionList(params);
      renderData.value = data.list;
      pagination.current = params.current;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    fetchData({
      ...basePagination,
      ...formModel.value,
    } as unknown as MissionParams);
  };
  const onPageChange = (current: number) => {
    fetchData({ ...basePagination, current });
  };

  fetchData();
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
