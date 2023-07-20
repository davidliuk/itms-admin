<template>
  <div class="container">
    <Breadcrumb :items="['menu.center', 'menu.center.stationTable']" />
    <a-card class="general-card" :title="$t('menu.center.stationTable')">
      <!--查询框-->
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <!--分站名称-->
              <a-col :span="8">
                <a-form-item field="name" :label="$t('stationTable.form.name')">
                  <a-input
                    v-model="formModel.name"
                    :placeholder="$t('stationTable.form.name.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <!--phone-->
              <a-col :span="8">
                <a-form-item
                  field="phone"
                  :label="$t('stationTable.form.phone')"
                >
                  <a-input
                    v-model="formModel.phone"
                    :placeholder="$t('stationTable.form.phone.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <!--省-->
              <a-col :span="8">
                <a-form-item
                  field="province"
                  :label="$t('stationTable.form.province')"
                >
                  <a-input
                    v-model="formModel.province"
                    :placeholder="$t('stationTable.form.province.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <!--市-->
              <a-col :span="8">
                <a-form-item field="city" :label="$t('stationTable.form.city')">
                  <a-input
                    v-model="formModel.city"
                    :placeholder="$t('stationTable.form.city.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <!--区-->
              <a-col :span="8">
                <a-form-item
                  field="district"
                  :label="$t('stationTable.form.district')"
                >
                  <a-input
                    v-model="formModel.district"
                    :placeholder="$t('stationTable.form.district.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <!--中心库房-->
              <a-col :span="8">
                <a-form-item
                  field="wareId"
                  :label="$t('stationTable.form.wareId')"
                >
                  <a-input
                    v-model="formModel.wareId"
                    :placeholder="$t('stationTable.form.wareId.placeholder')"
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
              {{ $t('stationTable.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('stationTable.form.reset') }}
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
              {{ $t('stationTable.operation.create') }}
            </a-button>
            <a-upload
              @before-upload="(file: File) => {
                formCSV(file, (order: any) => {
                    order.forEach((order: Station) => {
                      addStation(order);
                    });
                    return true;
                  });
                }"
            >
              <template #upload-button>
                <a-button>
                  {{ $t('stationTable.operation.import') }}
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
                toCSV(renderData, 'station-table');
              }
            "
          >
            <template #icon>
              <icon-download />
            </template>
            {{ $t('stationTable.operation.download') }}
          </a-button>
          <a-tooltip :content="$t('stationTable.actions.refresh')">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <!-- 密度 -->
            <a-tooltip :content="$t('stationTable.actions.density')">
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
          <a-tooltip :content="$t('stationTable.actions.columnSetting')">
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
      <!-- 增改-->
      <a-modal
        :visible="isCreating || isUpdating"
        :title="
          $t(`stationTable.form.title.${isCreating ? 'create' : 'update'}`)
        "
        @cancel="handleClose"
        @before-ok="handleBeforeOk"
      >
        <a-form :model="form">
          <a-form-item
            v-for="(val, key) in form"
            :key="key"
            :field="key"
            :label="$t(`stationTable.form.${key}`)"
          >
            <template v-if="key === 'id'">
              <a-input
                v-model="form[key]"
                :placeholder="$t(`stationTable.form.${key}.placeholder`)"
                disabled
              />
            </template>
            <template v-else-if="key === 'workStatus'">
              <a-select
                v-model="form[key]"
                :options="statusOptions"
                :placeholder="$t('stationTable.form.workStatus.placeholder')"
              />
            </template>

            <template v-else>
              <a-input
                v-model="form[key]"
                :placeholder="$t(`stationTable.form.${key}.placeholder`)"
              />
            </template>
          </a-form-item>
        </a-form>
      </a-modal>

      <a-modal
        :visible="isCreating"
        :title="$t(`stationTable.form.title.create`)"
        @cancel="handleClose"
        @before-ok="handleBeforeOk"
      >
        <a-form :model="form">
          <a-form-item
            v-for="(val, key) in form"
            :key="key"
            :field="key"
            :label="$t(`stationTable.form.${key}`)"
          >
            <template v-if="key === 'id'">
              <a-input
                v-model="form[key]"
                :placeholder="$t(`stationTable.form.${key}.placeholder`)"
                disabled
              />
            </template>
            <template v-else-if="key === 'workStatus'">
              <a-select
                v-model="form[key]"
                :options="statusOptions"
                :placeholder="$t('stationTable.form.workStatus.placeholder')"
              />
            </template>
            <template v-else-if="key === 'province' || key === 'district'">
              <!--              province: '', // 省市-->
              <!--              city: '', // 城市编号-->
              <!--              district: '', // 区域-->
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
            </template>

            <template v-else>
              <a-input
                v-model="form[key]"
                :placeholder="$t(`stationTable.form.${key}.placeholder`)"
              />
            </template>
          </a-form-item>
        </a-form>
      </a-modal>

      <!-- 详情-->
      <a-modal
        :visible="isDetailing"
        :title="$t(`stationTable.form.title.detail`)"
        draggable
        fullscreen
        hide-cancel
        @ok="handleDetailClose"
        @cancel="handleDetailClose"
      >
        <a-form :model="formShow">
          <a-form-item
            v-for="(val, key) in formShow"
            :key="key"
            :field="key"
            :label="$t(`stationTable.form.${key}`)"
          >
            <template v-if="key === 'workStatus'">
              <template v-if="formShow[key] === 0">
                <a-textarea
                  :placeholder="$t(`stationTable.form.workStatus.inBusiness`)"
                  style="width: 80%"
                  disabled
                />
              </template>
              <template v-else>
                <a-textarea
                  :placeholder="$t(`stationTable.form.workStatus.outBusiness`)"
                  style="width: 80%"
                  disabled
                />
              </template>
            </template>
            <template v-else>
              <a-textarea
                v-model="formShow[key]"
                :placeholder="$t(`stationTable.form.default.placeholder`)"
                style="width: 80%"
                disabled
              />
            </template>
          </a-form-item>
        </a-form>
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
        <!--编号-->
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
        <!--操作-->
        <template #operations="{ record }">
          <a-button
            v-permission="['admin']"
            type="text"
            size="small"
            @click="getStation(record)"
          >
            {{ $t('stationTable.columns.operations.view') }}
          </a-button>
          <a-button
            v-permission="['admin']"
            type="text"
            size="small"
            @click="handleUpdateClick(record)"
          >
            {{ $t('stationTable.columns.operations.change') }}
          </a-button>
          <a-button
            v-permission="['admin']"
            type="text"
            size="small"
            @click="deleteStationById(record.id)"
          >
            {{ $t('stationTable.columns.operations.delete') }}
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
    queryStationList,
    Station,
    addStation,
    updateStation,
    deleteStation,
  } from '@/api/center';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import copy from '@/utils/objects';
  import { AddRole, Permission, Role } from '@/api/acl';
  import { formCSV, toCSV } from '@/utils/csv';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const generateFormModel = () => {
    return {
      id: '', // id
      regionId: '', // 地区Id
      wareId: '', // 库房id
      name: '', // 名称
      phone: '', // 联系方式
      province: '', // 省市
      city: '', // 城市编号
      district: '', // 区域
      detailAddress: '', // 详细地址
      latitude: '', // 维度
      longitude: '', // 经度
      storePath: '', // 门店照片
      // param: null,
      workTime: '',
      workStatus: 0, // 营业时间
      createTime: null, // 创建日期
      updateTime: null, // 更新时间
    };
  };
  const formDefault = () => {
    return {
      id: '', // 分站id
      regionId: '', // 地区Id
      wareId: '', // 库房id
      name: '', // 名称
      phone: '', // 联系方式
      province: '', // 省市
      city: '', // 城市编号
      district: '', // 区域
      detailAddress: '', // 详细地址
      latitude: '', // 维度
      longitude: '', // 经度
      storePath: '', // 门店照片
      workTime: '', // 营业时间
      workStatus: '', // 营业状态
    };
  };

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<Station[]>([]);
  const formModel = ref(generateFormModel());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const isCreating = ref(false);
  const isUpdating = ref(false);
  const isDetailing = ref(false);

  let form = reactive(formDefault());
  let formShow = reactive(generateFormModel());

  const isAssignListFinished = ref(false);
  let options: Permission[];

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
      name: t('stationTable.size.mini'),
      value: 'mini',
    },
    {
      name: t('stationTable.size.small'),
      value: 'small',
    },
    {
      name: t('stationTable.size.medium'),
      value: 'medium',
    },
    {
      name: t('stationTable.size.large'),
      value: 'large',
    },
  ]);
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('stationTable.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
    },
    {
      title: t('stationTable.columns.id'),
      dataIndex: 'id',
    },
    {
      title: t('stationTable.columns.regionId'),
      dataIndex: 'regionId',
    },
    {
      title: t('stationTable.columns.wareId'),
      dataIndex: 'wareId',
    },
    {
      title: t('stationTable.columns.name'),
      dataIndex: 'name',
    },
    {
      title: t('stationTable.columns.phone'),
      dataIndex: 'phone',
    },
    {
      title: t('stationTable.columns.province'),
      dataIndex: 'province',
    },
    {
      title: t('stationTable.columns.city'),
      dataIndex: 'city',
    },
    {
      title: t('stationTable.columns.district'),
      dataIndex: 'district',
    },
    {
      title: t('stationTable.columns.detailAddress'),
      dataIndex: 'detailAddress',
    },
    // {
    //   title: t('stationTable.columns.createTime'),
    //   dataIndex: 'createTime',
    // },
    // {
    //   title: t('stationTable.columns.updateTime'),
    //   dataIndex: 'updateTime',
    // },
    // {
    //   title: t('stationTable.columns.latitude'),
    //   dataIndex: 'latitude',
    // },
    // {
    //   title: t('stationTable.columns.longitude'),
    //   dataIndex: 'longitude',
    // },
    // {
    //   title: t('stationTable.columns.storePath'),
    //   dataIndex: 'storePath',
    // },
    // {
    //   title: t('stationTable.columns.workStatus'),
    //   dataIndex: 'workStatus',
    // },
    // {
    //   title: t('stationTable.columns.workTime'),
    //   dataIndex: 'workTime',
    // },
    {
      title: t('stationTable.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);
  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('stationTable.form.workStatus.inBusiness'),
      value: 0,
    },
    {
      label: t('stationTable.form.workStatus.outBusiness'),
      value: 1,
    },
  ]);

  const fetchData = async (
    current: number,
    pageSize: number,
    params: Partial<Station>
  ) => {
    setLoading(true);
    try {
      const { data } = await queryStationList(current, pageSize, params);
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
  // 增改
  const handleCreateClick = () => {
    isCreating.value = true;
  };
  const handleUpdateClick = (station: Station) => {
    copy(station, form);
    isUpdating.value = true;
  };
  const handleBeforeOk = () => {
    if (isCreating.value) {
      addStation(form as unknown as Station);
    } else if (isUpdating.value) {
      updateStation(form as unknown as Station);
    } else {
      handleClose();
    }
  };
  const handleClose = () => {
    isCreating.value = false;
    isUpdating.value = false;
    search();
    form = reactive(formDefault());
  };
  // 删
  const deleteStationById = async (id: number) => {
    setLoading(true);
    try {
      await deleteStation(id);
      fetchData(pagination.current, pagination.pageSize, formModel.value);
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  // 详情信息
  const getStation = async (station: Station) => {
    // 显示当前分站的详细信息
    copy(station, formShow);
    isDetailing.value = true;
  };
  const handleDetailClose = () => {
    formShow = reactive(generateFormModel());
    isDetailing.value = false;
  };
  // 查询重置
  const search = () => {
    fetchData(basePagination.current, basePagination.pageSize, formModel.value);
  };
  const reset = () => {
    formModel.value = generateFormModel();
    search();
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
    name: 'StationTable',
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
