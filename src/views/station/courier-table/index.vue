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
            <!--分站-->
            <!--            <a-col :span="8">-->
            <!--              <a-form-item-->
            <!--                field="stationId"-->
            <!--                :label="$t('courierTable.form.stationId')"-->
            <!--              >-->
            <!--                <a-input-->
            <!--                  v-model="formModel.stationId"-->
            <!--                  :placeholder="$t('courierTable.form.stationId.placeholder')"-->
            <!--                />-->
            <!--              </a-form-item>-->
            <!--            </a-col>-->
            <a-row :gutter="16">
              <!--姓名-->
              <a-col :span="8">
                <a-form-item field="name" :label="$t('courierTable.form.name')">
                  <a-input
                    v-model="formModel.name"
                    :placeholder="$t('courierTable.form.name.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <!--手机号-->
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
              <!--身份证号-->
              <a-col :span="8">
                <a-form-item field="idNo" :label="$t('courierTable.form.idNo')">
                  <a-input
                    v-model="formModel.idNo"
                    :placeholder="$t('courierTable.form.idNo.placeholder')"
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
              {{ $t('courierTable.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('courierTable.form.reset') }}
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
                toCSV(renderData, 'courier-table');
              }
            "
          >
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
            <!-- 密度 -->
            <a-tooltip :content="$t('courierTable.actions.density')">
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
      <!--修改-->
      <a-modal
        :visible="isUpdating"
        :title="$t(`courierTable.form.title.update`)"
        @cancel="handleClose"
        @before-ok="handleBeforeOk"
      >
        <a-form :model="form">
          <a-form-item
            v-for="(val, key) in form"
            :key="key"
            :field="key"
            :label="$t(`courierTable.form.${key}`)"
          >
            <template v-if="key === 'id' || key === 'userId'">
              <a-input
                v-model="form[key]"
                :placeholder="$t(`courierTable.form.${key}.placeholder`)"
                disabled
              />
            </template>
            <template v-else>
              <a-input
                v-model="form[key]"
                :placeholder="$t(`courierTable.form.${key}.placeholder`)"
              />
            </template>
          </a-form-item>
        </a-form>
      </a-modal>
      <!--      详情-->
      <a-modal
        :visible="isDetailing"
        :title="$t(`courierTable.form.title.detail`)"
        draggable
        hide-cancel
        @ok="handleDetailClose"
        @cancel="handleDetailClose"
      >
        <div class="data-details">
          <div class="data-container">
            <div
              v-for="(val, key) in formshow"
              :key="key"
              :model="formshow"
              class="data-item"
            >
              <div class="data-content">
                <div class="data-row">
                  <div class="data-title">{{
                    $t(`courierTable.form.${key}`)
                  }}</div>
                  <template v-if="key === 'idNoUrl1'">
                    <div>
                      <img
                        :src="formshow[key]"
                        style="width: 200px; height: 150px"
                      />
                    </div>
                  </template>
                  <template v-else-if="key === 'idNoUrl2'">
                    <img
                      :src="formshow[key]"
                      style="width: 200px; height: 150px"
                    />
                  </template>
                  <template v-else>
                    <div class="data-value">{{ formshow[key] }}</div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
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
        <!--序号-->
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
        <!--        &lt;!&ndash;完成任务量&ndash;&gt;-->
        <!--        <template #count="{ record }">-->
        <!--          {{ getworkNum(record.id) }}-->
        <!--        </template>-->
        <!--操作-->
        <template #operations="{ record }">
          <a-button
            v-perCourier="['admin']"
            type="text"
            size="small"
            @click="getCourier(record)"
          >
            <template #icon>
              <icon-link />
            </template>
            {{ $t('courierTable.columns.operations.view') }}
          </a-button>
          <a-button
            v-permission="['admin']"
            type="text"
            size="small"
            @click="handleUpdateClick(record)"
          >
            {{ $t('courierTable.columns.operations.change') }}
          </a-button>
          <a-button
            v-permission="['admin']"
            type="text"
            size="small"
            @click="deleteCourierById(record.id)"
          >
            {{ $t('courierTable.columns.operations.delete') }}
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
    Courier,
    updateCourier,
    deleteCourier,
  } from '@/api/station';
  import { Pagination } from '@/types/global';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import copy from '@/utils/objects';
  import { toCSV } from '@/utils/csv';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };
  // 详情
  const generateFormModel = () => {
    return {
      id: '',
      userId: '',
      name: '',
      stationId: '',
      idNo: '',
      phone: '',
      idNoUrl1: '',
      idNoUrl2: '',
      createTime: null,
      updateTime: null,
      workNum: '',
      // param: null,
    };
  };
  // 查询框
  const searchFormModel = () => {
    return {
      name: '',
      stationId: '',
      idNo: '',
      phone: '',
    };
  };
  // 修改
  const updateFormModel = () => {
    return {
      id: '',
      userId: '',
      name: '',
      phone: '',
      idNo: '',
      idNoUrl1: '',
      idNoUrl2: '',
      stationId: '',
    };
  };

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<Courier[]>([]);
  const formModel = ref(searchFormModel());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const isUpdating = ref(false);
  const isDetailing = ref(false);

  let form = reactive(updateFormModel());
  let formshow = reactive(generateFormModel());

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
      title: t('courierTable.columns.stationId'),
      dataIndex: 'stationId',
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
      title: t('courierTable.columns.workNum'),
      dataIndex: 'workNum',
      sortable: {
        sortDirections: ['ascend', 'descend'],
      },
      slotName: 'count',
    },
    {
      title: t('courierTable.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);

  const fetchData = async (
    current: number,
    pageSize: number,
    params: Partial<Courier>
  ) => {
    setLoading(true);
    try {
      const { data } = await queryCourierList(current, pageSize, params);
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

  // 修改
  const handleUpdateClick = (courier: Courier) => {
    copy(courier, form);
    isUpdating.value = true;
  };
  const handleBeforeOk = () => {
    updateCourier(form as unknown as Courier);
    handleClose();
  };
  const handleClose = () => {
    isUpdating.value = false;
    search();
    form = reactive(updateFormModel());
  };

  // 删
  const deleteCourierById = async (id: number) => {
    setLoading(true);
    try {
      await deleteCourier(id);
      fetchData(pagination.current, pagination.pageSize, formModel.value);
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  // 详情信息
  const getCourier = (courier: Courier) => {
    // 显示当前配送员的详细信息
    copy(courier, formshow);
    isDetailing.value = true;
  };
  const handleDetailClose = () => {
    formshow = reactive(generateFormModel());
    isDetailing.value = false;
  };

  // 查询重置
  const search = () => {
    console.log(formModel.value);
    fetchData(pagination.current, pagination.pageSize, formModel.value);
  };

  const reset = () => {
    formModel.value = searchFormModel();
    fetchData(pagination.current, pagination.pageSize, formModel.value);
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
  .data-details {
    display: flex;
    padding: 10px;
    background-color: #f6f6f6;
  }
  .data-container {
    flex: 1;
  }
  .data-item {
    display: inline;
    align-items: center;
    margin-bottom: 28px;
  }
  .data-content {
    margin-left: 25px;
    margin-right: 25px;
  }
  .data-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .data-title {
    font-size: 15px;
    color: #9a9797;
  }
  .data-value {
    color: #4d4c4c;
    font-size: 15px;
    text-align: center;
    //margin-left: 100px;
  }
</style>
