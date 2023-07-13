<template>
  <div class="container">
    <Breadcrumb :items="['menu.acl', 'menu.acl.role']" />
    <a-card class="general-card" :title="$t('menu.acl.role')">
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
                <a-form-item field="id" :label="$t('role.form.id')">
                  <a-input
                    v-model="formModel.id"
                    :placeholder="$t('role.form.id.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="name" :label="$t('role.form.name')">
                  <a-input
                    v-model="formModel.name"
                    :placeholder="$t('role.form.name.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="code" :label="$t('role.form.code')">
                  <a-input
                    v-model="formModel.code"
                    :placeholder="$t('role.form.code.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="remark" :label="$t('role.form.remark')">
                  <a-input
                    v-model="formModel.remark"
                    :placeholder="$t('role.form.remark.placeholder')"
                  />
                  <!-- <a-select
                    v-model="formModel.remark"
                    :options="filterTypeOptions"
                    :placeholder="$t('role.form.selectDefault')"
                  /> -->
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="createTime"
                  :label="$t('role.form.createTime')"
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
                  :label="$t('role.form.updateTime')"
                >
                  <a-range-picker
                    v-model="formModel.updateTime"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <!-- <a-col :span="8">
                <a-form-item
                  field="status"
                  :label="$t('role.form.status')"
                >
                  <a-select
                    v-model="formModel.status"
                    :options="statusOptions"
                    :placeholder="$t('role.form.selectDefault')"
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
              {{ $t('role.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('role.form.reset') }}
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
            <a-button type="primary" @click="handleCreateClick">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('role.operation.create') }}
            </a-button>
            <a-upload action="/">
              <template #upload-button>
                <a-button>
                  {{ $t('role.operation.import') }}
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
            {{ $t('role.operation.download') }}
          </a-button>
          <a-tooltip :content="$t('role.actions.refresh')">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <!-- 密度 -->
            <a-tooltip :content="$t('role.actions.density')">
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
          <a-tooltip :content="$t('role.actions.columnSetting')">
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

      <a-modal
        :visible="isCreating || isUpdating"
        :title="$t(`role.form.title.${isCreating ? 'create' : 'update'}`)"
        @cancel="handleClose"
        @before-ok="handleBeforeOk"
      >
        <a-form :model="form">
          <a-form-item
            v-for="(val, key) in form"
            :key="key"
            :field="key"
            :label="$t(`role.form.${key}`)"
          >
            <a-input
              v-model="form[key]"
              :placeholder="$t(`role.form.${key}.placeholder`)"
            />
          </a-form-item>
        </a-form>
      </a-modal>
      <a-modal
        :visible="isAssigning"
        :title="$t('role.form.title.assign')"
        @cancel="handleClose"
        @before-ok="handleBeforeOk"
      >
        <a-space direction="vertical" size="large">
          <a-cascader
            :options="options"
            :field-names="fieldNames"
            :style="{ width: '480px' }"
            :loading="!isAssignListFinished"
            placeholder="Please select ..."
            multiple
            allow-search
            allow-clear
            check-strictly
          />
        </a-space>
      </a-modal>

      <!-- 表格 -->
      <a-table
        v-model:selectedKeys="selectedKeys"
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :row-selection="rowSelection"
        :columns="(cloneColumns as TableColumnData[])"
        :data="renderData"
        :bordered="false"
        :size="size"
        @page-change="onPageChange"
      >
        <!-- 分页 -->
        <!-- <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template> -->

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
          {{ $t(`role.form.status.${record.status}`) }}
        </template>
        <!-- 表格form里 -->

        <!-- table里 -->
        <!-- 查看 -->
        <template #operations="{ record }">
          <a-button v-permission="['admin']" type="text" size="small">
            {{ $t('role.columns.operations.view') }}
          </a-button>
          <a-button
            v-permission="['admin']"
            type="text"
            size="small"
            @click="assignRole(record)"
          >
            {{ $t('role.columns.operations.assign') }}
          </a-button>
          <a-button
            v-permission="['admin']"
            type="text"
            size="small"
            @click="deleteById(record.id)"
          >
            {{ $t('role.columns.operations.delete') }}
          </a-button>
          <a-button
            v-permission="['admin']"
            type="text"
            size="small"
            @click="handleUpdateClick(record)"
          >
            {{ $t('role.columns.operations.update') }}
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
  import {
    addRole,
    deleteRole,
    Permission,
    queryPermissionList,
    queryRoleList,
    Role,
    updateRole,
  } from '@/api/acl';
  import { Pagination } from '@/types/global';
  import type {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import copy from '@/utils/objects';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };
  const fieldNames = { value: 'id', label: 'name' };
  let selectedRole: Role;
  const generateFormModel = () => {
    return {
      id: '',
      name: '',
      code: '',
      remark: '',
      // createTime: null,
      // updateTime: null,
    } as Role;
  };

  const selectedKeys = ref([]);

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  } as TableRowSelection);

  let options: Permission[];

  const isCreating = ref(false);
  const isUpdating = ref(false);
  const isAssigning = ref(false);
  const isAssignListFinished = ref(false);
  let form = reactive(generateFormModel());

  const deleteById = (id: number) => {
    deleteRole(id);
  };
  const handleCreateClick = () => {
    isCreating.value = true;
  };
  const handleUpdateClick = (role: Role) => {
    copy(role, form);
    isUpdating.value = true;
  };
  const handleClose = () => {
    isCreating.value = false;
    isUpdating.value = false;
    isAssigning.value = false;
    form = reactive(generateFormModel());
  };
  const handleBeforeOk = (done: any) => {
    if (isCreating.value) {
      addRole(form as unknown as Role);
    } else if (isUpdating.value) {
      updateRole(form as unknown as Role);
    } else {
      // assignRole(selectedRole.id, selectedKeys.value);
    }
    done();
    handleClose();
  };
  const assignRole = async (role: Role) => {
    isAssignListFinished.value = false;
    isAssigning.value = true;
    selectedRole = role;
    const { data } = await queryPermissionList();
    options = reactive(data);
    isAssignListFinished.value = true;
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<Role[]>([]);
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
      name: t('role.size.mini'),
      value: 'mini',
    },
    {
      name: t('role.size.small'),
      value: 'small',
    },
    {
      name: t('role.size.medium'),
      value: 'medium',
    },
    {
      name: t('role.size.large'),
      value: 'large',
    },
  ]);

  const columns = computed<TableColumnData[]>(() => [
    // {
    //   title: t('role.columns.index'),
    //   dataIndex: 'index',
    //   slotName: 'index',
    // },
    {
      title: t('role.columns.id'),
      dataIndex: 'id',
    },
    {
      title: t('role.columns.name'),
      dataIndex: 'name',
    },
    {
      title: t('role.columns.code'),
      dataIndex: 'code',
    },
    {
      title: t('role.columns.remark'),
      dataIndex: 'remark',
    },
    {
      title: t('role.columns.createTime'),
      dataIndex: 'createTime',
    },
    {
      title: t('role.columns.updateTime'),
      dataIndex: 'updateTime',
    },
    // {
    //   title: t('role.columns.code'),
    //   dataIndex: 'code',
    //   slotName: 'code',
    // },
    // {
    //   title: t('role.columns.sku_name'),
    //   dataIndex: 'sku_name',
    //   slotName: 'sku_name',
    // },
    // {
    //   title: t('role.columns.sku_num'),
    //   dataIndex: 'sku_num',
    // },
    // {
    //   title: t('role.columns.status'),
    //   dataIndex: 'status',
    //   slotName: 'status',
    // },
    {
      title: t('role.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);

  // //过滤器
  //   const filterTypeOptions = computed<SelectOptionData[]>(() => [
  //     {
  //       label: t('role.form.filterType.artificial'),
  //       value: 'artificial',
  //     },
  //     {
  //       label: t('role.form.filterType.rules'),
  //       value: 'rules',
  //     },
  //   ]);

  // 分页
  const fetchData = async (current: number, pageSize: number, params: Role) => {
    setLoading(true);
    try {
      const { data } = await queryRoleList(current, pageSize, params);
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
    fetchData(pagination.current, pagination.pageSize, formModel.value);
  };
  const onPageChange = (current: number) => {
    fetchData(current, pagination.pageSize, formModel.value);
  };
  fetchData(pagination.current, pagination.pageSize, formModel.value);

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
      cloneColumns.value.forEach((item) => {
        item.checked = true;
      });
      showColumns.value = cloneDeep(cloneColumns.value);
    },
    { deep: true, immediate: true }
  );
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
