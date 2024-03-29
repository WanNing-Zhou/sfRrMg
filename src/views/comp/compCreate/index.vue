<template>
  <div class="container">
    <Breadcrumb :items="['menu.form', 'menu.form.step']" />
    <a-spin :loading="loading" style="width: 100%">
      <a-card class="general-card">
        <template #title>
          {{ $t('stepForm.step.title') }}
        </template>
        <div class="wrapper">
          <a-steps
            v-model:current="step"
            style="width: 580px"
            line-less
            class="steps"
          >
            <a-step :description="$t('stepForm.step.subTitle.baseInfo')">
              创建组件基本信息
            </a-step>
            <a-step description="组件设置"> 组件添加 </a-step>
            <a-step description="完成创建">
              {{ $t('stepForm.step.title.finish') }}
            </a-step>
          </a-steps>
          <keep-alive>
            <BaseInfo
              v-if="step === 1"
              :base="submitModel"
              @change-step="changeStep"
            />
            <ChannelInfo
              v-else-if="step === 2"
              :base="submitModel"
              :deploy="submitModel.deploy"
              @change-step="changeStep"
            />
            <Success  v-else-if="step === 3" :res-id="resId" @change-step="changeStep" />
          </keep-alive>
        </div>
      </a-card>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import useLoading from '@/hooks/loading';
  import { BaseInfoModel, ChannelInfoModel } from '@/api/form';
  import {
    CompInfoModel,
    getCompInfo,
    createNewComp,
    updateComp,
  } from '@/api/comp';
  import BaseInfo from './components/base-info.vue';
  import ChannelInfo from './components/channel-info.vue';
  import Success from './components/success.vue';

  const { loading, setLoading } = useLoading(false);
  const step = ref(1);
  const submitModel = ref<CompInfoModel>({} as CompInfoModel);

  const route = useRoute();
  const compId = route.query.compID || '';
  const fetchInfo = async () => {
    const res = await getCompInfo({ id: compId as string });
    submitModel.value = { ...res.data };
  };

  onMounted(() => {
    if (compId) {
      fetchInfo();
      // return
    }
  });

  const resId = ref('');

  const submitForm = async () => {
    setLoading(true);
    try {
      let res;
      if (compId) {
        res = await updateComp(submitModel.value);
      } else {
        res = await createNewComp(submitModel.value); // The mock api default success
      }
      resId.value = res?.data?.id || '';
      step.value = 3;
      submitModel.value = {} as CompInfoModel; // init
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  // 步骤改变出发
  const changeStep = (
    direction: string | number,
    model: BaseInfoModel | ChannelInfoModel
  ) => {
    if (typeof direction === 'number') {
      step.value = direction;
      return;
    }

    if (direction === 'forward' || direction === 'submit') {
      submitModel.value = {
        ...submitModel.value,
        ...model,
      };
      if (direction === 'submit') {
        submitForm();
        return;
      }
      step.value += 1;
    } else if (direction === 'backward') {
      step.value -= 1;
    }
  };
</script>

<script lang="ts">
  export default {
    name: 'Step',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 64px 0;
    background-color: var(--color-bg-2);
    :deep(.arco-form) {
      .arco-form-item {
        &:last-child {
          margin-top: 20px;
        }
      }
    }
  }

  .steps {
    margin-bottom: 76px;
  }
</style>
