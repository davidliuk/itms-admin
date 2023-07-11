<template>
  <div class="container">
    <Breadcrumb :items="['menu.product', 'menu.product.category']" />
    <a-card class="general-card" :title="$t('menu.product.category')">
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
                <a-form-item field="id" :label="$t('category.form.id')">
                  <a-input
                    v-model="formModel.id"
                    :placeholder="$t('category.form.id.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="name" :label="$t('category.form.name')">
                  <a-input
                    v-model="formModel.name"
                    :placeholder="$t('category.form.name.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="code" :label="$t('category.form.code')">
                  <a-input
                    v-model="formModel.code"
                    :placeholder="$t('category.form.code.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="remark" :label="$t('category.form.remark')">
                  <a-input
                    v-model="formModel.remark"
                    :placeholder="$t('category.form.remark.placeholder')"
                  />
                  <!-- <a-select
                    v-model="formModel.remark"
                    :options="filterTypeOptions"
                    :placeholder="$t('category.form.selectDefault')"
                  /> -->
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="createTime"
                  :label="$t('category.form.createTime')"
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
                  :label="$t('category.form.updateTime')"
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
                  :label="$t('category.form.status')"
                >
                  <a-select
                    v-model="formModel.status"
                    :options="statusOptions"
                    :placeholder="$t('category.form.selectDefault')"
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
              {{ $t('category.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('category.form.reset') }}
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
              {{ $t('category.operation.create') }}
            </a-button>
            <a-upload action="/">
              <template #upload-button>
                <a-button>
                  {{ $t('category.operation.import') }}
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
            {{ $t('category.operation.download') }}
          </a-button>
          <a-tooltip :content="$t('category.actions.refresh')">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <!-- 密度 -->
            <a-tooltip :content="$t('category.actions.density')">
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
          <a-tooltip :content="$t('category.actions.columnSetting')">
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
        :title="$t(`category.form.title.${isCreating ? 'create' : 'update'}`)"
        @cancel="handleClose"
        @before-ok="handleBeforeOk"
      >
        <a-form :model="form">
          <a-form-item
            v-for="(val, key) in form"
            :key="key"
            :field="key"
            :label="$t(`category.form.${key}`)"
          >
            <a-input
              v-model="form[key]"
              :placeholder="$t(`category.form.${key}.placeholder`)"
            />
          </a-form-item>
        </a-form>
      </a-modal>
      <a-modal
        :visible="isAssigning"
        :title="$t('category.form.title.assign')"
        @cancel="handleClose"
        @before-ok="handleBeforeOk"
      >
        <a-space direction="vertical" size="large">
          <a-cascader
            v-if="!isAssignListFinished"
            :options="[]"
            :style="{ width: '480px' }"
            placeholder="Please select ..."
            loading
          />
          <a-cascader
            v-else
            :options="options"
            :field-names="fieldNames"
            :style="{ width: '480px' }"
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
        <template #imgUrl="{ record }">
          <img
            :src="record.imgUrl"
            alt="Category Image"
            style="width: 100px; height: 100px"
          />
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
          {{ $t(`category.form.status.${record.status}`) }}
        </template>
        <!-- 表格form里 -->

        <!-- table里 -->
        <!-- 查看 -->
        <template #operations="{ record }">
          <a-button
            v-permission="['admin']"
            type="text"
            size="small"
            @click="deleteCategoryById(record.id)"
          >
            {{ $t('category.columns.operations.delete') }}
          </a-button>
          <a-button
            v-permission="['admin']"
            type="text"
            size="small"
            @click="handleUpdateClick(record)"
          >
            {{ $t('category.columns.operations.update') }}
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
    Permission,
    queryPermissionList,
    queryCategoryList,
    Category,
  } from '@/api/product';
  import { Pagination } from '@/types/global';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import copy from '@/utils/objects';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };
  const fieldNames = { value: 'id', label: 'name' };
  const isAssignListFinished = ref(false);
  const generateFormModel = () => {
    return {
      id: '',
      name: '',
      imgUrl: '',
      status: 0,
      sort: 0,
      createTime: null,
      updateTime: null,
    };
  };

  const selectedKeys = ref([]);

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  });

  let options: Permission[];

  const isCreating = ref(false);
  const isUpdating = ref(false);
  const isAssigning = ref(false);
  // const form = reactive({
  //   username: '',
  //   name: '',
  //   password: '',
  //   phone: '',
  //   email: '',
  //   wareId: '',
  //   stationId: '',
  // });
  let form = reactive(generateFormModel());
  const handleCreateClick = () => {
    isCreating.value = true;
  };
  const handleUpdateClick = (category: Category) => {
    copy(category, form);
    // form = admin;
    isUpdating.value = true;
  };
  const handleBeforeOk = (done) => {
    // window.setTimeout(() => {
    //   done();
    //   // prevent close
    //   // done(false)
    //   handleClose();
    // }, 3000);
    if (isCreating.value) {
      //   addCategory(form as unknown as Category);
      // } else {
      //   updateCategory(form as unknown as Category);
    }
    handleClose();
  };
  const handleClose = () => {
    isCreating.value = false;
    isUpdating.value = false;
    isAssigning.value = false;
    form = reactive(generateFormModel());
  };
  const assignCategory = async (category: Category) => {
    isAssignListFinished.value = false;
    isAssigning.value = true;
    const { data } = await queryPermissionList();
    options = reactive(data);
    isAssignListFinished.value = true;
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<Category[]>([]);
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
      name: t('category.size.mini'),
      value: 'mini',
    },
    {
      name: t('category.size.small'),
      value: 'small',
    },
    {
      name: t('category.size.medium'),
      value: 'medium',
    },
    {
      name: t('category.size.large'),
      value: 'large',
    },
  ]);

  const columns = computed<TableColumnData[]>(() => [
    // {
    //   title: t('category.columns.index'),
    //   dataIndex: 'index',
    //   slotName: 'index',
    // },
    {
      title: t('category.columns.id'),
      dataIndex: 'id',
    },
    {
      title: t('category.columns.name'),
      dataIndex: 'name',
    },
    {
      title: t('category.columns.imgUrl'),
      dataIndex: 'imgUrl',
      slotName: 'imgUrl',
    },
    {
      title: t('category.columns.status'),
      dataIndex: 'status',
    },
    {
      title: t('category.columns.sort'),
      dataIndex: 'sort',
    },
    {
      title: t('category.columns.createTime'),
      dataIndex: 'createTime',
    },
    {
      title: t('category.columns.updateTime'),
      dataIndex: 'updateTime',
    },
    // {
    //   title: t('category.columns.code'),
    //   dataIndex: 'code',
    //   slotName: 'code',
    // },
    // {
    //   title: t('category.columns.sku_name'),
    //   dataIndex: 'sku_name',
    //   slotName: 'sku_name',
    // },
    // {
    //   title: t('category.columns.sku_num'),
    //   dataIndex: 'sku_num',
    // },
    // {
    //   title: t('category.columns.status'),
    //   dataIndex: 'status',
    //   slotName: 'status',
    // },
    {
      title: t('category.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);

  // //过滤器
  //   const filterTypeOptions = computed<SelectOptionData[]>(() => [
  //     {
  //       label: t('category.form.filterType.artificial'),
  //       value: 'artificial',
  //     },
  //     {
  //       label: t('category.form.filterType.rules'),
  //       value: 'rules',
  //     },
  //   ]);

  // 分页
  const fetchData = async (
    current: number,
    pageSize: number,
    params: Category
  ) => {
    setLoading(true);
    try {
      const { data } = await queryCategoryList(current, pageSize, params);
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
    name: 'Category',
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
