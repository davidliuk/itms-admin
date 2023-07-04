<template>
  <div class="container">
    <Breadcrumb :items="['menu.station', 'menu.station.courierTable']" />
    <a-card class="general-card" :title="$t('menu.station.courierTable')">
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
              <!--编号-->
              <a-col :span="8">
                <a-form-item field="id" :label="$t('courierTable.form.id')">
                  <a-input
                    v-model="formModel.id"
                    :placeholder="$t('courierTable.form.id.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <!--姓名-->
              <a-col :span="8">
                <a-form-item field="name" :label="$t('courierTable.form.name')">
                  <a-input
                    v-model="formModel.name"
                    :placeholder="$t('courierTable.form.name.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <!--联系方式-->
              <a-col :span="8">
                <a-form-item
                  field="phone"
                  :label="$t('courierTable.form.phone')"
                >
                  <a-input
                    v-model="formModel.phone"
                    :placeholder="$t('courierTable.form.phone.placeholder')"
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
              {{ $t('courierTable.form.search') }}
            </a-button>
            <!--重置-->
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('courierTable.form.reset') }}
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
            {{ $t('courierTable.operation.download') }}
          </a-button>
          <a-tooltip :content="$t('courierTable.actions.refresh')">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="$t('courierTable.actions.density')">
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
          <a-tooltip :content="$t('courierTable.actions.columnSetting')">
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
        <!--配送员编号-->
        <template #id="{ record }">
          {{ $t(`courierTable.form.id.${record.id}`) }}
        </template>
        <!--姓名-->
        <template #name="{ record }">
          {{ $t(`courierTable.form.name.${record.name}`) }}
        </template>
        <!--联系方式-->
        <template #phone="{ record }">
          {{ $t(`courierTable.form.phone.${record.phone}`) }}
        </template>
        <!--身份证编号-->
        <template #idNo="{ record }">
          {{ $t(`courierTable.form.idNo.${record.idNo}`) }}
        </template>
        <!--身份证正面图片-->
        <template #idNoUrl1="{ record }">
          <a-link :href="record.idNoUrl1">
            <template #icon>
              <icon-link />
            </template>
            正面
          </a-link>
        </template>
        <!--身份证背面图片-->
        <template #idNoUrl2="{ record }">
          <!--<a-link>-->
          <!--{{ $t(`courierTable.form.idNoUrl2.${record.idNoUrl2}`) }}-->
          <!--</a-link>-->
          <a-link :href="record.idNoUrl2">
            <template #icon>
              <icon-link />
            </template>
            背面
          </a-link>
        </template>
        <!--完成任务量-->
        <template #CourierCount="{ record }">
          {{ $t(`courierTable.form.CourierCount.${record.CourierCount}`) }}
        </template>
        <!--操作-->
        <template #operations>
          <a-button v-perCourier="['admin']" type="text" size="small">
            <template #icon>
              <icon-link />
            </template>
            {{ $t('courierTable.columns.operations.view') }}
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
    queryCourierList,
    CourierRecord,
    CourierParams,
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
      name: '',
      phone: '',
      idNo: '',
      idNoUrl1: '',
      idNoUrl2: '',
      missionCount: '',
      createdTime: [],
    };
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<CourierRecord[]>([]);
  const formModel = ref(generateFormModel());
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
  const densityList = computed(() => [
    {
      name: t('courierTable.size.mini'),
      value: 'mini',
    },
    {
      name: t('courierTable.size.small'),
      value: 'small',
    },
    {
      name: t('courierTable.size.medium'),
      value: 'medium',
    },
    {
      name: t('courierTable.size.large'),
      value: 'large',
    },
  ]);
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('courierTable.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
    },
    {
      title: t('courierTable.columns.id'),
      dataIndex: 'id',
    },
    {
      title: t('courierTable.columns.name'),
      dataIndex: 'name',
    },
    {
      title: t('courierTable.columns.phone'),
      dataIndex: 'phone',
    },
    {
      title: t('courierTable.columns.idNo'),
      dataIndex: 'idNo',
    },
    {
      title: t('courierTable.columns.idNoUrl1'),
      dataIndex: 'idNoUrl1',
      slotName: 'idNoUrl1',
    },
    {
      title: t('courierTable.columns.idNoUrl2'),
      dataIndex: 'idNoUrl2',
      slotName: 'idNoUrl2',
    },
    {
      title: t('courierTable.columns.missionCount'),
      dataIndex: 'missionCount',
      sortable: {
        sortDirections: ['ascend', 'descend'],
      },
    },
    {
      title: t('courierTable.columns.createdTime'),
      dataIndex: 'createdTime',
    },
    {
      title: t('courierTable.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);

  const fetchData = async (
    params: CourierParams = { current: 1, pageSize: 20 }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryCourierList(params);
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
    } as unknown as CourierParams);
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
    name: 'CourierTable',
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
