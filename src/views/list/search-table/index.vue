<template>
  <!--    该模板为查询界面模板  -->
  <div class="container">
    <Breadcrumb :items="['menu.list', 'menu.list.searchTable']" />
    <a-modal
      v-model:visible="visibleModal"
      fullscreen
      ok-text="手工调度"
      cancel-text="返回"
      @ok="handleTask"
      @cancel="handleBack"
      unmount-on-close
    >
      <template #title> 订单详情 </template>
      <div><OrderInfo /></div>
    </a-modal>
    <a-card class="general-card" :title="$t('menu.list.searchTable')">
      <a-row>
        <a-col :flex="1">
          <!--这里是查询部分，分为6个查询部分，我们的订单查询要结合订单的元信息进行查询
          也就是数据库表的order_info部分
    order_no              char(64)       default ''                not null comment '订单号',
    nick_name             varchar(200)                             null comment '会员昵称',
    receiver_name         varchar(100)                             null comment '收货人姓名',
    order_status          tinyint        default 0                 not null comment '订单状态【0->待付款；1->待发货；2->已发货；3->待用户收货，已完成；-1->已取消】',
    payment_time          datetime                                 null comment '支付时间',
    take_name             varchar(50)    default ''                null comment '提货点名称',

    高级功能
    
    user_id               bigint         default 0                 not null comment '会员_id',
    total_amount          decimal(10, 2) default 0.00              not null comment '订单总额（应当设定为一个区间）',
    feight_fee            decimal(10, 2) default 0.00              not null comment '运费',
    refundable_time       datetime                                 null comment '可退款日期（签收后1天）',
    courier_id            bigint         default 0                 not null comment '配送员id',
    courier_name          varchar(20)                              null comment '配送员名称',
    courier_phone         varchar(11)                              null comment '配送员电话',
    receiver_phone        varchar(32)                              null comment '收货人电话',
    receiver_post_code    varchar(32)                              null comment '收货人邮编',
    receiver_province     bigint                                   null comment '省份/直辖市',
    receiver_city         bigint                                   null comment '城市',
    receiver_district     bigint                                   null comment '区',
    receiver_address      varchar(200)                             null comment '详细地址',
    delivery_time         datetime                                 null comment '发货时间',
    take_time             datetime                                 null comment '提货时间',
    receive_time          datetime                                 null comment '确认收货时间',
    ware_id               bigint         default 0                 not null comment '仓库id',
          -->
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
                  :label="$t('searchTable.form.number')"
                >
                  <a-input
                    v-model="formModel.order_no"
                    :placeholder="$t('searchTable.form.number.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="name" :label="$t('searchTable.form.name')">
                  <a-input
                    v-model="formModel.nick_name"
                    :placeholder="$t('searchTable.form.name.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="name"
                  :label="$t('searchTable.form.receiver_name')"
                >
                  <a-input
                    v-model="formModel.receiver_name"
                    :placeholder="
                      $t('searchTable.form.receiver_name.placeholder')
                    "
                  />
                </a-form-item>
              </a-col>
              <!--              <a-col :span="8">-->
              <!--                <a-form-item-->
              <!--                  field="contentType"-->
              <!--                  :label="$t('searchTable.form.contentType')"-->
              <!--                >-->
              <!--                  <a-select-->
              <!--                    v-model="formModel.contentType"-->
              <!--                    :options="contentTypeOptions"-->
              <!--                    :placeholder="$t('searchTable.form.selectDefault')"-->
              <!--                  />-->
              <!--                </a-form-item>-->
              <!--              </a-col>-->
              <a-col :span="8">
                <a-form-item
                  field="order_status"
                  :label="$t('searchTable.form.order_status')"
                >
                  <a-select
                    v-model="formModel.order_status"
                    :options="order_statusOptions"
                    :placeholder="$t('searchTable.form.selectDefault')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="createdTime"
                  :label="$t('searchTable.form.payment_time')"
                >
                  <a-range-picker
                    v-model="formModel.payment_time"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="number"
                  :label="$t('searchTable.form.take_name')"
                >
                  <a-input
                    v-model="formModel.take_name"
                    :placeholder="$t('searchTable.form.take_name')"
                  />
                </a-form-item>
              </a-col>
              <!--              <a-col :span="8">-->
              <!--                <a-form-item-->
              <!--                  field="status"-->
              <!--                  :label="$t('searchTable.form.status')"-->
              <!--                >-->
              <!--                  <a-select-->
              <!--                    v-model="formModel.status"-->
              <!--                    :options="statusOptions"-->
              <!--                    :placeholder="$t('searchTable.form.selectDefault')"-->
              <!--                  />-->
              <!--                </a-form-item>-->
              <!--              </a-col>-->
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('searchTable.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('searchTable.form.clean') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('searchTable.operation.create') }}
            </a-button>
            <a-upload action="/">
              <template #upload-button>
                <a-button>
                  {{ $t('searchTable.operation.import') }}
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
            {{ $t('searchTable.operation.download') }}
          </a-button>
          <a-tooltip :content="$t('searchTable.actions.refresh')">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="$t('searchTable.actions.density')">
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
          <a-tooltip :content="$t('searchTable.actions.columnSetting')">
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
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
        <!--        <template #order_status="{ record }">-->
        <!--          {{ console.log(OrderStateGetString(record.order_status)) }}-->
        <!--        </template>-->
        <template #order_status="{ record }">
          {{ OrderStateGetString(record.order_status).value }}
        </template>
        <!--<template #order_status="{ record }">
          <a-space>
            <a-avatar
              v-if="record.order_status === '待付款'"
              :size="16"
              shape="square"
            >
              <img
                alt="avatar"
                src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/581b17753093199839f2e327e726b157.svg~tplv-49unhts6dw-image.image"
              />
            </a-avatar>
            <a-avatar
              v-else-if="record.order_status === '待发货'"
              :size="16"
              shape="square"
            >
              <img
                alt="avatar"
                src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/77721e365eb2ab786c889682cbc721c1.svg~tplv-49unhts6dw-image.image"
              />
            </a-avatar>
            <a-avatar
              v-else-if="record.order_status === '已发货'"
              :size="16"
              shape="square"
            >
              <img
                alt="avatar"
                src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/77721e365eb2ab786c889682cbc721c1.svg~tplv-49unhts6dw-image.image"
              />
            </a-avatar>
            <a-avatar
              v-else-if="record.order_status === '已完成'"
              :size="16"
              shape="square"
            >
              <img
                alt="avatar"
                src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/77721e365eb2ab786c889682cbc721c1.svg~tplv-49unhts6dw-image.image"
              />
            </a-avatar>
            <a-avatar v-else :size="16" shape="square">
              <img
                alt="avatar"
                src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/ea8b09190046da0ea7e070d83c5d1731.svg~tplv-49unhts6dw-image.image"
              />
            </a-avatar>
            {{ $t(`searchTable.form.order_status.${record.order_status}`) }}
          </a-space>
        </template>-->
        <!-- <template #payment_time="{ record }">
          {{ $t(`searchTable.form.order_status.${record.payment_time}`) }}
        </template> -->
        <template #take_name="{ record }">
          {{ $t(`searchTable.form.order_status.${record.take_name}`) }}
        </template>
        <template #operations="{ rowIndex }">
          <a-button
            v-permission="['admin']"
            type="text"
            size="small"
            @click="handleSeeOrder(rowIndex)"
          >
            {{ $t('searchTable.columns.operations.view') }}
          </a-button>
          <a-button
            v-permission="['admin']"
            type="text"
            size="small"
            status="danger"
            @click="handleDeleteOrder(rowIndex)"
          >
            {{ $t('searchTable.columns.operations.delete') }}
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
    queryPolicyList,
    PolicyRecord,
    PolicyParams,
    deletePolicyList,
  } from '@/api/list';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import { Modal } from '@arco-design/web-vue';
  import router from '@/router';
  import { useOrderInfoStore } from '@/store';
  import { OrderStateGetString } from '@/utils/lsp-utils/order_state_to_string';
  import OrderInfo from './order_info/index.vue';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  // order_no              char(64)       default ''                not null comment '订单号',
  // nick_name             varchar(200)                             null comment '会员昵称',
  // receiver_name         varchar(100)                             null comment '收货人姓名',
  // order_status          tinyint        default 0                 not null comment '订单状态【0->待付款；1->待发货；2->已发货；3->待用户收货，已完成；-1->已取消】',
  // payment_time          datetime                                 null comment '支付时间',
  // take_name             varchar(50)    default ''                null comment '提货点名称',

  const generateFormModel = () => {
    return {
      order_no: '',
      nick_name: '',
      receiver_name: '',
      order_status: '',
      payment_time: '',
      take_name: '',
    };
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<PolicyRecord[]>([]);
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
      name: t('searchTable.size.mini'),
      value: 'mini',
    },
    {
      name: t('searchTable.size.small'),
      value: 'small',
    },
    {
      name: t('searchTable.size.medium'),
      value: 'medium',
    },
    {
      name: t('searchTable.size.large'),
      value: 'large',
    },
  ]);
  const columns = computed<TableColumnData[]>(() => [
    // order_no
    // nick_name
    // receiver_name
    // order_status
    // payment_time
    // take_name
    // total_amount
    // courier_name
    {
      title: t('searchTable.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
    },
    {
      title: t('searchTable.columns.order_no'),
      dataIndex: 'order_no',
    },
    {
      title: t('searchTable.columns.nick_name'),
      dataIndex: 'nick_name',
    },
    {
      title: t('searchTable.columns.receiver_name'),
      dataIndex: 'receiver_name',
      slotName: 'receiver_name',
    },
    {
      title: t('searchTable.columns.order_status'),
      dataIndex: 'order_status',
      slotName: 'order_status',
    },
    {
      title: t('searchTable.columns.payment_time'),
      dataIndex: 'payment_time',
    },
    {
      title: t('searchTable.columns.take_name'),
      dataIndex: 'take_name',
    },
    {
      title: t('searchTable.columns.total_amount'),
      dataIndex: 'total_amount',
      slotName: 'total_amount',
    },
    {
      title: t('searchTable.columns.courier_name'),
      dataIndex: 'courier_name',
      slotName: 'courier_name',
    },
    {
      title: t('searchTable.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const contentTypeOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('searchTable.form.contentType.img'),
      value: 'img',
    },
    {
      label: t('searchTable.form.contentType.horizontalVideo'),
      value: 'horizontalVideo',
    },
    {
      label: t('searchTable.form.contentType.verticalVideo'),
      value: 'verticalVideo',
    },
  ]);
  // eslint-disable-next-line camelcase
  const order_statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('searchTable.form.order_status.PendingPayment'),
      value: 'PendingPayment',
    },
    {
      label: t('searchTable.form.order_status.PendingShipment'),
      value: 'PendingShipment',
    },
    {
      label: t('searchTable.form.order_status.Shipped'),
      value: 'Shipped',
    },
    {
      label: t('searchTable.form.order_status.Completed'),
      value: 'Completed',
    },
    {
      label: t('searchTable.form.order_status.Cancelled'),
      value: 'Cancelled',
    },
  ]);
  computed<SelectOptionData[]>(() => [
    {
      label: t('searchTable.form.status.online'),
      value: 'online',
    },
    {
      label: t('searchTable.form.status.offline'),
      value: 'offline',
    },
  ]);
  // 从后端获取各种数据，我们把查询条件也传过去，让后端处理处数据来
  const fetchData = async (
    params: PolicyParams = { current: 1, pageSize: 20 }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryPolicyList(params);
      renderData.value = data.list;
      pagination.current = params.current;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    fetchData({
      ...basePagination,
      ...formModel.value,
    } as unknown as PolicyParams);
    // 传入和数据结构就是两个字典拼在一起，仅此而已
    // console.log({
    //     ...basePagination,
    //     ...formModel.value,
    // })
  };
  const onPageChange = (current: number) => {
    fetchData({ ...basePagination, current });
  };

  fetchData();

  // 这个是清空，也就是清空搜索条件，仅此而已
  const reset = () => {
    // 这个fromModel就是搜索条件
    formModel.value = generateFormModel();
    // console.log(formModel.value);
  };

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

  // lsp custom functions
  const handleDeleteOrder = async (index: any) => {
    setLoading(true);
    try {
      const { data } = await deletePolicyList(renderData.value[index].id); // 这里收集返回信息,如果失败 todo 要提醒
      if (false) {
        // todo 如果失败 弹框提示
      } else {
        renderData.value.splice(index, 1); // 只有这个的话,前端的就会直接减少一列
      }
      fetchData(); // 获取数组,  todo 不过这个可以直接让后端返回一个处理好的数组
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const orderStore = useOrderInfoStore();
  const visible = ref(false);
  const handleSeeOrder = (index: any) => {
    setLoading(true);
    const dateToshow = renderData.value[index];
    // todo 转到一个新页面去， 有什么操作？有OK操作（手动调度），有cancle操作（修改订单地址）
    orderStore.setInfo(dateToshow);
    // await router.push({ name: 'order_info' });
    visibleModal.value = true;
    setLoading(false);
  };

  // render的时间全部都是一个时间,这个无所谓
  // console.log(renderData);

  const visibleModal = ref(false);
  const handleTask = () => {
    visible.value = false;
  };
  const handleBack = () => {
    visible.value = false;
  };
</script>

<script lang="ts">
  export default {
    name: 'SearchTable',
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
