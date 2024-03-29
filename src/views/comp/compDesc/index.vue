<template>
  <div class="container comp-desc">
    <Breadcrumb :items="['menu.comp', 'menu.comp.desc']" />
    <a-card title="组件详情">
      <div class="wrapper">
        <div class="content">
          <a-row :gutter="[24, 12]">
            <a-col :span="24">
              <div>组件名称: {{ data.title }}</div>
            </a-col>
            <a-col :span="24">
              <div>组件id: {{ id }}</div>
            </a-col>
            <a-col>
              <div class="wq-status">
                状态:
                <template v-if="data.is_list === 0">
                  <span class="circle"></span>
                  待审核
                </template>
                <template v-else-if="data.is_list === 1">
                  <span class="circle reject"></span>
                  审核未通过
                </template>
                <template v-else-if="data.is_list === 2">
                  <span class="circle pass"></span>
                  已上架
                </template>
              </div>

            </a-col>
            <a-col :span="12">
              <div>组件预览图:</div>
              <div
                ><img
                  style="max-width: 600px; max-height: 600px"
                  :src="data.preview_url"
              /></div>
            </a-col>
            <a-col>
              <div
                >组件访问地址: {{ data.url }}
                <a-button type="text" @click="jump(data.url)"
                  >访问</a-button
                ></div
              >
            </a-col>
            <a-col>
              <div>创建时间: {{ formatToDay(data.created_at) }}</div>
            </a-col>
            <a-col>
              <div>更新时间: {{ formatToDay(data.updated_at) }}</div>
            </a-col>
            <a-col>
              <div style="display: flex">
                <span>简介:</span>
                <span>{{data.info}}</span>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router';
  import { onMounted, ref } from 'vue';
  import { CompInfoModel, getCompInfo } from '@/api/comp';
  import { Message } from '@arco-design/web-vue';
  import { formatToDay } from '@/utils/day';

  const route = useRoute();
  const id = route.query.compId;

  const data = ref<CompInfoModel>({});

  const fetchInfo = async () => {
    if (id) {
      const res = await getCompInfo({ id });
      data.value = res.data;
      return;
    }
    Message.warning('组件id不存在');
  };

  const jump = (url: string) => {
    window.open(url, '_blank');
  };

  onMounted(() => {
    fetchInfo();
  });
</script>

<style lang="less" scoped>
  .comp-desc {
    .wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 64px 64px;
      background-color: var(--color-bg-2);
      .content {
        min-width: 780px;
      }
    }
  }
</style>
