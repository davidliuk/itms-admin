<template>
  <div>
    <a-modal
      :visible="isAddingAdmin"
      title="授权管理员"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <!--      <AddAmdin v-model:idelList="idleAdminList"/>-->
      <a-scrollbar style="height: 480px; overflow: auto">
        <div>
          <a-card
            v-for="item in idleAdminList"
            :key="item"
            hoverable
            :style="{ width: '100%', marginBottom: '10px' }"
            :size="'small'"
          >
            <div
              :style="{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }"
            >
              <span
                :style="{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#1D2129',
                }"
              >
                <a-avatar :size="36">
                  <img alt="avatar" :src="item.avatar" />
                </a-avatar>
                <a-typography-text class="admin-name">
                  <a-col>{{ item.name }}</a-col>
                  <a-col>{{ item.email }}</a-col>
                </a-typography-text>
              </span>
              <div :style="{ display: 'flex', alignItems: 'center' }">
                <a-checkbox v-model="item.shouldDelete"></a-checkbox>
              </div>
            </div>
          </a-card>
        </div>
      </a-scrollbar>

      <template #footer>
        <div style="display: flex; justify-content: space-between">
          <a-input-search
            :style="{ width: '45%' }"
            placeholder="搜索..."
            :loading="isloadingContent"
            @search="
              (value, ev) => {
                inputContent = value;
              }
            "
          />
          <div
            style="width: 28%; display: flex; justify-content: space-between"
          >
            <a-button type="outline" @click="handleCancel">取消</a-button>
            <a-button type="primary" @click="handleOk">确定</a-button>
          </div>
        </div>
      </template>
    </a-modal>

    <a-modal
      :visible="isEditingAdmin"
      title="管理员详情"
          hide-cancel
    @ok="handleCancelEdit"
    >
      <a-space align="center" fill style="display: flex;justify-content: center">
        <a-col style="display: flex; flex-direction: column; align-items: center; margin-right: 12px">
          <a-row>
            <a-avatar :size="48">
              <img alt="avatar" :src="(adminDetailInfo as WareAdmins).avatar" />
            </a-avatar>
          </a-row>
          <a-row style="margin-top: 2px">
            {{ adminDetailInfo.name }}
          </a-row>
        </a-col>
      <a-col >
        <a-col>
          <a-typography-text
            >ID：{{
              adminDetailInfo.id
            }}</a-typography-text
          >
        </a-col>
        <a-col>
          <a-typography-text
            >电话：{{ adminDetailInfo.phone }}</a-typography-text
          >
        </a-col>
        <a-col>
          <a-typography-text
            >邮箱：{{ adminDetailInfo.email }}</a-typography-text
          >
        </a-col>
      </a-col>

      </a-space>

    </a-modal>

    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '0' }"
      :body-style="{ padding: '12px 20px 0 20px' }"
    >
      <template #title>
        <div v-if="isManaging" class="two-side">
          <a-button
            type="outline"
            @click="
              (ev) => {
                isManaging = false;
                fetchData();
              }
            "
          >
            <icon-undo />
            取消
          </a-button>

          <div>
            <a-button
              v-if="!isChecking"
              type="outline"
              status="danger"
              :disabled="!haveDelete"
              @click="
                (ev) => {
                  isChecking = true;
                }
              "
            >
              <icon-delete />
              删除
            </a-button>
            <a-button
              v-else
              type="outline"
              status="danger"
              @click="handleDeleteAdmin"
            >
              <icon-check />
              确认删除
            </a-button>
          </div>
        </div>

        <div v-else>
          管理员
          <a-avatar-group :max-count="3" :size="24">
            <a-avatar v-for="item in adminList" :key="item">
              <img alt="avatar" :src="item.avatar" />
            </a-avatar>
          </a-avatar-group>
        </div>
      </template>
      <template v-if="!isManaging" #extra>
        <a-button
          type="text"
          @click="
            (ev) => {
              isManaging = true;
            }
          "
          >管理</a-button
        >
      </template>
      <a-row>
        <div
          v-if="isManaging"
          :style="{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: '10px',
          }"
        >
          <!--新建仓库-->
          <a-card
            :bordered="true"
            hoverable
            :style="{
              width: '100%',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }"
            :size="'small'"
            @click="handleGetInAdmin"
          >
            <icon-plus style="font-size: 16px" />授权新管理员
          </a-card>
        </div>

        <a-card
          v-for="item in adminList"
          :key="item"
          hoverable
          :style="{ width: '100%', marginBottom: '10px' }"
          :size="'small'"
        >
          <div
            :style="{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }"
          >
            <span
              :style="{
                display: 'flex',
                alignItems: 'center',
                color: '#1D2129',
              }"
            >
              <a-avatar :size="24">
                <img alt="avatar" :src="item.avatar" />
              </a-avatar>
              <!-- todo: 溢出管理-->
              <a-typography-text class="admin-name">{{
                item.name
              }}</a-typography-text>
            </span>
            <div :style="{ display: 'flex', alignItems: 'center' }">
              <a-link
                v-if="!isManaging"
                type="text"
                @click="() => handleEditAdminInfo(item)"
              >
                详情
              </a-link>
              <a-checkbox
                v-else
                v-model="item.shouldDelete"
                @change="handleIfDelete"
              ></a-checkbox>
            </div>
          </div>
        </a-card>
      </a-row>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import useWarehouseInfoStore from '@/store/modules/warehouse-info';
  import { compile, computed, Ref, ref } from 'vue';
  import {
    queryCategoriesNameList,
    queryWareAdmins,
    queryWareList,
    updateAdmin,
    WareAdmins,
  } from '@/api/dashboard';
  import { isMap } from 'lodash';
  import { Modal } from '@arco-design/web-vue';

  const isManaging = ref(false);
  const isChecking = ref(false);
  const isAddingAdmin = ref(false);
  const isloadingContent = ref(false);
  const isEditingAdmin = ref(false);
  const haveDelete = ref(false);

  const links = [
    { text: 'workplace.contentManagement', icon: 'icon-file' },
    { text: 'workplace.contentStatistical', icon: 'icon-storage' },
    { text: 'workplace.advanced', icon: 'icon-settings' },
    { text: 'workplace.onlinePromotion', icon: 'icon-mobile' },
    { text: 'workplace.contentPutIn', icon: 'icon-fire' },
  ];

  const wareInfo = ref(useWarehouseInfoStore().$state);
  const adminList: Ref<WareAdmins[]> = ref([]);
  const loading = ref(false);
  const colors = ref(['#7BC616', '#14C9C9', '#168CFF', '#FF7D00', '#FFC72E']);

  const fetchData = async () => {
    // get wareInfo
    try {
      loading.value = true;
      const { data } = await queryWareAdmins(wareInfo.value.id as string);

      adminList.value = data.map((entity) => ({
        ...entity,
        shouldDelete: false,
      }));

      console.log(adminList.value);
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      loading.value = false;
    }
  };
  fetchData();

  const handleIfDelete = () => {
    let counter = 0;
    adminList.value.forEach((entity) => {
      if (entity.shouldDelete === true) {
        counter += 1;
      }
    });
    if (counter !== 0) haveDelete.value = true;
    else haveDelete.value = false;
  };
  const handleDeleteAdmin = async () => {
    adminList.value.forEach(async (entity) => {
      if (entity.shouldDelete) {
        entity.wareId = 0;
        await updateAdmin(entity);
      }
    });
    await fetchData();

    isChecking.value = false;
    isManaging.value = false;
  };

  const baseIdleAdminList: Ref<WareAdmins[]> = ref([]);

  const fetchIdleAdminList = async () => {
    // get adminList
    try {
      loading.value = true;
      const { data } = await queryWareAdmins('0');

      baseIdleAdminList.value = data.map((entity) => ({
        ...entity,
        shouldDelete: false,
      }));

      console.log(baseIdleAdminList.value);
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      loading.value = false;
    }
  };
  const handleGetInAdmin = () => {
    fetchIdleAdminList();
    isAddingAdmin.value = true;
  };

  const handleCancel = () => {
    isAddingAdmin.value = false;
  };

  const inputContent = ref('');
  const idleAdminList: Ref<WareAdmins[]> = computed(() => {
    return baseIdleAdminList.value.filter((entity) => {
      return (
        entity.name.includes(inputContent.value) ||
        (entity.email as string).includes(inputContent.value)
      );
    });
  });

  const handleOk = async () => {
    idleAdminList.value.forEach(async (entity) => {
      if (entity.shouldDelete) {
        entity.wareId = Number(wareInfo.value.id);
        await updateAdmin(entity);
      }
    });
    await fetchData();

    isChecking.value = false;
    isManaging.value = false;
    isAddingAdmin.value = false;
  };

  const adminDetailInfo=ref<WareAdmins>({
    id: -1,
    createTime: '',
    updateTime: '',
    param: {},
    username: '',
    password: '',
    avatar: '',
    name: '',
    phone: '',
    email: '',
    wareId: 0,
    stationId: 0,
    roles: null,
    permissions: null,
    shouldDelete: false,
  });

  const handleEditAdminInfo = (item: WareAdmins) => {
    adminDetailInfo.value = item;
    console.log(typeof adminDetailInfo.value);
    isEditingAdmin.value = true;
  };

  const handleCancelEdit = () => {
    isEditingAdmin.value = false;
  };
</script>

<style scoped lang="less">
  .two-side {
    display: flex;
    justify-content: space-between;
  }

  .admin-name {
    margin-left: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 125px;
  }
</style>
