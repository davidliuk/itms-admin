<template>
  <div class="container">
    <Breadcrumb :items="['menu.product', 'menu.product.attr']" />
    <a-card class="general-card" :title="$t('menu.product.attr')">
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
              {{ $t('attr.operation.create') }}
            </a-button>
            <a-upload action="/">
              <template #upload-button>
                <a-button>
                  {{ $t('attr.operation.import') }}
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
            {{ $t('attr.operation.download') }}
          </a-button>
          <a-tooltip :content="$t('attr.actions.refresh')">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <!-- 密度 -->
            <a-tooltip :content="$t('attr.actions.density')">
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
          <a-tooltip :content="$t('attr.actions.columnSetting')">
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
        :title="$t(`attr.form.title.${isCreating ? 'create' : 'update'}`)"
        @cancel="handleClose"
        @before-ok="handleBeforeOk"
      >
        <a-form :model="form">
          <a-form-item
            v-for="(val, key) in form"
            :key="key"
            :field="key"
            :label="$t(`attr.form.${key}`)"
          >
            <a-input-tag
              v-if="key == 'selectList'"
              v-model="form[key]"
              :style="{ width: '380px' }"
              :placeholder="$t(`attr.form.${key}.placeholder`)"
              allow-clear
            />
            <a-input
              v-else
              v-model="form[key]"
              :disabled="key == 'id'"
              :placeholder="$t(`attr.form.${key}.placeholder`)"
            />
          </a-form-item>
        </a-form>
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
          {{ $t(`attr.form.status.${record.status}`) }}
        </template>
        <!-- 表格form里 -->
        <template #selectList="{ record }">
          <a-input-tag
            :default-value="record.selectList.split(',')"
            :style="{ width: '320px' }"
            :max-tag-count="5"
            placeholder="$t(`attr.form.selectList.null`)"
            readonly
          />
        </template>

        <!-- table里 -->
        <!-- 查看 -->
        <template #operations="{ record }">
          <a-button
            v-permission="['admin']"
            type="text"
            size="small"
            @click="deleteAttrById(record.id)"
          >
            {{ $t('attr.columns.operations.delete') }}
          </a-button>
          <a-button
            v-permission="['admin']"
            type="text"
            size="small"
            @click="handleUpdateClick(record)"
          >
            {{ $t('attr.columns.operations.update') }}
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
    getAttrByGroupId,
    addAttr,
    updateAttr,
    deleteAttr,
    Attr,
  } from '@/api/product';
  import { Pagination } from '@/types/global';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import copy from '@/utils/objects';

  import { useRoute } from 'vue-router';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const generateFormModel = () => {
    return {
      id: '',
      name: '',
      selectList: [],
      // createTime: null,
      // updateTime: null,
    };
  };

  const selectedKeys = ref([]);

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  });

  const isCreating = ref(false);
  const isUpdating = ref(false);
  const isAssigning = ref(false);
  let form = reactive(generateFormModel());

  const handleCreateClick = () => {
    isCreating.value = true;
  };
  const handleUpdateClick = (attr: Attr) => {
    copy(attr, form);
    form.selectList = attr.selectList.split(',');
    isUpdating.value = true;
  };
  const handleBeforeOk = (done) => {
    if (isCreating.value) {
      const value = form as unknown as Attr;
      value.selectList = form.selectList.join(',');
      value.groupId = route.params.groupId;
      addAttr(form as unknown as Attr);
    } else if (isUpdating.value) {
      const value = form as unknown as Attr;
      value.selectList = form.selectList.join(',');
      value.groupId = route.params.groupId;
      updateAttr(form as unknown as Attr);
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
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<Attr[]>([]);
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
      name: t('attr.size.mini'),
      value: 'mini',
    },
    {
      name: t('attr.size.small'),
      value: 'small',
    },
    {
      name: t('attr.size.medium'),
      value: 'medium',
    },
    {
      name: t('attr.size.large'),
      value: 'large',
    },
  ]);

  const columns = computed<TableColumnData[]>(() => [
    // {
    //   title: t('attr.columns.index'),
    //   dataIndex: 'index',
    //   slotName: 'index',
    // },
    {
      title: t('attr.columns.id'),
      dataIndex: 'id',
    },
    {
      title: t('attr.columns.name'),
      dataIndex: 'name',
    },
    {
      title: t('attr.columns.inputType'),
      dataIndex: 'inputType',
    },
    {
      title: t('attr.columns.selectList'),
      dataIndex: 'selectList',
      slotName: 'selectList',
    },
    {
      title: t('attr.columns.createTime'),
      dataIndex: 'createTime',
    },
    {
      title: t('attr.columns.updateTime'),
      dataIndex: 'updateTime',
    },
    // {
    //   title: t('attr.columns.phone'),
    //   dataIndex: 'phone',
    //   slotName: 'phone',
    // },
    // {
    //   title: t('attr.columns.sku_name'),
    //   dataIndex: 'sku_name',
    //   slotName: 'sku_name',
    // },
    // {
    //   title: t('attr.columns.sku_num'),
    //   dataIndex: 'sku_num',
    // },
    // {
    //   title: t('attr.columns.status'),
    //   dataIndex: 'status',
    //   slotName: 'status',
    // },
    {
      title: t('attr.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);

  const route = useRoute();

  // 分页
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getAttrByGroupId(route.params.groupId);
      renderData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  const deleteAttrById = async (id: number) => {
    setLoading(true);
    try {
      await deleteAttr(id);
      // getAttrByGroupId()
      fetchData();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    fetchData();
  };
  const onPageChange = (current: number) => {
    fetchData();
  };
  fetchData();

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
    name: 'Attr',
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
