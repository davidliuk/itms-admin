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
            <a-button type="primary" @click="handleCreateClick">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('admin.operation.create') }}
            </a-button>
            <a-button type="primary" @click="handleBatchDeleteClick">
              <template #icon>
                <icon-delete />
              </template>
              {{ $t('admin.operation.batchDelete') }}
            </a-button>
            <a-upload @before-upload="beforeUpload">
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
          <a-button @click="exportToCSV">
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
      <a-modal
        :visible="isCreating || isUpdating"
        :title="$t(`admin.form.title.${isCreating ? 'create' : 'update'}`)"
        @cancel="handleClose"
        @before-ok="handleBeforeOk"
      >
        <a-form :model="form">
          <a-form-item
            v-for="(val, key) in form"
            :key="key"
            :field="key"
            :label="$t(`admin.form.${key}`)"
          >
            <a-input
              v-model="form[key]"
              :placeholder="$t(`admin.form.${key}.placeholder`)"
            />
          </a-form-item>
        </a-form>
      </a-modal>
      <a-modal
        :visible="isAssigning"
        :title="$t('admin.form.title.assign')"
        @cancel="handleClose"
        @before-ok="handleBeforeOk"
      >
        <a-space direction="vertical" size="large">
          <a-select
            v-if="!isAssignListFinished"
            :options="[]"
            :style="{ width: '480px' }"
            placeholder="Please select ..."
            loading
          />
          <a-select
            v-else
            v-model="selectedOptions"
            :options="options"
            :style="{ width: '480px' }"
            :field-names="fieldNames"
            placeholder="Please select ..."
            multiple
            allow-search
            allow-clear
          >
          </a-select>
        </a-space>
      </a-modal>
      <!-- 表格 -->
      <a-table
        v-model:selected-keys="selectedKeys"
        row-key="id"
        :row-selection="rowSelection"
        :loading="loading"
        :pagination="pagination"
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
          {{ $t(`admin.form.status.${record.status}`) }}
        </template>
        <!-- 表格form里 -->
        <template #avatar="{ record }">
          <a-avatar :size="64" :image-url="record.avatar">
            <template #trigger-icon>
              <icon-camera />
            </template>
            <!-- <img :src="record.avatar" /> -->
          </a-avatar>
          <!-- <img
            :src="record.avatar"
            alt="No Avatar"
            style="width: 100px; height: 100px"
          /> -->
        </template>

        <!-- table里 -->
        <!-- 查看 -->
        <template #operations="{ record }">
          <a-button v-permission="['admin']" type="text" size="small">
            {{ $t('admin.columns.operations.view') }}
          </a-button>
          <a-button
            v-permission="['admin']"
            type="text"
            size="small"
            @click="assignAdmin(record)"
          >
            {{ $t('admin.columns.operations.assign') }}
          </a-button>
          <a-button
            v-permission="['admin']"
            type="text"
            size="small"
            @click="deleteAdminById(record.id)"
          >
            {{ $t('admin.columns.operations.delete') }}
          </a-button>
          <a-button
            v-permission="['admin']"
            type="text"
            size="small"
            @click="handleUpdateClick(record)"
          >
            {{ $t('admin.columns.operations.update') }}
          </a-button>
        </template>
        <!-- 查看 -->
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, nextTick, Ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import {
    queryAdminList,
    addAdmin,
    updateAdmin,
    deleteAdmin,
    Admin,
    Role,
    toAssign,
    doAssign,
    deleteAdminBatch,
  } from '@/api/acl';
  import { Pagination } from '@/types/global';
  import type {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import copy from '@/utils/objects';
  import { toCSV, formCSV } from '@/utils/csv';

  const exportToCSV = () => {
    toCSV(renderData.value, 'admin');
  };
  const beforeUpload = (file: File) => {
    formCSV(file, (admins: any) => {
      admins.forEach((admin: Admin) => {
        addAdmin(admin);
        console.log(admin);
      });
      return true;
    });
  };

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const fieldNames = { value: 'id', label: 'name' };
  let options: Ref<Role[]>;
  let selectedOptions: Ref<string[]>;
  let selectedAdmin: Admin;

  const generateFormModel = () => {
    return {
      id: '',
      username: '',
      name: '',
      password: '',
      phone: '',
      email: '',
      wareId: '',
      stationId: '',
      // createTime: null,
      // updateTime: null,
    };
  };

  const selectedKeys = ref([]);

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  } as TableRowSelection);

  const isCreating = ref(false);
  const isUpdating = ref(false);
  const isAssigning = ref(false);
  const isAssignListFinished = ref(false);
  let form = reactive(generateFormModel());

  const handleBatchDeleteClick = () => {
    deleteAdminBatch(selectedKeys.value);
  };
  const handleCreateClick = () => {
    isCreating.value = true;
  };
  const handleUpdateClick = (admin: Admin) => {
    copy(admin, form);
    isUpdating.value = true;
  };
  const handleBeforeOk = (done: any) => {
    if (isCreating.value) {
      addAdmin(form as unknown as Admin);
    } else if (isUpdating.value) {
      updateAdmin(form as unknown as Admin);
    } else {
      doAssign(selectedAdmin.id, selectedOptions.value);
    }
    done();
    handleClose();
    search();
  };
  const handleClose = () => {
    isCreating.value = false;
    isUpdating.value = false;
    isAssigning.value = false;
    form = reactive(generateFormModel());
  };
  const assignAdmin = async (admin: Admin) => {
    isAssignListFinished.value = false;
    isAssigning.value = true;
    selectedAdmin = admin;
    const { data } = await toAssign(admin.id);
    options = ref(data.allRolesList);
    selectedOptions = ref(data.assignRoles.map((role: Role) => role.id));
    isAssignListFinished.value = true;
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
    pageSize: 10,
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
    // {
    //   title: t('admin.columns.index'),
    //   dataIndex: 'index',
    //   slotName: 'index',
    // },
    {
      title: t('admin.columns.id'),
      dataIndex: 'id',
    },
    {
      title: t('admin.columns.username'),
      dataIndex: 'username',
    },
    {
      title: t('admin.columns.avatar'),
      dataIndex: 'avatar',
      slotName: 'avatar',
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
      renderData.value = data.records;
      pagination.current = current;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const deleteAdminById = async (id: number) => {
    setLoading(true);
    try {
      await deleteAdmin(id);
      fetchData(pagination.current, pagination.pageSize, formModel.value);
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
    name: 'Admin',
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
  a-img {
    display: block;
    width: 100px;
    height: 100px;
  }
</style>
