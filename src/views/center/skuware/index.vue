<template>
  <div class="container">
    <Breadcrumb :items="['menu.center', 'menu.center.skuWare']" />
    <a-card class="general-card" :title="$t('menu.center.skuWare')">
      <a-row>
        <a-col :flex="1">
          <!--          三个输入框-->
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <!--              <a-col :span="8">-->
              <!--                <a-form-item-->
              <!--                  field="id"-->
              <!--                  :label="$t('skuWare.form.id')"-->
              <!--                >-->
              <!--                  <a-input-->
              <!--                    v-model="formModel.id"-->
              <!--                    :placeholder="$t('skuWare.form.id.placeholder')"-->
              <!--                  />-->
              <!--                </a-form-item>-->
              <!--              </a-col>-->
              <a-col :span="8">
                <a-form-item field="wareId" :label="$t('skuWare.form.wareId')">
                  <a-input
                    v-model="formModel.wareId"
                    :placeholder="$t('skuWare.form.wareId.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="skuId" :label="$t('skuWare.form.skuId')">
                  <a-input
                    v-model="formModel.skuId"
                    :placeholder="$t('skuWare.form.skuId.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="skuName"
                  :label="$t('skuWare.form.skuName')"
                >
                  <a-input
                    v-model="formModel.skuName"
                    :placeholder="$t('skuWare.form.skuName.placeholder')"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>

        <a-divider style="height: 84px" direction="vertical" />
        <!--        两个按钮：查找和重置-->
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('skuWare.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('skuWare.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>

      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <!--新建、批量导入-->
            <a-button type="primary" @click="handleCreateClick">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('skuWare.operation.create') }}
            </a-button>
            <a-button type="primary" @click="skuListInWare()">
              <template #icon>
                <icon-plus />
              </template>
              批量进货
            </a-button>
            <a-upload @before-upload="(file: File) => {
                formCSV(file, (order: any) => {
                    order.forEach((order: SkuWare) => {
                      addSkuWare(SkuWare);
                    });
                    return true;
                  });
                }">
              <template #upload-button>
                <a-button>
                  {{ $t('skuWare.operation.import') }}
                </a-button>
              </template>
            </a-upload>
          </a-space>
        </a-col>
        <a-col
          :span="12"
          style="display: flex; align-items: center; justify-content: end"
        >
          <!--右边的四个操作-->
          <!--下载-->
          <a-button @click="downloadSkuWareList">
            <template #icon>
              <icon-download />
            </template>
            下载列表
          </a-button>
          <!-- 刷新-->
          <a-tooltip :content="$t('skuWare.actions.refresh')">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <!--密度选择-->
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="$t('skuWare.actions.density')">
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
          <!--列設置-->
          <a-tooltip :content="$t('skuWare.actions.columnSetting')">
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
        :visible="isCreating || isUpdating || isReturning"
        :title="$t(`skuWare.form.title.${isCreating ? 'create' : 'update'}`)"
        @cancel="handleClose"
        @before-ok="handleBeforeOk"
      >
        <a-form :model="form">
          <a-form-item
            v-for="(val, key) in form"
            :key="key"
            :field="key"
            :label="$t(`skuWare.form.${key}`)"
          >
            <a-input
              v-if="
                key !== 'createTime' && key !== 'updateTime' && key !== 'stock'
              "
              v-model="form[key]"
              disabled
              :placeholder="$t(`skuWare.form.${key}.placeholder`)"
            />
            <a-input
              v-else-if="key === 'stock' && isCreating"
              v-model="form[key]"
              required
              placeholder="请输入新增商品数量"
              :rules="[{ required: true, message: 'name is required' }]"
            />
            <a-input
              v-else-if="key === 'stock' && isUpdating"
              v-model="form[key]"
              required
              placeholder="请输入手动补货商品数量"
            />
            <a-input
              v-if="key === 'stock' && isReturning"
              v-model="form[key]"
              required
              placeholder="请输入退货到供应商的商品数量"
              :rules="[{ required: true, message: 'name is required' }]"
            />
            <a-date-picker
              v-else-if="key === 'createTime' || key === 'updateTime'"
              v-model="form[key]"
              disabled
              style="width: 100%"
              show-time
              :time-picker-props="{ defaultValue: '00:00:00' }"
              format="YYYY-MM-DD HH:mm:ss"
            />
          </a-form-item>
        </a-form>
      </a-modal>

      <a-table
        id="printTable"
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="(cloneColumns as TableColumnData[])"
        :data="renderData"
        :bordered="false"
        :size="size"
        @page-change="onPageChange"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
        <template #operations="{ record }">
          <a-button
            v-permission="['admin']"
            type="text"
            size="small"
            @click="handleUpdateClick(record)"
          >
            {{ $t('skuWare.form.title.addsku') }}
          </a-button>
          <a-button
            v-permission="['admin']"
            type="text"
            size="small"
            @click="returnSkuWare(record)"
          >
            退货到供应商
          </a-button>
          <!--                    库存为0的时候可以删除-->
          <!--                    <a-button-->
          <!--                      v-if="record.stock===0"-->
          <!--                        v-permission="['admin']"-->
          <!--                        type="text"-->
          <!--                        size="small"-->
          <!--                        @click="deleteSkuWareById(record.id)"-->
          <!--                    >-->
          <!--                      {{ $t('SkuWare.columns.operations.assign') }}-->
          <!--                    </a-button>-->
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
    querySkuWareList,
    SkuWare,
    addSkuWare,
    returnSkuWareToSupplier,
  } from '@/api/center';
  import { Pagination } from '@/types/global';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import copy from '@/utils/objects';
  import htmlToPdf from '@/utils/pdf';
  import { useRouter } from 'vue-router';
  import { formCSV } from "@/utils/csv";
  import { AddRole, Role } from "@/api/acl";

  const generateFormModel = () => {
    return {
      // id: '',
      skuId: '',
      skuName: '',
      wareId: '',
      stock: '',
      lockStock: '',
      lowStock: '',
      maxStock: '',
      sale: '',
      createTime: null,
      updateTime: null,
    };
  };

  const router = useRouter();
  const skuListInWare = () => {
    router.push({
      name: 'skuListInWare',
    });
  };

  // const handleView = (groupId: number) => {
  //   router.push({
  //     name: 'attr',
  //     params: {
  //       groupId,
  //     },
  //   });

  const isCreating = ref(false);
  const isUpdating = ref(false);
  const isReturning = ref(false);
  let form = reactive(generateFormModel());

  // 下载整个库存列表
  const downloadSkuWareList = () => {
    const text = '所有库存信息';
    // text:文件标题
    htmlToPdf(text, '#printTable');
  };

  // 库存信息展示
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('skuWare.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
    },
    // {
    //   title: t('skuWare.columns.id'),
    //   dataIndex: 'id',
    // },
    {
      title: t('skuWare.columns.wareId'),
      dataIndex: 'wareId',
      slotName: 'wareId',
    },
    {
      title: t('skuWare.columns.skuId'),
      dataIndex: 'skuId',
    },
    {
      title: t('skuWare.columns.skuName'),
      dataIndex: 'skuName',
    },
    {
      title: t('skuWare.columns.stock'),
      dataIndex: 'stock',
    },
    {
      title: t('skuWare.columns.lockStock'),
      dataIndex: 'lockStock',
    },
    {
      title: t('skuWare.columns.lowStock'),
      dataIndex: 'lowStock',
    },
    {
      title: t('skuWare.columns.maxStock'),
      dataIndex: 'maxStock',
    },
    {
      title: t('skuWare.columns.sale'),
      dataIndex: 'sale',
    },
    // {
    //   title: t('skuWare.columns.createTime'),
    //   dataIndex: 'createTime',
    //   slotName:'createTime',
    // },
    {
      title: t('skuWare.columns.updateTime'),
      dataIndex: 'updateTime',
      slotName: 'updateTime',
    },
    {
      title: t('skuWare.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);
  // 新建商品
  const handleCreateClick = () => {
    isCreating.value = true;
  };
  // 手动补货
  const handleUpdateClick = (skuWare: SkuWare) => {
    skuWare.stock = '';
    copy(skuWare, form);
    isUpdating.value = true;
  };
  // 往后面传参数的时候记得异步操作
  const handleBeforeOk = async () => {
    if (isCreating.value) {
      await addSkuWare(form as unknown as SkuWare);
    } else if (isUpdating.value) {
      await addSkuWare(form as unknown as SkuWare);
    } else {
      await returnSkuWareToSupplier(form as unknown as SkuWare);
    }
    handleClose();
  };
  const handleClose = () => {
    isCreating.value = false;
    isUpdating.value = false;
    isReturning.value = false;
    form = reactive(generateFormModel());
    fetchData(basePagination.current, basePagination.pageSize, formModel.value);
  };

  // 退货到供应商
  const returnSkuWare = async (skuWare: SkuWare) => {
    skuWare.stock = '';
    copy(skuWare, form);
    isReturning.value = true;
    // await returnSkuWareToSupplier(skuWare);
  };

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<SkuWare[]>([]);
  const formModel = ref(generateFormModel());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);

  const size = ref<SizeProps>('medium');

  const basePagination: Pagination = {
    current: 1,
    pageSize: 20,
  };

  const densityList = computed(() => [
    {
      name: t('skuWare.size.mini'),
      value: 'mini',
    },
    {
      name: t('skuWare.size.small'),
      value: 'small',
    },
    {
      name: t('skuWare.size.medium'),
      value: 'medium',
    },
    {
      name: t('skuWare.size.large'),
      value: 'large',
    },
  ]);

  const reset = () => {
    formModel.value = generateFormModel();
    fetchData(basePagination.current, basePagination.pageSize, formModel.value);
  };

  // 分页查询。条件查询
  const pagination = reactive({
    ...basePagination,
  });
  const fetchData = async (
    current: number,
    pageSize: number,
    params: Partial<SkuWare>
  ) => {
    setLoading(true);
    try {
      const { data } = await querySkuWareList(current, pageSize, params);
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
    console.log(formModel.value);
    fetchData(basePagination.current, basePagination.pageSize, formModel.value);
  };
  const onPageChange = (current: number) => {
    fetchData(current, basePagination.pageSize, formModel.value);
  };

  fetchData(pagination.current, pagination.pageSize, formModel.value);

  // 密度选择
  const handleSelectDensity = (
    val: string | number | Record<string, any> | undefined,
    e: Event
  ) => {
    size.value = val as SizeProps;
  };

  // 用于处理列的显示/隐藏操作
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

  // 用于交换数组中两个元素的位置
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

  // 处理弹出框的显示状态变化
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
    // watch函数来监视columns的变化，并在变化发生时执行相应的回调函数。
    () => columns.value,
    // 当 columns 的值发生变化时，监视函数会被调用，并且箭头函数会被执行，返回 columns 的当前值。
    (val) => {
      // 监视函数
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value.forEach((item, index) => {
        item.checked = true;
      });
      showColumns.value = cloneDeep(cloneColumns.value);
      // 使用cloneDeep函数将columns的值深拷贝到cloneColumns变量中。
      // 遍历cloneColumns中的每个元素，将其checked属性设置为true。
      // 使用cloneDeep函数将cloneColumns的值深拷贝到showColumns变量中。
    },
    { deep: true, immediate: true }
    // 通过使用watch函数的deep选项和immediate选项，可以实现对columns值的深度监视，并在组件初始化时立即执行一次回调函数。
    // deep：布尔值，表示是否进行深度监视。默认为 false，即只监视 source 的第一层属性变化。如果设置为 true，则会递归监视所有嵌套属性的变化。
    // immediate：布尔值，表示是否在初始化时立即执行监视函数。默认为 false，即只在 source 的值变化后才执行监视函数。如果设置为 true，则在初始化时立即执行监视函数。
  );
</script>

<script lang="ts">
  export default {
    name: 'SkuWare',
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
