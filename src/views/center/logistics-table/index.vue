<template>
  <div class="container">
    <Breadcrumb :items="['menu.center', 'menu.center.Logistics']" />
    <a-card class="general-card" :title="$t('menu.center.Logistics')">
      <a-row>
        <!-- 6个输入框 -->
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 8 }"
            :wrapper-col-props="{ span: 15 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="id" :label="$t('Logistics.form.id')">
                  <a-input
                    v-model="formModel.id"
                    :placeholder="$t('Logistics.form.id.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="wareId"
                  :label="$t('Logistics.form.wareId')"
                >
                  <a-input
                    v-model="formModel.wareId"
                    :placeholder="$t('Logistics.form.wareId.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="name" :label="$t('Logistics.form.name')">
                  <a-input
                    v-model="formModel.name"
                    :placeholder="$t('Logistics.form.name.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="phone" :label="$t('Logistics.form.phone')">
                  <a-input
                    v-model="formModel.phone"
                    :placeholder="$t('Logistics.form.phone.placeholder')"
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
              {{ $t('Logistics.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('Logistics.form.reset') }}
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
            <a-button type="primary" @click="createLogisticsClick">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('Logistics.operation.create') }}
            </a-button>
            <a-upload
              @before-upload="(file: File) => {
                formCSV(file, (order: any) => {
                    order.forEach((order: Logistics) => {
                      addLogistics(order);
                    });
                    return true;
                  });
                }"
            >
              <template #upload-button>
                <a-button>
                  {{ $t('Logistics.operation.import') }}
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
          <a-button
            @click="
              (ev) => {
                toCSV(renderData, 'logistics');
              }
            "
          >
            <template #icon>
              <icon-download />
            </template>
            {{ $t('Logistics.operation.download') }}
          </a-button>
          <a-tooltip :content="$t('Logistics.actions.refresh')">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <!-- 密度 -->
            <a-tooltip :content="$t('Logistics.actions.density')">
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
          <a-tooltip :content="$t('Logistics.actions.columnSetting')">
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
        <!-- # -->
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>

        <!-- table里 -->
        <!-- 操作 -->
        <template #operations="{ record }">
          <a-button
            type="text"
            size="small"
            @click="deleteLogisticsById(record.id)"
          >
            {{ $t('Logistics.columns.operations.delete') }}
          </a-button>
          <a-button
            type="text"
            size="small"
            @click="updateLogisticsById(record)"
          >
            {{ $t('Logistics.columns.operations.update') }}
          </a-button>
        </template>
      </a-table>

      <a-modal
        :visible="isCreating || isUpdating"
        title="更新"
        @cancel="handleClose"
        @before-ok="handleBeforeOk"
      >
        <a-form :model="form">
          <a-form-item
            v-for="(val, key) in form"
            :key="key"
            :field="key"
            :label="$t(`Logistics.form.${key}`)"
          >
            <a-input
              v-model="form[key]"
              :placeholder="$t(`Logistics.form.${key}.placeholder`)"
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
    Logistics,
    addLogistics,
    updateLogistics,
    deleteLogistics,
    getLogistics,
    queryLogisticsList,
    addSkuWare,
    SkuWare,
  } from '@/api/center';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import copy from '@/utils/objects';
  import { createReactiveFn } from '@vueuse/core';
  import { formCSV, toCSV } from '@/utils/csv';
  import { AddRole, Role } from '@/api/acl';

  const generateFormModel = () => {
    return {
      id: '', //	id
      wareId: '', //	仓库id
      name: '', //	名称
      phone: '', //	手机
    };
  };

  const deleteLogisticsById = async (id: number) => {
    setLoading(true);
    try {
      await deleteLogistics(id);
      fetchData(pagination.current, pagination.pageSize, formModel.value);
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  let form = reactive(generateFormModel());
  const isCreating = ref(false);
  const isUpdating = ref(false);
  const updateLogVisible = ref(false);

  const createLogisticsClick = () => {
    isCreating.value = true;
  };
  const updateLogisticsById = async (logistics: Logistics) => {
    copy(logistics, form);
    updateLogVisible.value = true;
    isUpdating.value = true;
  };
  const handleBeforeOk = async () => {
    if (isCreating.value) {
      await addLogistics(form as unknown as Logistics);
    } else {
      await updateLogistics(form as unknown as Logistics);
    }
    isCreating.value = false;
    isUpdating.value = false;
    handleClose();
  };
  const handleClose = () => {
    isCreating.value = false;
    isUpdating.value = false;
    form = reactive(generateFormModel());
    fetchData(basePagination.current, basePagination.pageSize, formModel.value);
  };

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<Logistics[]>([]);
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
      name: t('Logistics.size.mini'),
      value: 'mini',
    },
    {
      name: t('Logistics.size.small'),
      value: 'small',
    },
    {
      name: t('Logistics.size.medium'),
      value: 'medium',
    },
    {
      name: t('Logistics.size.large'),
      value: 'large',
    },
  ]);

  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('Logistics.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
    },
    {
      title: t('Logistics.columns.id'),
      dataIndex: 'id',
    },
    // {
    //   title: t('Logistics.columns.wareId'),
    //   dataIndex: 'ware_id',
    // },
    {
      title: t('Logistics.columns.name'),
      dataIndex: 'name',
      slotName: 'name',
    },
    {
      title: t('Logistics.columns.phone'),
      dataIndex: 'phone',
    },
    {
      title: t('Logistics.columns.createTime'),
      dataIndex: 'createTime',
    },
    {
      title: t('Logistics.columns.updateTime'),
      dataIndex: 'updateTime',
    },
    {
      title: t('Logistics.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);

  // 分页
  const fetchData = async (
    current: number,
    pageSize: number,
    params: Partial<Logistics>
  ) => {
    setLoading(true);
    try {
      const { data } = await queryLogisticsList(current, pageSize, params);
      console.log(data);
      renderData.value = data.records;
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
    fetchData(basePagination.current, basePagination.pageSize, formModel.value);
  };

  fetchData(basePagination.current, basePagination.pageSize, formModel.value);

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
    name: 'Logistics',
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
