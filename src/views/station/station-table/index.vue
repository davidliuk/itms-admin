<template>
  <div class="container">
    <Breadcrumb :items="['menu.station', 'menu.station.stationTable']" />
    <a-card class="general-card" :title="$t('menu.station.stationTable')">
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
              <!--              &lt;!&ndash;开始时间&ndash;&gt;-->
              <!--              <a-col :span="8">-->
              <!--                <a-form-item-->
              <!--                  field="createdTime"-->
              <!--                  :label="$t('stationTable.form.createdTime')"-->
              <!--                >-->
              <!--                  <a-range-picker-->
              <!--                    v-model="formModel.createdTime"-->
              <!--                    style="width: 100%"-->
              <!--                  />-->
              <!--                </a-form-item>-->
              <!--              </a-col>-->
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
            <a-upload action="/">
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
          <a-button>
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
            <template v-if="key === 'workStatus'">
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
            <!--            <a-input-->
            <!--              v-model="form[key]"-->
            <!--              :placeholder="$t(`stationTable.form.${key}.placeholder`)"-->
            <!--            />-->
            <!--          </a-form-item>-->
            <!--          <a-form-item-->
            <!--            field="workStatus"-->
            <!--            :label="$t('stationTable.form.workStatus')"-->
            <!--          >-->
            <!--            <a-select-->
            <!--              v-model="formModel.workType"-->
            <!--              :options="statusOptions"-->
            <!--              :placeholder="$t('stationTable.form.workStatus.placeholder')"-->
            <!--            />-->
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
        <!--分站编号-->
        <template #id="{ record }">
          {{ $t(`stationTable.form.id.${record.id}`) }}
        </template>
        <!--区域编号-->
        <template #regionId="{ record }">
          {{ $t(`stationTable.form.regionId.${record.regionId}`) }}
        </template>
        <!--库房编号-->
        <template #wareId="{ record }">
          {{ $t(`stationTable.form.wareId.${record.wareId}`) }}
        </template>
        <!--名称-->
        <template #name="{ record }">
          {{ $t(`stationTable.form.name.${record.name}`) }}
        </template>
        <!--电话号-->
        <template #phone="{ record }">
          {{ $t(`stationTable.form.phone.${record.phone}`) }}
        </template>
        <!--省-->
        <template #province="{ record }">
          {{ $t(`stationTable.form.province.${record.province}`) }}
        </template>
        <!--市-->
        <template #city="{ record }">
          {{ $t(`stationTable.form.city.${record.city}`) }}
        </template>
        <!--区-->
        <template #district="{ record }">
          {{ $t(`stationTable.form.district.${record.district}`) }}
        </template>
        <!--详细地址-->
        <template #detailAddress="{ record }">
          {{ $t(`stationTable.form.detailAddress.${record.detailAddress}`) }}
        </template>
        <!--        &lt;!&ndash;纬度&ndash;&gt;-->
        <!--        <template #latitude="{ record }">-->
        <!--          {{ $t(`stationTable.form.latitude.${record.latitude}`) }}-->
        <!--        </template>-->
        <!--        &lt;!&ndash;经度&ndash;&gt;-->
        <!--        <template #longitude="{ record }">-->
        <!--          {{ $t(`stationTable.form.longitude.${record.longitude}`) }}-->
        <!--        </template>-->
        <!--        &lt;!&ndash;门店照片&ndash;&gt;-->
        <!--        <template #storePath="{ record }">-->
        <!--          {{ $t(`stationTable.form.storePath.${record.storePath}`) }}-->
        <!--        </template>-->
        <!--        &lt;!&ndash;创建时间&ndash;&gt;-->
        <!--        <template #creatTime="{ record }">-->
        <!--          {{ $t(`stationTable.form.creatTime.${record.creatTime}`) }}-->
        <!--        </template>-->
        <!--        &lt;!&ndash;更新时间&ndash;&gt;-->
        <!--        <template #updateTime="{ record }">-->
        <!--          {{ $t(`stationTable.form.updateTime.${record.updateTime}`) }}-->
        <!--        </template>-->
        <!--        &lt;!&ndash;营业状态&ndash;&gt;-->
        <!--        <template #workStatus="{ record }">-->
        <!--          {{ $t(`stationTable.form.workStatus.${record.workStatus}`) }}-->
        <!--        </template>-->
        <!--        &lt;!&ndash;营业时间&ndash;&gt;-->
        <!--        <template #workTime="{ record }">-->
        <!--          {{ $t(`stationTable.form.workTime.${record.workTime}`) }}-->
        <!--        </template>-->
        <!--操作-->
        <template #operations="{ record }">
          <a-button
            v-permission="['admin']"
            type="text"
            size="small"
            @click="getStationById(record.id)"
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
    getStation,
  } from '@/api/station';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import copy from '@/utils/objects';
  import { deleteAdmin } from '@/api/acl';

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
      param: null,
      workTime: '',
      workStatus: 0, // 营业时间
      creatTime: null, // 创建日期
      updateTime: null, // 更新时间
    };
  };
  const formDefault = () => {
    return {
      id: '', // id
      regionId: '', // 地区Id
      wareId: '', // 库房id
      name: '', // 名称
      phone: '', // 联系方式
      detailAddress: '', // 详细地址
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

  let form = reactive(formDefault());

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
    //   title: t('stationTable.columns.creatTime'),
    //   dataIndex: 'creatTime',
    // },
    // {
    //   title: t('stationTable.columns.updateTime'),
    //   dataIndex: 'updateTime',
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
    } else {
      updateStation(form as unknown as Station);
    }
    fetchData(pagination.current, pagination.pageSize, formModel.value);
    handleClose();
  };
  const handleClose = () => {
    isCreating.value = false;
    isUpdating.value = false;
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
  // 查询重置
  const search = () => {
    fetchData(basePagination.current, basePagination.pageSize, formModel.value);
  };
  const reset = () => {
    formModel.value = generateFormModel();
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
