<template>
  <div class="container">
    <Breadcrumb :items="['menu.list', 'menu.dispatch.goods.supply']" />
    <a-card class="general-card" :title="$t('menu.dispatch.goods.supply')">
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item
                  field="number"
                  :label="$t('supply.form.number')"
                >
                  <a-input
                    v-model=formModel.id
                    :placeholder="$t('supply.form.number.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                    field="name"
                    :label="$t('supply.form.name')"
                >
                  <a-input
                      v-model=formModel.name
                      :placeholder="$t('supply.form.name.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                    field="province"
                    :label="$t('supply.form.province')"
                >
                  <a-input
                      v-model=formModel.province
                      :placeholder="$t('supply.form.province.placeholder')"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="searchSupplyBy(formModel.id,formModel.name,formModel.province)">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('supply.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('supply.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="handleCreateClick">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('supply.operation.create') }}
            </a-button>
            <a-upload action="/">
              <template #upload-button>
                <a-button>
                  {{ $t('supply.operation.import') }}
                </a-button>
              </template>
            </a-upload>
          </a-space>
        </a-col>
        <a-col
          :span="12"
          style="display: flex; align-items: center; justify-content: end"
        >
          <a-button>
            <template #icon>
              <icon-download />
            </template>
            {{ $t('supply.operation.download') }}
          </a-button>
          <a-tooltip :content="$t('supply.actions.refresh')">
            <div class="action-icon" @click="fresh"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="$t('supply.actions.density')">
              <div class="action-icon"><icon-line-height size="18" /></div>
            </a-tooltip>
            <template #content>
              <a-doption
                v-for="item in densitylist"
                :key="item.value"
                :value="item.value"
                :class="{ active: item.value === size}"
              >
                <span>{{ item.name }}</span>
              </a-doption>
            </template>
          </a-dropdown>
          <a-tooltip :content="$t('supply.actions.columnSetting')">
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
          :title="$t(`supply.form.title.${isCreating ? 'create' : 'update'}`)"
          @cancel="handleClose"
          @before-ok="handleBeforeOk"
      >
        <a-form :model="form">
          <a-form-item
              v-for="(val, key) in form"
              :key="key"
              :field="key"
              :label="$t(`supply.form.${key}`)"
          >
            <a-input
                v-model="form[key]"
                :placeholder="$t(`supply.form.${key}.placeholder`)"
            />
          </a-form-item>
        </a-form>
      </a-modal>

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
          <span v-if="record.status === 'waste'" class="circle"></span>
          <span
              v-else-if="record.status === 'using'"
              class="circle pass"
          ></span>
          {{ $t(`supply.form.status.${record.status}`) }}
        </template>
        <!-- 表格form里 -->

        <!-- table里 -->
        <!-- 删改 -->
        <template #operations="{ record }">
          <a-button
              v-permission="['admin']"
              type="text"
              size="small"
              @click="deleteSupplyById(record.id)"
          >
            {{ $t('supply.columns.operations.delete') }}
          </a-button>
          <a-button
              v-permission="['admin']"
              type="text"
              size="small"
              @click="handleUpdateClick(record)"
          >
            {{ $t('supply.columns.operations.update') }}
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
  import {addSupply,deleteSupply,updateSupply,querySupplyList,searchSupplyList,Supply} from "@/api/dispatch";
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import copy from "@/utils/objects";

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const generateFormModel = () => {
    return {
      id: '',
      name: '',
      phone:'',
      postCode:'',
      province:'',
      city:'',
      detailAddress:'',
    };
  };


  const isCreating = ref(false);
  const isUpdating = ref(false);

  let form = reactive(generateFormModel());

  const handleCreateClick = () => {
    isCreating.value = true;
  };
  const handleUpdateClick = (supply: Supply) => {
    copy(supply, form);
    isUpdating.value = true;
  };
  const handleBeforeOk = (done: any) => {
    console.log(form);
    if (isCreating.value) {
      addSupply(form as unknown as Supply);
    } else {
      updateSupply(form as unknown as Supply);
    }
    handleClose();
  };
  const handleClose = () => {
    isCreating.value = false;
    isUpdating.value = false;
    form = reactive(generateFormModel());
  };

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<Supply[]>([]);
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
  const densitylist = computed(() => [
    {
      name: t('supply.size.mini'),
      value: 'mini',
    },
    {
      name: t('supply.size.small'),
      value: 'small',
    },
    {
      name: t('supply.size.medium'),
      value: 'medium',
    },
    {
      name: t('supply.size.large'),
      value: 'large',
    },
  ]);
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('supply.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
    },
    {
      title: t('supply.columns.number'),
      dataIndex: 'id',
    },
    {
      title: t('supply.columns.name'),
      dataIndex: 'name',
    },

    {
      title: t('supply.columns.phone'),
      dataIndex: 'phone',
    },
    {
      title: t('supply.columns.province'),
      dataIndex: 'province',
    },
    {
      title: t('supply.columns.detailAddress'),
      dataIndex: 'detailAddress',
    },
    {
      title: t('supply.columns.postCode'),
      dataIndex: 'postCode',
    },
    {
      title: t('supply.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);
  const contentTypeOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('supply.form.contentType.img'),
      value: 'img',
    },
    {
      label: t('supply.form.contentType.horizontalVideo'),
      value: 'horizontalVideo',
    },
    {
      label: t('supply.form.contentType.verticalVideo'),
      value: 'verticalVideo',
    },
  ]);
  const filterTypeOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('supply.form.filterType.artificial'),
      value: 'artificial',
    },
    {
      label: t('supply.form.filterType.rules'),
      value: 'rules',
    },
  ]);
  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('supply.form.status.using'),
      value: 'using',
    },
    {
      label: t('supply.form.status.waste'),
      value: 'waste',
    },
  ]);
  const fetchData = async (
      page: number,
      pageSize: number,
      params: Partial<Supply>
  ) => {
    setLoading(true);
    try {
      const { data } = await querySupplyList(page, pageSize, params);
      renderData.value = data.records;
      pagination.current = page;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  const searchSupplyBy = (id:string,name:string,province:string) => {

    searchData(pagination.current, pagination.pageSize,id,name,province);

  };
  const searchData = async (
      page: number,
      pageSize: number,
      id: string,
      name:string,
      province:string,
  ) => {
    setLoading(true);
alert(id+name+province);
    try {
      const { data } = await searchSupplyList(page, pageSize,id,name,province);
      renderData.value = data.records;
      pagination.current = page;
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

  const fresh = () => {
    fetchData(basePagination.current, basePagination.pageSize, formModel.value);
  };

  const onPageChange = (current: number) => {
    fetchData(current, basePagination.pageSize, formModel.value);
  };
  fetchData(pagination.current, pagination.pageSize, formModel.value);
  const reset = () => {
    formModel.value = generateFormModel();
  };

  const handleSelectDensity = (
    val: string | number | Record<string, any> | undefined,
    e: Event
  ) => {
    size.value = val as SizeProps;
  };


  const deleteSupplyById = async (id: number) => {
    setLoading(true);
    try {
      await deleteSupply(id);
      fetchData(pagination.current, pagination.pageSize, formModel.value);
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
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
      // 先替换后面的，然后拿到替换的结果替换前面
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
    name: 'supply',
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
