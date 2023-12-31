<template>
  <div class="container">
    <Breadcrumb :items="['menu.acl', 'menu.acl.permission']" />
    <a-card class="general-card" :title="$t('menu.acl.permission')">
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
              {{ $t('permission.operation.create') }}
            </a-button>
            <a-upload
              @before-upload="(file: File) => {
                formCSV(file, (order: any) => {
                    order.forEach((permit: Permission) => {
                      addPermission(permit);
                    });
                    return true;
                  });
                }"
            >
              <template #upload-button>
                <a-button>
                  {{ $t('permission.operation.import') }}
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
                toCSV(renderData, 'permission');
              }
            "
          >
            <template #icon>
              <icon-download />
            </template>
            {{ $t('permission.operation.download') }}
          </a-button>
          <a-tooltip :content="$t('permission.actions.refresh')">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <!-- 密度 -->
            <a-tooltip :content="$t('permission.actions.density')">
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
          <a-tooltip :content="$t('permission.actions.columnSetting')">
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
        :title="$t(`permission.form.title.${isCreating ? 'create' : 'update'}`)"
        @cancel="handleClose"
        @before-ok="handleBeforeOk"
      >
        <a-form :model="form">
          <a-form-item
            v-for="(val, key) in form"
            :key="key"
            :field="key"
            :label="$t(`permission.form.${key}`)"
          >
            <a-input
              v-model="form[key]"
              :placeholder="$t(`permission.form.${key}.placeholder`)"
            />
          </a-form-item>
        </a-form>
      </a-modal>

      <!-- 表格 -->
      <a-table
        row-key="id"
        :loading="loading"
        :columns="(cloneColumns as TableColumnData[])"
        :data="renderData"
        :bordered="false"
        :default-expanded-keys="[1]"
        :default-expand-all-rows="true"
        :size="size"
      >
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
          {{ $t(`permission.form.status.${record.status}`) }}
        </template>
        <template #type="{ record }">
          <span v-if="record.type === 'no_shipped'" class="circle"></span>
          <span
            v-else-if="record.type === 'shipped'"
            class="circle pass"
          ></span>
          <span
            v-else-if="record.type === 'stocked'"
            class="circle pass"
          ></span>
          {{ $t(`permission.form.type.${record.type}`) }}
        </template>
        <!-- 表格form里 -->

        <!-- table里 -->
        <!-- 查看 -->
        <template #operations>
          <!-- <a-button v-permission="['admin']" type="text" size="small">
            {{ $t('permission.columns.operations.view') }}
          </a-button> -->
          <a-button
            v-permission="['admin']"
            type="text"
            size="small"
            @click="handleCreateClick(record)"
          >
            {{ $t('permission.columns.operations.create') }}
          </a-button>
          <a-button
            v-permission="['admin']"
            type="text"
            size="small"
            @click="deleteById(record.id)"
          >
            {{ $t('permission.columns.operations.delete') }}
          </a-button>
          <a-button
            v-permission="['admin']"
            type="text"
            size="small"
            @click="handleUpdateClick(record)"
          >
            {{ $t('permission.columns.operations.update') }}
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
    queryPermissionList,
    Permission,
    addPermission,
    updatePermission,
    deletePermission,
    Role,
    AddRole,
  } from '@/api/acl';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import copy from '@/utils/objects';
  import { formCSV, toCSV } from '@/utils/csv';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<Permission[]>([]);
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);

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

  const isCreating = ref(false);
  const isUpdating = ref(false);
  let form = reactive(generateFormModel());

  const handleCreateClick = () => {
    isCreating.value = true;
  };
  const handleUpdateClick = (admin: Permission) => {
    copy(admin, form);
    isUpdating.value = true;
  };
  const handleBeforeOk = async (done) => {
    if (isCreating.value) {
      await addPermission(form as unknown as Permission);
    } else {
      await updatePermission(form as unknown as Permission);
    }
    done();
    handleClose();
    search();
  };
  const handleClose = () => {
    isCreating.value = false;
    isUpdating.value = false;
    form = reactive(generateFormModel());
  };
  const deleteById = async (id: number) => {
    await deletePermission(id);
    search();
  };

  const size = ref<SizeProps>('medium');

  const densityList = computed(() => [
    {
      name: t('permission.size.mini'),
      value: 'mini',
    },
    {
      name: t('permission.size.small'),
      value: 'small',
    },
    {
      name: t('permission.size.medium'),
      value: 'medium',
    },
    {
      name: t('permission.size.large'),
      value: 'large',
    },
  ]);

  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('permission.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
    },
    {
      title: t('permission.columns.id'),
      dataIndex: 'id',
    },
    {
      title: t('permission.columns.name'),
      dataIndex: 'name',
    },
    {
      title: t('permission.columns.code'),
      dataIndex: 'code',
    },
    {
      title: t('permission.columns.type'),
      dataIndex: 'type',
      slotName: 'type',
    },
    {
      title: t('permission.columns.status'),
      dataIndex: 'status',
      slotName: 'status',
    },
    {
      title: t('permission.columns.createTime'),
      dataIndex: 'createTime',
    },
    {
      title: t('permission.columns.updateTime'),
      dataIndex: 'updateTime',
    },
    {
      title: t('permission.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);

  // 分页
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await queryPermissionList();
      renderData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    fetchData();
  };
  // const onPageChange = (current: number) => {
  //   fetchData();
  // };
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
    name: 'Permission',
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
