<template>
  <div class="container">
    <Breadcrumb :items="['menu.acl', 'menu.acl.admin']" />
    <a-card class="general-card" :title="$t('menu.acl.admin')">
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
                <a-form-item field="id" :label="$t('admin.form.id')">
                  <a-input
                    v-model="formModel.id"
                    :placeholder="$t('admin.form.id.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="name" :label="$t('admin.form.name')">
                  <a-input
                    v-model="formModel.name"
                    :placeholder="$t('admin.form.name.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="phone" :label="$t('admin.form.phone')">
                  <a-input
                    v-model="formModel.phone"
                    :placeholder="$t('admin.form.phone.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="email" :label="$t('admin.form.email')">
                  <a-input
                    v-model="formModel.email"
                    :placeholder="$t('admin.form.email.placeholder')"
                  />
                  <!-- <a-select
                    v-model="formModel.email"
                    :options="filterTypeOptions"
                    :placeholder="$t('admin.form.selectDefault')"
                  /> -->
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="wareId" :label="$t('admin.form.wareId')">
                  <a-input
                    v-model="formModel.wareId"
                    :placeholder="$t('admin.form.wareId.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="stationId"
                  :label="$t('admin.form.stationId')"
                >
                  <a-input
                    v-model="formModel.stationId"
                    :placeholder="$t('admin.form.stationId.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <!-- <a-col :span="8">
                <a-form-item
                  field="createTime"
                  :label="$t('admin.form.createTime')"
                >
                  <a-range-picker
                    v-model="formModel.createTime"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="updateTime"
                  :label="$t('admin.form.updateTime')"
                >
                  <a-range-picker
                    v-model="formModel.updateTime"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col> -->
              <!-- <a-col :span="8">
                <a-form-item
                  field="status"
                  :label="$t('admin.form.status')"
                >
                  <a-select
                    v-model="formModel.status"
                    :options="statusOptions"
                    :placeholder="$t('admin.form.selectDefault')"
                  />
                </a-form-item>
              </a-col> -->
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
              {{ $t('admin.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('admin.form.reset') }}
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
            <a-button type="primary">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('admin.operation.create') }}
            </a-button>
            <a-upload action="/">
              <template #upload-button>
                <a-button>
                  {{ $t('admin.operation.import') }}
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
          <a-button>
            <template #icon>
              <icon-download />
            </template>
            {{ $t('admin.operation.download') }}
          </a-button>
          <a-tooltip :content="$t('admin.actions.refresh')">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <!-- 密度 -->
            <a-tooltip :content="$t('admin.actions.density')">
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
          <a-tooltip :content="$t('admin.actions.columnSetting')">
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

        <!-- 表格form里 -->
        <!-- 状态 -->
        <template #status="{ record }">
          <span v-if="record.status === 'no_shipped'" class="circle"></span>
          <span
            v-else-if="record.status === 'shipped'"
            class="circle pass"
          ></span>
          <span
            v-else-if="record.status === 'stocked'"
            class="circle pass"
          ></span>
          {{ $t(`admin.form.status.${record.status}`) }}
        </template>
        <!-- 表格form里 -->

        <!-- table里 -->
        <!-- 查看 -->
        <template #operations>
          <a-button v-permission="['admin']" type="text" size="small">
            {{ $t('admin.columns.operations.view') }}
          </a-button>
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
  import { queryAdminList, Admin } from '@/api/acl';
  import { Pagination } from '@/types/global';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const generateFormModel = () => {
    return {
      id: '',
      username: '',
      name: '',
      phone: '',
      email: '',
      wareId: '',
      stationId: '',
      createTime: new Date(),
      updateTime: new Date(),
    };
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<Admin[]>([]);
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
      name: t('admin.size.mini'),
      value: 'mini',
    },
    {
      name: t('admin.size.small'),
      value: 'small',
    },
    {
      name: t('admin.size.medium'),
      value: 'medium',
    },
    {
      name: t('admin.size.large'),
      value: 'large',
    },
  ]);

  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('admin.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
    },
    {
      title: t('admin.columns.id'),
      dataIndex: 'id',
    },
    {
      title: t('admin.columns.username'),
      dataIndex: 'username',
    },
    {
      title: t('admin.columns.name'),
      dataIndex: 'name',
    },
    {
      title: t('admin.columns.phone'),
      dataIndex: 'phone',
    },
    {
      title: t('admin.columns.email'),
      dataIndex: 'email',
    },
    {
      title: t('admin.columns.wareId'),
      dataIndex: 'wareId',
    },
    {
      title: t('admin.columns.stationId'),
      dataIndex: 'stationId',
    },
    // {
    //   title: t('admin.columns.createTime'),
    //   dataIndex: 'createTime',
    // },
    // {
    //   title: t('admin.columns.updateTime'),
    //   dataIndex: 'updateTime',
    // },
    // {
    //   title: t('admin.columns.phone'),
    //   dataIndex: 'phone',
    //   slotName: 'phone',
    // },
    // {
    //   title: t('admin.columns.sku_name'),
    //   dataIndex: 'sku_name',
    //   slotName: 'sku_name',
    // },
    // {
    //   title: t('admin.columns.sku_num'),
    //   dataIndex: 'sku_num',
    // },
    // {
    //   title: t('admin.columns.status'),
    //   dataIndex: 'status',
    //   slotName: 'status',
    // },
    {
      title: t('admin.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);

  // //过滤器
  //   const filterTypeOptions = computed<SelectOptionData[]>(() => [
  //     {
  //       label: t('admin.form.filterType.artificial'),
  //       value: 'artificial',
  //     },
  //     {
  //       label: t('admin.form.filterType.rules'),
  //       value: 'rules',
  //     },
  //   ]);

  // 分页
  const fetchData = async (
    current: number,
    pageSize: number,
    params: Partial<Admin>
  ) => {
    setLoading(true);
    try {
      const { data } = await queryAdminList(current, pageSize, params);
      renderData.value = data.list;
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
  fetchData(basePagination.current, basePagination.pageSize, formModel.value);

  // 重置
  const reset = () => {
    formModel.value = generateFormModel();
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
    name: 'admin',
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
