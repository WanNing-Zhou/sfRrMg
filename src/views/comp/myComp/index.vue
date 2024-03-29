<template>
  <div class="container">
    <Breadcrumb :items="['menu.comp', 'menu.comp.myComp']" />
    <a-card class="general-card" title="我的创建">
      <a-row>
        <a-col>
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="name" label="组件名称">
                  <a-input
                    v-model="formModel.name"
                    placeholder="请输入组件名称"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-space :size="18">
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
                    {{ $t('searchTable.form.reset') }}
                  </a-button>
                </a-space>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
      </a-row>

      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="cloneColumns as TableColumnData[]"
        :data="renderData"
        :bordered="false"
        :size="size"
        @page-change="onPageChange"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
        <template #filterType="{ record }">
          {{ $t(`searchTable.form.filterType.${record.filterType}`) }}
        </template>
        <template #deploy="{ record }">
          {{ record.deploy === 'userUrl' ? '自用地址' : '上传地址' }}
        </template>
        <template #updated="{ record }">
          {{ formatToDay(record.updated_at) }}
        </template>
        <template #created="{ record }">
          {{ formatToDay(record.created_at) }}
        </template>
        <template #status="{ record }">
          <template v-if="record.is_list === 0">
            <span class="circle"></span>
            待审核
          </template>
          <template v-else-if="record.is_list === 1">
            <span class="reject"></span>
            待审核
          </template>
          <template v-else-if="record.is_list === 2">
            <span class="circle pass"></span>
            已上架
          </template>
        </template>
        <template #operations="{ record }">
          <a-button type="text" size="small" @click="detailHandel(record)">
            详情
          </a-button>
          <a-button type="text" size="small" @click="updateHandel(record)">
            更新
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
  import { PolicyRecord, PolicyParams } from '@/api/list';
  import { Pagination } from '@/types/global';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import { useUserStore } from '@/store';
  import { getCompList } from '@/api/comp';
  import { formatToDay } from '@/utils/day';
  import { useRouter } from 'vue-router';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const generateFormModel = () => {
    return {
      name: '',
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
    showTotal: true,
  };
  const pagination = reactive({
    ...basePagination,
  });
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('searchTable.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
    },
    {
      title: 'ID',
      dataIndex: 'id',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'is_list',
      slotName: 'status',
    },
    {
      title: '名称',
      dataIndex: 'title',
    },
    {
      title: '部署方式',
      dataIndex: 'deploy',
      slotName: 'deploy',
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      slotName: 'updated',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      slotName: 'created',
    },
    {
      title: '描述',
      dataIndex: 'info',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('searchTable.columns.operations'),
      slotName: 'operations',
    },
  ]);

  const userStore = useUserStore();
  const fetchData = async (
    params: PolicyParams | any = { current: 1, pageSize: 20 },
  ) => {
    setLoading(true);
    try {
      const form = { ...params };
      if (!userStore.id) {
        await userStore.info();
      }
      form.createId = userStore.id;
      form.page = params.current;
      const { data } = await getCompList(form);
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
  };
  const onPageChange = (current: number) => {
    fetchData({ ...basePagination, current });
  };

  fetchData();
  const reset = () => {
    formModel.value = generateFormModel();
  };

  const router = useRouter();
  // 用于展示详情信息
  const detailHandel = (data: any) => {
    // 跳转到详情页面
    // 根据id查询详细信息
    router.push({ name: 'compDesc', query: { compId: data.id } });
  };

  const updateHandel = (data: any) => {
    // :TODO 跳转到上传表单 根据id进行更新
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
    { deep: true, immediate: true },
  );
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
